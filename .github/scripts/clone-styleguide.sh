#!/usr/bin/env bash
# Clone the private passbob styleguide next to the extension with the read-only deploy key.
# Uses the branch named $BRANCH when it exists in the styleguide repository, "passbob" otherwise.
set -euo pipefail

: "${DEPLOY_KEY:?The STYLEGUIDE_DEPLOY_KEY secret is missing}"
: "${STYLEGUIDE_REPO:?}"

key_file="$(mktemp)"
trap 'rm -f "$key_file"' EXIT
printf '%s\n' "$DEPLOY_KEY" > "$key_file"
chmod 600 "$key_file"
export GIT_SSH_COMMAND="ssh -i $key_file -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"

branch="passbob"
if [[ -n "${BRANCH:-}" ]] && git ls-remote --exit-code --heads "$STYLEGUIDE_REPO" "$BRANCH" > /dev/null; then
  branch="$BRANCH"
fi

echo "Cloning the passbob styleguide, branch $branch"
git clone --depth 1 --branch "$branch" "$STYLEGUIDE_REPO" passbolt_styleguide
git -C passbolt_styleguide log --oneline -1
