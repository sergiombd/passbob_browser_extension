/**
 * Passbob ~ fork of the Passbolt browser extension
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * Based on Passbolt, Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 */
import BrowserTabService from "../../service/ui/browserTab.service";

/**
 * A JPEG keeps the screenshot small enough for the port (a PNG of a large screen can exceed the message size limit and
 * disconnect it), at a quality the QR code decoder still reads.
 */
export const CAPTURE_OPTIONS = { format: "jpeg", quality: 92 };
export const MAX_SCREENSHOT_LENGTH = 32 * 1024 * 1024;

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
   * @returns {Promise<string>} The screenshot as a JPEG data URL
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
    const dataUrl = await browser.tabs.captureVisibleTab(tab.windowId, CAPTURE_OPTIONS);
    if (dataUrl.length > MAX_SCREENSHOT_LENGTH) {
      throw new Error("The screenshot of the page is too large.");
    }
    return dataUrl;
  }
}

export default CapturePassbobTabController;
