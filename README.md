	      ____                  __          ____
	     / __ \____  _____ ____/ /_  ____  / / /_
	    / /_/ / __ `/ ___/ ___/ __ \/ __ \/ / __/
	   / ____/ /_/ (__  |__  ) /_/ / /_/ / / /_
	  /_/    \__,_/____/____/_.___/\____/_/\__/

	Open source password manager for teams
	(c) 2026 Passbolt SA
	https://www.passbolt.com

# Passbob

Passbob is a fork of the Passbolt browser extension (see [NOTICE-PASSBOB.md](NOTICE-PASSBOB.md)). It works with your
existing Passbolt server and account: nothing changes on the server. Its UI comes from
[sergiombd/passbob_styleguide](https://github.com/sergiombd/passbob_styleguide).

## Use it next to an existing Passbolt

- **Same server, same account.** Passbob talks to your usual Passbolt server. You sign in with your usual private key
  and passphrase.
- **Its own setup, once.** Passbob is a separate extension (ID `jfmkbnjehnikpghgclojmgcanocibpid`), so it cannot see the
  account stored by the official extension. Set it up once with the account recovery (see
  [First launch](#first-launch)). Keep your private key file and passphrase at hand.
- **One extension at a time on the Passbolt site.** Both extensions inject into the Passbolt pages and the in-form
  icons of websites. Turn the official extension off in `chrome://extensions` (it stays installed with its account),
  and turn it back on whenever you want to switch back.
- **Update in place, never remove.** Removing Passbob deletes its account from the browser. To update, replace the
  files in the same folder and click ↻ on the Passbob card. The ID stays the same, so the account and settings stay.

## Install from a release

