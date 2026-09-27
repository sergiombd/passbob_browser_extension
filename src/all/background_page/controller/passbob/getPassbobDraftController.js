/**
 * Passbob ~ fork of the Passbolt browser extension
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * Based on Passbolt, Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 */
import PassbobDraftService from "../../service/passbob/passbobDraftService";
import GetPassphraseService from "../../service/passphrase/getPassphraseService";
import GetDecryptedUserPrivateKeyService from "../../service/account/getDecryptedUserPrivateKeyService";

class GetPassbobDraftController {
  /**
   * @param {Worker} worker The worker
   * @param {string} requestId The request identifier
   * @param {AccountEntity} account The user account
   */
  constructor(worker, requestId, account) {
    this.worker = worker;
    this.requestId = requestId;
    this.getPassphraseService = new GetPassphraseService(account);
  }

  /**
   * Wrapper of exec function to run it with worker.
   * @param {string} pathname The quickaccess route of the draft
   * @returns {Promise<void>}
   */
  async _exec(pathname) {
    try {
      const draft = await this.exec(pathname);
      this.worker.port.emit(this.requestId, "SUCCESS", draft);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, "ERROR", error);
    }
  }

  /**
   * Get and decrypt the draft of a quickaccess route. The passphrase is only requested when a draft exists.
   * @param {string} pathname The quickaccess route of the draft
   * @returns {Promise<object|null>}
   */
  async exec(pathname) {
    if (!(await PassbobDraftService.has(pathname))) {
      return null;
    }
    const passphrase = await this.getPassphraseService.getPassphrase(this.worker);
    const privateKey = await GetDecryptedUserPrivateKeyService.getKey(passphrase);
    return PassbobDraftService.get(pathname, privateKey);
  }
}

export default GetPassbobDraftController;
