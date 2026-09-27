/**
 * Passbob ~ fork of the Passbolt browser extension
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * Based on Passbolt, Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 */
import { OpenpgpAssertion } from "../../utils/openpgp/openpgpAssertions";
import EncryptMessageService from "../crypto/encryptMessageService";
import DecryptMessageService from "../crypto/decryptMessageService";

export const PASSBOB_DRAFT_STORAGE_KEY = "passbob.draft";
export const DRAFT_VALIDITY_IN_MS = 10 * 60 * 1000;
const MAX_PATHNAME_LENGTH = 512;
const MAX_VALUE_LENGTH = 50000;

/**
 * Keeps the unsaved content of a quickaccess form (create or edit a resource) when the popup closes.
 *
 * The draft lives in the session storage (memory only, cleared when the browser closes, not readable by content
 * scripts). Non secret fields are stored as is. Secret fields (password, TOTP key...) are encrypted for the user's own
 * OpenPGP public key, the same way secrets are encrypted for the server, so reading them back requires the user's
 * private key, thus the passphrase.
 */
class PassbobDraftService {
  /**
   * Save a draft, replacing any previous one.
   * @param {AccountEntity} account The user account
   * @param {{pathname: string, fields: object, secrets: object}} draft The draft
   * @returns {Promise<void>}
   */
  static async save(account, draft) {
    const { pathname, fields, secrets } = PassbobDraftService.assertDraft(draft);
    const publicKey = await OpenpgpAssertion.readKeyOrFail(account.userPublicArmoredKey);
    const encryptedSecrets = await EncryptMessageService.encrypt(JSON.stringify(secrets), publicKey);
    await browser.storage.session.set({
      [PASSBOB_DRAFT_STORAGE_KEY]: { pathname, fields, encryptedSecrets, savedAt: Date.now() },
    });
  }

  /**
   * Whether a valid draft exists for the given route, without decrypting anything.
   * @param {string} pathname The quickaccess route
   * @returns {Promise<boolean>}
   */
  static async has(pathname) {
    const stored = await PassbobDraftService.getStored();
    return stored?.pathname === pathname;
  }

  /**
   * Get and decrypt the draft of the given route.
   * @param {string} pathname The quickaccess route
   * @param {openpgp.PrivateKey} privateKey The user decrypted private key
   * @returns {Promise<{pathname: string, fields: object, secrets: object, savedAt: number}|null>}
   */
  static async get(pathname, privateKey) {
    const stored = await PassbobDraftService.getStored();
    if (stored?.pathname !== pathname) {
      return null;
    }
    const message = await OpenpgpAssertion.readMessageOrFail(stored.encryptedSecrets);
    const secrets = JSON.parse(await DecryptMessageService.decrypt(message, privateKey));
    return { pathname: stored.pathname, fields: stored.fields, secrets, savedAt: stored.savedAt };
  }

  /**
   * Remove the draft.
   * @returns {Promise<void>}
   */
  static async clear() {
    await browser.storage.session.remove(PASSBOB_DRAFT_STORAGE_KEY);
  }

  /**
   * Get the stored draft if it is still valid, an expired draft is removed.
   * @returns {Promise<object|null>}
   * @private
   */
  static async getStored() {
    const data = await browser.storage.session.get(PASSBOB_DRAFT_STORAGE_KEY);
    const stored = data?.[PASSBOB_DRAFT_STORAGE_KEY];
    if (!stored) {
      return null;
    }
    if (Date.now() - stored.savedAt > DRAFT_VALIDITY_IN_MS) {
      await PassbobDraftService.clear();
      return null;
    }
    return stored;
  }

  /**
   * Validate a draft coming from the quickaccess.
   * @param {object} draft The draft
   * @returns {{pathname: string, fields: object, secrets: object}}
   * @throws {TypeError} If the draft is not valid
   * @private
   */
  static assertDraft(draft) {
    const { pathname, fields = {}, secrets = {} } = draft || {};
    if (typeof pathname !== "string" || pathname.length === 0 || pathname.length > MAX_PATHNAME_LENGTH) {
      throw new TypeError("The draft pathname should be a non empty string.");
    }
    return {
      pathname,
      fields: PassbobDraftService.assertStringValues(fields, "fields"),
      secrets: PassbobDraftService.assertStringValues(secrets, "secrets"),
    };
  }

  /**
   * Keep an object of string values only.
   * @param {object} values The values
   * @param {string} name The name of the values, for the error message
   * @returns {object}
   * @throws {TypeError} If a value is not a string or is too long
   * @private
   */
  static assertStringValues(values, name) {
    if (typeof values !== "object" || values === null || Array.isArray(values)) {
      throw new TypeError(`The draft ${name} should be an object.`);
    }
    const result = {};
    for (const [key, value] of Object.entries(values)) {
      if (typeof value !== "string" || value.length > MAX_VALUE_LENGTH) {
        throw new TypeError(`The draft ${name} values should be strings.`);
      }
      result[key] = value;
    }
    return result;
  }
}

export default PassbobDraftService;