Releases are on the [Releases page](https://github.com/sergiombd/passbob_browser_extension/releases), one zip per
browser (`passbob-chrome-<version>.zip`, `passbob-firefox-<version>.zip`).

**Chrome, Edge, Brave**
1. Download `passbob-chrome-<version>.zip` and unzip it into a folder you keep, for example `~/.extensions/passbob`.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick that folder.
4. Turn off the official Passbolt extension, then go to [First launch](#first-launch).

To update, unzip the new release over the same folder, then click ↻ on the Passbob card.

**Firefox** (the builds are not signed yet, so the add-on is removed when Firefox restarts)
1. Download `passbob-firefox-<version>.zip` and unzip it.
2. Open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…** and pick its `manifest.json`.

## Install from the repositories

You need access to both repositories, Node 22 (see `.nvmrc`) and npm.

1. Clone both repositories side by side. The build looks for them under their upstream names, so clone them as such:

   ```bash
   mkdir passbob && cd passbob
   git clone https://github.com/sergiombd/passbob_styleguide.git passbolt_styleguide
   git clone https://github.com/sergiombd/passbob_browser_extension.git passbolt_browser_extension
   ```

   For a feature branch, check out the branch of the same name in both repositories.
2. Install and build the styleguide (it builds the theme CSS the extension copies):

   ```bash
   cd passbolt_styleguide
   npm ci
   npm run build
   ```
3. Install and build the extension for Chrome:

   ```bash
   cd ../passbolt_browser_extension
   npm ci
   npm run build:chromium-mv3
   ```

   The unpacked extension is in `build/all`, and a zip in `dist/chromium-mv3`. For Firefox, run
   `npm run build:firefox` and use the zip in `dist/firefox` (both builds write to `build/all`).
4. Copy `build/all` into the folder Chrome loads, for example:

   ```bash
   rsync -a --delete build/all/ ~/.extensions/passbob/
   ```

   Then load it as in [Install from a release](#install-from-a-release) the first time, or click ↻ on the Passbob card
   for an update. Loading `build/all` itself also works, but a later `npm ci` or a Firefox build replaces it.

## First launch

1. With the official Passbolt extension turned off, open `https://<your Passbolt server>/users/recover`.
2. Enter your email, accept the terms and click **Next**. Passbolt emails you a recovery link.
3. Open the link in the same browser. Passbob opens its recovery screen: import your private key file and enter your
   passphrase.
4. Open your Passbolt server: the vault shows. The Passbob toolbar popup lists your passwords.

If the popup only shows an empty square, Passbob has no account yet: do the recovery above.

## License

Passbolt - Open source password manager for teams

(c) 2026 Passbolt SA

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General
Public License (AGPL) as published by the Free Software Foundation version 3.

The name "Passbolt" is a registered trademark of Passbolt SA, and Passbolt SA hereby declines to grant a trademark
license to "Passbolt" pursuant to the GNU Affero General Public License version 3 Section 7(e), without a separate
agreement with Passbolt SA.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not,
see [GNU Affero General Public License v3](http://www.gnu.org/licenses/agpl-3.0.html).

## About passbolt

Passbolt is an open source password manager for teams. It allows to securely share and store credentials.
For instance, the wifi password of your office, or the administrator password of a router, or your organisation social
media account password, all of them can be secured using Passbolt.

You can try a demo of passbolt at [https://demo.passbolt.com](https://demo.passbolt.com).

You will need to install a plugin, you can find a step by step guide in the website
[help section](https://www.passbolt.com/help/start/firefox)

Or, of course, you can use the code in this repository to build it yourself and run it!

## About passbolt browser extension

A browser extension is needed to maintain a higher level of security, e.g. to ensure the integrity of the
cryptographic code and provide a secure random number generator. In the future it will also be used to provide feature
such as auto filling your passwords when visiting known websites.

### How does it look like?

[![Login](https://raw.githubusercontent.com/passbolt/passbolt_styleguide/master/src/img/screenshots/teaser-screenshot-login-275.png)](https://raw.githubusercontent.com/passbolt/passbolt_styleguide/master/src/img/screenshots/teaser-screenshot-login.png)
[![Browse passwords](https://raw.githubusercontent.com/passbolt/passbolt_styleguide/master/src/img/screenshots/teaser-screenshot4-275.png)](https://raw.githubusercontent.com/passbolt/passbolt_styleguide/master/src/img/screenshots/teaser-screenshot4.png)
[![Share passwords](https://raw.githubusercontent.com/passbolt/passbolt_styleguide/master/src/img/screenshots/teaser-screenshot-share-275.png)](https://raw.githubusercontent.com/passbolt/passbolt_styleguide/master/src/img/screenshots/teaser-screenshot-share.png)

# Contributing

Please check [CONTRIBUTING.md](CONTRIBUTING.md) for more information about how to get involved.

## Reporting a security Issue

If you've found a security related issue in Passbolt, please don't open an issue on GitHub. Follow our responsible disclosure process: https://www.passbolt.com/docs/contribute/security/vulnerability/.

# Quick how-to for developers

This is just a quick getting started guide, for more information and productivity tips checkout CONTRIBUTING.md

## Prerequisite

You will need ```node```, ```grunt``` and the dependencies listed in ```packages.json```.
```
git clone git@github.com:passbolt/passbolt_browser_extension.git
cd passbolt_browser_extension
npm ci
```

For convenience you can also install ```web-ext``` (for firefox), ```crx``` (for chrome) globally,
otherwise can can be found in ```node_modules```.
```
sudo npm install web-ext -g
sudo npm install crx -g
```

## Quick bundling the build/all source

The non-minified source code is located in ```/src```. It can be 'bundled' ```to build/all``` as follow:
```
grunt
```

In order to rebuild the code in this directory automatically while you are editing the src
you can use the grunt watch task:
```
grunt watch
```

## Test a local version of the plugin
### Firefox

To launch an instance of Firefox with your local version of the add-on installed.
```
cd build/all
web-ext run
```

This instance will be reloaded everytime there is a change in the /build/all code or by pressing the ```r```
key on the keyboard when web-ext is running.
You can debug the application script by opening the
[browser console](https://developer.mozilla.org/en/docs/Tools/Browser_Console).

### Chrome

Go to the the extension page at [chrome://extensions/](chrome://extensions/) click on the
'load unpacked extension' button. Point to your build/all directory and you are good to go.
You debug the application script by clicking on index.html in "inspect views".

## Packaging the application

You can build the crx or xpi (zip) packages using the following command.
```
grunt build
```
The build can be found under ```dist/chromium-mv3``` or ```dist/chromium-mv2``` or ```dist/firefox```.

## Updating the vendors or the styleguide

You can update the vendors or the styleguide in the ```package.json``` and run the copy task
in grunt to deploy them in the appropriate places. Check the ```Gruntfile.js```
for more information.
```
npm update
grunt copy:vendors
grunt copy:styleguide
```
The build can be found under ```dist/chromium-mv3``` or ```dist/chromium-mv2``` or ```dist/firefox```.

## Unit testing

Unit testing is handle by Jest. It provides ways to run them and also build code coverage reports.

To run unit tests:
```
grunt test
```

To run unit tests with coverage:
```
grunt test-coverage
```

Once the code coverage report is generated you can find the result in the folder `coverage`.
Jest also provides an HTML version of the reports avaiable at `coverage/lcov-report/index.html`.

# Credits

https://www.passbolt.com/credits
