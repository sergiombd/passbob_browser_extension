/**
 * Passbob ~ fork of the Passbolt browser extension
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * Based on Passbolt, Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 */
import { pgpKeys } from "passbolt-styleguide/test/fixture/pgpKeys/keys";
import AccountEntity from "../../model/entity/account/accountEntity";
import { defaultAccountDto } from "../../model/entity/account/accountEntity.test.data";
import { OpenpgpAssertion } from "../../utils/openpgp/openpgpAssertions";
import PassbobDraftService, { DRAFT_VALIDITY_IN_MS, PASSBOB_DRAFT_STORAGE_KEY } from "./passbobDraftService";

const CREATE_ROUTE = "/webAccessibleResources/quickaccess/resources/create";
const draft = {
  pathname: CREATE_ROUTE,
  fields: { name: "GitLab", uri: "https://gitlab.example.com", username: "jdoe" },
  secrets: { password: "correct horse battery staple" },
};

describe("PassbobDraftService", () => {
  let account, privateKey;

  beforeEach(async () => {
    await browser.storage.session.clear();
    account = new AccountEntity(defaultAccountDto());
    privateKey = await OpenpgpAssertion.readKeyOrFail(pgpKeys.ada.private_decrypted);
  });

  it("stores the fields in clear and the secrets encrypted for the user's own key", async () => {
    expect.assertions(4);
    await PassbobDraftService.save(account, draft);

    const stored = (await browser.storage.session.get(PASSBOB_DRAFT_STORAGE_KEY))[PASSBOB_DRAFT_STORAGE_KEY];
    expect(stored.fields).toStrictEqual(draft.fields);
    expect(stored.encryptedSecrets).toContain("-----BEGIN PGP MESSAGE-----");
    expect(JSON.stringify(stored)).not.toContain(draft.secrets.password);
    expect(stored).not.toHaveProperty("secrets");
  });

  it("decrypts the draft of the same route", async () => {
    expect.assertions(3);
    await PassbobDraftService.save(account, draft);

    const restored = await PassbobDraftService.get(CREATE_ROUTE, privateKey);
    expect(restored.fields).toStrictEqual(draft.fields);
    expect(restored.secrets).toStrictEqual(draft.secrets);
    expect(restored.pathname).toStrictEqual(CREATE_ROUTE);
  });

  it("returns nothing for another route", async () => {
    expect.assertions(2);
    await PassbobDraftService.save(account, draft);

    await expect(PassbobDraftService.has("/webAccessibleResources/quickaccess/home")).resolves.toBe(false);
    await expect(PassbobDraftService.get("/webAccessibleResources/quickaccess/home", privateKey)).resolves.toBeNull();
  });

  it("forgets an expired draft", async () => {
    expect.assertions(2);
    await PassbobDraftService.save(account, draft);
    const stored = (await browser.storage.session.get(PASSBOB_DRAFT_STORAGE_KEY))[PASSBOB_DRAFT_STORAGE_KEY];
    stored.savedAt = Date.now() - DRAFT_VALIDITY_IN_MS - 1;
    await browser.storage.session.set({ [PASSBOB_DRAFT_STORAGE_KEY]: stored });

    await expect(PassbobDraftService.has(CREATE_ROUTE)).resolves.toBe(false);
    const after = await browser.storage.session.get(PASSBOB_DRAFT_STORAGE_KEY);
    expect(after[PASSBOB_DRAFT_STORAGE_KEY]).toBeUndefined();
  });

  it("clears the draft", async () => {
    expect.assertions(1);
    await PassbobDraftService.save(account, draft);
    await PassbobDraftService.clear();
    await expect(PassbobDraftService.has(CREATE_ROUTE)).resolves.toBe(false);
  });

  it.each([
    [null],
    [{ pathname: "" }],
    [{ pathname: CREATE_ROUTE, fields: { name: 42 } }],
    [{ pathname: CREATE_ROUTE, secrets: ["not", "an", "object"] }],
    [{ pathname: CREATE_ROUTE, secrets: { password: "x".repeat(50001) } }],
  ])("rejects an invalid draft %#", async (invalidDraft) => {
    expect.assertions(1);
    await expect(PassbobDraftService.save(account, invalidDraft)).rejects.toThrow(TypeError);
  });
});
