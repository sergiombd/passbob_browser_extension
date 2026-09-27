/**
 * Passbob ~ fork of the Passbolt browser extension
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * Based on Passbolt, Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 */
import SavePassbobDraftController from "../controller/passbob/savePassbobDraftController";
import GetPassbobDraftController from "../controller/passbob/getPassbobDraftController";
import PassbobDraftService from "../service/passbob/passbobDraftService";

const listen = function (worker, apiClientOptions, account) {
  /*
   * Save the draft of a quickaccess form.
   *
   * @listens passbob.draft.save
   * @param {string} requestId The request identifier
   * @param {object} draft The draft {pathname, fields, secrets}
   */
  worker.port.on("passbob.draft.save", async (requestId, draft) => {
    const controller = new SavePassbobDraftController(worker, requestId, account);
    await controller._exec(draft);
  });

  /*
   * Get the decrypted draft of a quickaccess route, null if none.
   *
   * @listens passbob.draft.get
   * @param {string} requestId The request identifier
   * @param {string} pathname The quickaccess route
   */
  worker.port.on("passbob.draft.get", async (requestId, pathname) => {
    const controller = new GetPassbobDraftController(worker, requestId, account);
    await controller._exec(pathname);
  });

  /*
   * Remove the draft.
   *
   * @listens passbob.draft.clear
   * @param {string} requestId The request identifier
   */
  worker.port.on("passbob.draft.clear", async (requestId) => {
    try {
      await PassbobDraftService.clear();
      worker.port.emit(requestId, "SUCCESS");
    } catch (error) {
      console.error(error);
      worker.port.emit(requestId, "ERROR", error);
    }
  });
};

export const PassbobEvents = { listen };
