# Passbob privacy policy

Effective date: October 5, 2026

Passbob is an open source browser extension (a fork of the Passbolt browser extension) that lets you use your
passwords stored on a Passbolt server. This policy explains what data Passbob handles and where it goes.

**In short: Passbob does not collect any data. It has no server of its own, no analytics and no tracking. It talks
to the Passbolt server you connect it to, and to the few optional services listed below.**

## Data Passbob handles

To work, Passbob handles the following data **on your device and with your Passbolt server only**:

- **Your account and keys**: your Passbolt server address, your user details and your OpenPGP key pair. Your private
  key is stored in the extension, encrypted with your passphrase, and never leaves your device.
- **Your passwords and other secrets**: they are encrypted end to end with OpenPGP. Passbob decrypts them on your
  device when you view, copy or fill them, and encrypts them before sending them to your Passbolt server.
- **Your vault data** (names, usernames, URLs, folders, tags, sharing): exchanged with your Passbolt server, and
  cached in the extension storage to make the extension faster and to allow offline access when your organization
  enables it.
- **The address of the page you are on**: used on your device to suggest the logins that match the page and to fill
  them when you ask. It is not sent anywhere.
- **Form drafts and the last page viewed**: when you close the popup, Passbob keeps what you were typing (secrets
  encrypted with your own key) and the page you were on, in the browser session storage, for at most 10 minutes. They
  are erased when you save, cancel, sign out or close the browser.
- **Screenshots for QR codes**: when you click "scan" next to an authenticator key, Passbob takes a screenshot of the
  visible page to read the QR code. The screenshot is decoded on your device and immediately discarded; it is never
  stored or sent.
- **Clipboard**: when you copy a secret, Passbob may clear the clipboard after a short delay.

## Where data is sent

- **Your Passbolt server**: the server you or your organization chose. Its operator's privacy policy applies to the
  data stored there. Passbob's developer has no access to it.
- **Have I Been Pwned (Pwned Passwords)**, only if your Passbolt server's password policy enables the external
  dictionary check: when you create or change a password, Passbob sends the **first 5 characters of the SHA-1 hash** of
  the password to `api.pwnedpasswords.com` (k-anonymity). The password itself, and its full hash, are never sent.
- **Single sign-on providers** (for example Microsoft, Google or another OAuth2 provider), only if your organization
  configured single sign-on on its Passbolt server: you sign in on the provider's page as usual.

Passbob sends **no data to its developer**, and uses no analytics, advertising or tracking services.

## Data sharing and sale

Passbob does not sell, rent or share your data, and does not use it for any purpose other than providing the
extension's features. Data is not used to determine creditworthiness or for lending purposes.

## Removing your data

Uninstalling Passbob removes all the data it stored in your browser. The data stored on your Passbolt server is
managed by that server's operator.

## Changes

Changes to this policy are published in this file, in the public repository, with their date.

## Contact

Questions and requests: https://github.com/sergiombd/passbob_browser_extension/issues

Passbob is not affiliated with or endorsed by Passbolt SA.
