/**
 * Passbob ~ fork of the Passbolt browser extension
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * Based on Passbolt, Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 */
import PassbobDraftService from "../../service/passbob/passbobDraftService";

class SavePassbobDraftController {
  /**
   * @param {Worker} worker The worker
   * @param {string} requestId The request identifier
   * @param {AccountEntity} account The user account
   */
  constructor(worker, requestId, account) {
    this.worker = worker;
    this.requestId = requestId;
    this.account = account;
  }

  /**
   * Wrapper of exec function to run it with worker.
   * @param {object} draft The draft to save
   * @returns {Promise<void>}
   */
  async _exec(draft) {
    try {
      await this.exec(draft);
      this.worker.port.emit(this.requestId, "SUCCESS");
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, "ERROR", error);
    }
  }

  /**
   * Save the draft of a quickaccess form, its secrets encrypted for the user's own key.
   * @param {{pathname: string, fields: object, secrets: object}} draft The draft
   * @returns {Promise<void>}
   */
  async exec(draft) {
    await PassbobDraftService.save(this.account, draft);
  }
}

export default SavePassbobDraftController;
