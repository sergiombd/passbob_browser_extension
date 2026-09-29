/**
 * Passbob ~ fork of the Passbolt browser extension
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * Based on Passbolt, Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 */
import BrowserTabService from "../../service/ui/browserTab.service";

class CapturePassbobTabController {
  /**
   * @param {Worker} worker The worker
   * @param {string} requestId The request identifier
   */
  constructor(worker, requestId) {
    this.worker = worker;
    this.requestId = requestId;
  }

  /**
   * Wrapper of exec function to run it with worker.
   * @param {number|null} tabId The tab the quickaccess was opened from, the current tab if none
   * @returns {Promise<void>}
   */
  async _exec(tabId) {
    try {
      const dataUrl = await this.exec(tabId);
      this.worker.port.emit(this.requestId, "SUCCESS", dataUrl);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, "ERROR", error);
    }
  }

  /**
   * Take a screenshot of the visible part of the page the quickaccess is used on, to read a QR code from it.
   * The screenshot is only returned to the quickaccess, it is never stored.
   * @param {number|null} tabId The tab the quickaccess was opened from, the current tab if none
   * @returns {Promise<string>} The screenshot as a PNG data URL
   * @throws {Error} If the tab cannot be found or is not the visible tab of its window
   */
  async exec(tabId) {
    const tab = tabId ? await BrowserTabService.getById(tabId) : await BrowserTabService.getCurrent();
    if (!tab) {
      throw new Error("The page to scan cannot be found.");
    }
    if (!tab.active) {
      throw new Error("The page to scan must be the visible tab of its window.");
    }
    return browser.tabs.captureVisibleTab(tab.windowId, { format: "png" });
  }
}

export default CapturePassbobTabController;
