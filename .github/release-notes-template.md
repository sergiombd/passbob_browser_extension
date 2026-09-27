Unpacked builds of Passbob, a fork of the Passbolt browser extension. They talk to your usual Passbolt server.

## Install or update

**Chrome / Edge / Brave**
1. Download `passbob-chrome-….zip` and unzip it into a fixed folder, for example `~/passbob/chrome` (to update, unzip the new version over it).
2. Open `chrome://extensions`, turn on **Developer mode**.
3. First install: **Load unpacked** → pick the folder. Update: click ↻ on the Passbob card.

The extension ID is always `jfmkbnjehnikpghgclojmgcanocibpid`, so your account and settings survive updates.

**Firefox** (temporary until builds are signed: removed when Firefox restarts)
1. Download `passbob-firefox-….zip` and unzip it.
2. `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → pick `manifest.json`.

**First launch:** choose **recover**, then your server URL, recovery kit and passphrase. Disable the official Passbolt extension in the same browser.
