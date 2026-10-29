#!/usr/bin/env bash
set -euo pipefail
umask 077

release_sha="${1:-}"
build_directory="${2:-frontend-dist}"
[[ "$release_sha" =~ ^[0-9a-f]{40}$ ]] || { echo 'A full commit SHA is required' >&2; exit 64; }
: "${DEPLOY_HOST:?Deployment host is required}"
: "${DEPLOY_USER:?Deployment user is required}"
: "${DEPLOY_SSH_KEY:?Deployment key is required}"
: "${DEPLOY_FINGERPRINT:?Pinned host fingerprint is required}"
deploy_port="${DEPLOY_PORT:-22}"
[[ "$DEPLOY_HOST" =~ ^[A-Za-z0-9.:-]+$ && "$DEPLOY_USER" =~ ^[A-Za-z_][A-Za-z0-9_-]*$ ]]
[[ "$deploy_port" =~ ^[0-9]+$ ]] && ((10#$deploy_port > 0 && 10#$deploy_port < 65536))
[[ "$DEPLOY_FINGERPRINT" =~ ^SHA256:[A-Za-z0-9+/]+=*$ ]]
build_directory="$(cd -- "$build_directory" && pwd -P)"
[[ "$(basename "$build_directory")" == frontend-dist && -s "$build_directory/index.html" ]]
[[ -z "$(find "$build_directory" -type l -print -quit)" ]] || { echo 'Build symlinks are not allowed' >&2; exit 65; }
script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
work="$(mktemp -d "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/kep-frontend-ci.XXXXXXXX")"
cleanup() {
    local result=$?
    trap - EXIT
    if [[ -f "$work/config" ]]; then
        ssh -F "$work/config" -O exit kep-production >/dev/null 2>&1 || true
    fi
    rm -rf -- "$work"
    exit "$result"
}
trap cleanup EXIT

# Only the verified build and this commit's deployment script enter the bundle.
tar -czf "$work/release.tar.gz" -C "$(dirname "$build_directory")" frontend-dist \
    -C "$script_directory" deploy-production.sh
bundle_sha="$(sha256sum "$work/release.tar.gz" | cut -d ' ' -f 1)"
printf '%s\n' "$DEPLOY_SSH_KEY" | tr -d '\r' > "$work/key"
unset DEPLOY_SSH_KEY
chmod 600 "$work/key"

# A scanned key is untrusted until it matches the existing pinned fingerprint.
ssh-keyscan -T 15 -p "$deploy_port" "$DEPLOY_HOST" > "$work/candidates" 2>/dev/null || true
while IFS= read -r candidate; do
    [[ -n "$candidate" && "$candidate" != \#* ]] || continue
    printf '%s\n' "$candidate" > "$work/candidate"
    actual="$(ssh-keygen -l -E sha256 -f "$work/candidate" 2>/dev/null | awk '{print $2}')" || continue
    if [[ "$actual" == "$DEPLOY_FINGERPRINT" ]]; then
        printf '%s\n' "$candidate" > "$work/known_hosts"
        break
    fi
done < "$work/candidates"
[[ -s "$work/known_hosts" ]] || { echo 'SSH host fingerprint verification failed' >&2; exit 65; }
cat > "$work/config" <<CONFIG
Host kep-production
    HostName $DEPLOY_HOST
    User $DEPLOY_USER
    Port $deploy_port
    IdentityFile $work/key
    IdentityAgent none
    IdentitiesOnly yes
    PreferredAuthentications publickey
    BatchMode yes
    StrictHostKeyChecking yes
    UserKnownHostsFile $work/known_hosts
    ConnectTimeout 20
    ConnectionAttempts 1
    ServerAliveInterval 15
    ServerAliveCountMax 3
    ControlMaster auto
    ControlPersist 900
    ControlPath $work/control
CONFIG

connected=0
for attempt in 1 2 3; do
    if ssh -F "$work/config" -MNf kep-production; then connected=1; break; fi
    echo "SSH connection attempt $attempt failed" >&2
    if ((attempt < 3)); then sleep "$((attempt * 3))"; fi
done
((connected == 1)) || exit 1
upload_root="/tmp/kep-frontend-$release_sha"
ssh -F "$work/config" kep-production "mkdir -p '$upload_root'"
uploaded=0
for attempt in 1 2 3; do
    if scp -F "$work/config" "$work/release.tar.gz" "kep-production:$upload_root/release.tar.gz"; then uploaded=1; break; fi
    echo "Build transfer attempt $attempt failed" >&2
    if ((attempt < 3)); then sleep "$((attempt * 3))"; fi
done
((uploaded == 1)) || exit 1
ssh -F "$work/config" kep-production \
    "set -eu; printf '%s  %s\n' '$bundle_sha' '$upload_root/release.tar.gz' | sha256sum --check --status; tar -xzf '$upload_root/release.tar.gz' --no-same-owner -C '$upload_root'"
# Deployment/health failures are handled by rollback, never blindly retried.
ssh -F "$work/config" kep-production "bash '$upload_root/deploy-production.sh' '$release_sha' '$upload_root'"
