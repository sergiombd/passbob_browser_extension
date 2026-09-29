/**
 * Passbob ~ fork of the Passbolt browser extension
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * Based on Passbolt, Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 */
import CapturePassbobTabController, { CAPTURE_OPTIONS, MAX_SCREENSHOT_LENGTH } from "./capturePassbobTabController";

const SCREENSHOT = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";

beforeEach(() => {
  jest.clearAllMocks();
  browser.tabs.captureVisibleTab = jest.fn(async () => SCREENSHOT);
});

describe("CapturePassbobTabController", () => {
  it("captures the visible tab of the current window", async () => {
    jest.spyOn(browser.tabs, "query").mockImplementation(async () => [{ id: 3, windowId: 7, active: true }]);
    const controller = new CapturePassbobTabController();

    const dataUrl = await controller.exec(null);

    expect(dataUrl).toBe(SCREENSHOT);
    expect(browser.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(browser.tabs.captureVisibleTab).toHaveBeenCalledWith(7, CAPTURE_OPTIONS);
  });

  it("captures the window of the tab the quickaccess was opened from", async () => {
    jest.spyOn(browser.tabs, "query").mockImplementation(async () => [
      { id: 3, windowId: 7, active: true },
      { id: 4, windowId: 9, active: true },
    ]);
    const controller = new CapturePassbobTabController();

    await controller.exec(4);

    expect(browser.tabs.captureVisibleTab).toHaveBeenCalledWith(9, CAPTURE_OPTIONS);
  });

  it("refuses a tab that is not visible, the screenshot would show another page", async () => {
    jest.spyOn(browser.tabs, "query").mockImplementation(async () => [{ id: 4, windowId: 9, active: false }]);
    const controller = new CapturePassbobTabController();

    await expect(controller.exec(4)).rejects.toThrow("visible tab");
    expect(browser.tabs.captureVisibleTab).not.toHaveBeenCalled();
  });

  it("captures a JPEG, a PNG of a large screen is too big for the port", () => {
    expect(CAPTURE_OPTIONS.format).toBe("jpeg");
  });

  it("refuses a screenshot too large to send back", async () => {
    jest.spyOn(browser.tabs, "query").mockImplementation(async () => [{ id: 3, windowId: 7, active: true }]);
    browser.tabs.captureVisibleTab.mockImplementation(async () => "x".repeat(MAX_SCREENSHOT_LENGTH + 1));
    const controller = new CapturePassbobTabController();

    await expect(controller.exec(null)).rejects.toThrow("too large");
  });

  it("refuses when the tab cannot be found", async () => {
    jest.spyOn(browser.tabs, "query").mockImplementation(async () => []);
    const controller = new CapturePassbobTabController();

    await expect(controller.exec(12)).rejects.toThrow("cannot be found");
  });

  it("sends the screenshot, or the error, back to the quickaccess", async () => {
    jest.spyOn(browser.tabs, "query").mockImplementation(async () => [{ id: 3, windowId: 7, active: true }]);
    const worker = { port: { emit: jest.fn() } };

    await new CapturePassbobTabController(worker, "request-id")._exec(null);
    expect(worker.port.emit).toHaveBeenCalledWith("request-id", "SUCCESS", SCREENSHOT);

    browser.tabs.captureVisibleTab.mockImplementation(async () => {
      throw new Error("Cannot access contents of the page");
    });
    await new CapturePassbobTabController(worker, "request-id")._exec(null);
    expect(worker.port.emit).toHaveBeenLastCalledWith("request-id", "ERROR", expect.any(Error));
  });
});
