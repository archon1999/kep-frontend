#!/usr/bin/env bash
set -euo pipefail
repository="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd -P)"
temporary="$(mktemp -d /tmp/kep-frontend-tests.XXXXXXXX)"
temporary="$(realpath "$temporary")"
[[ "$temporary" == /tmp/kep-frontend-tests.* ]]
finish() {
    local result=$?
    trap - EXIT
    if ((result != 0)); then
        for log in "$temporary"/*/result.log; do
            [[ -f "$log" ]] || continue
            echo "--- $(basename "$(dirname "$log")") ---" >&2
            tail -n 20 "$log" >&2
        done
    fi
    rm -rf -- "$temporary"
    exit "$result"
}
trap finish EXIT
mkdir -p "$temporary/bin"
export PATH="$temporary/bin:$PATH"
export MOCK_SHA=0123456789abcdef0123456789abcdef01234567
export DEPLOY_HOST=ci.example.invalid DEPLOY_USER=deploy DEPLOY_PORT=22
export DEPLOY_SSH_KEY=unit-test-key DEPLOY_FINGERPRINT=SHA256:dGVzdA
export MOCK_FINGERPRINT="$DEPLOY_FINGERPRINT"
# NTFS cannot represent install's Unix directory modes. Linux CI exercises
# the real install command; Windows still checks the complete rollback flow.
if [[ "$(uname -s)" == MINGW* ]]; then
    cat > "$temporary/bin/install" <<'MOCK'
#!/usr/bin/env bash
mkdir -p -- "${@: -1}"
MOCK
fi
cat > "$temporary/bin/ssh-keyscan" <<'MOCK'
#!/usr/bin/env bash
echo 'ci.example.invalid ssh-ed25519 AAAATESTKEY'
MOCK
cat > "$temporary/bin/ssh-keygen" <<'MOCK'
#!/usr/bin/env bash
echo "256 $MOCK_FINGERPRINT ci.example.invalid (ED25519)"
MOCK
cat > "$temporary/bin/sleep" <<'MOCK'
#!/usr/bin/env bash
exit 0
MOCK
cat > "$temporary/bin/ssh" <<'MOCK'
#!/usr/bin/env bash
set -eu
[[ "$1" == -F && -s "$2" ]]
grep -q 'StrictHostKeyChecking yes' "$2"
grep -q 'IdentitiesOnly yes' "$2"
grep -q 'ControlPath ' "$2"
echo "$*" >> "$MOCK_LOG/ssh.log"
if [[ "$*" == *'-MNf'* ]]; then
    if [[ "$MOCK_MODE" == flaky && ! -f "$MOCK_LOG/connected" ]]; then touch "$MOCK_LOG/connected"; exit 255; fi
elif [[ "$*" == *'sha256sum --check'* && "$MOCK_MODE" == corrupt ]]; then
    exit 1
elif [[ "$*" == *"bash '/tmp/"* ]]; then
    touch "$MOCK_LOG/deployed"
fi
MOCK
cat > "$temporary/bin/scp" <<'MOCK'
#!/usr/bin/env bash
set -eu
[[ "$1" == -F && -s "$2" ]]
tar -tzf "$3" > "$MOCK_LOG/bundle-files"
if grep -Ev '^(frontend-dist(/.*)?|deploy-production.sh)$' "$MOCK_LOG/bundle-files"; then exit 1; fi
if [[ "$MOCK_MODE" == flaky && ! -f "$MOCK_LOG/copied" ]]; then touch "$MOCK_LOG/copied"; exit 255; fi
touch "$MOCK_LOG/uploaded"
MOCK
cat > "$temporary/bin/git" <<'MOCK'
#!/usr/bin/env bash
if [[ "$*" == *'rev-parse HEAD'* ]]; then echo "$MOCK_SHA"; fi
MOCK
cat > "$temporary/bin/docker" <<'MOCK'
#!/usr/bin/env bash
set -eu
echo "$*" >> "$MOCK_LOG/docker.log"
case "$*" in
  'compose build frontend') [[ "$MOCK_MODE" != build-failure ]] ;;
  'compose ps -q frontend') echo mock-container ;;
  inspect*) if [[ "$MOCK_MODE" == health-failure ]]; then echo unhealthy; else echo healthy; fi ;;
  exec*) cat >/dev/null; [[ "$MOCK_MODE" != route-failure ]] ;;
esac
MOCK
cat > "$temporary/bin/curl" <<'MOCK'
#!/usr/bin/env bash
[[ "$MOCK_MODE" != http-failure ]]
MOCK
chmod 755 "$temporary/bin/"*

for scenario in success flaky corrupt fingerprint; do
    export MOCK_MODE="$scenario" MOCK_LOG="$temporary/transport-$scenario"
    export RUNNER_TEMP="$MOCK_LOG/runner"
    mkdir -p "$RUNNER_TEMP" "$MOCK_LOG/frontend-dist"
    echo new > "$MOCK_LOG/frontend-dist/index.html"
    if [[ "$scenario" == fingerprint ]]; then export MOCK_FINGERPRINT=SHA256:bm90dHJ1c3RlZA; else export MOCK_FINGERPRINT="$DEPLOY_FINGERPRINT"; fi
    if bash "$repository/ops/ci-deploy-production.sh" "$MOCK_SHA" "$MOCK_LOG/frontend-dist" > "$MOCK_LOG/result.log" 2>&1; then
        [[ "$scenario" == success || "$scenario" == flaky ]]
        test -f "$MOCK_LOG/deployed"
    else
        [[ "$scenario" == corrupt || "$scenario" == fingerprint ]]
        test ! -f "$MOCK_LOG/deployed"
        if [[ "$scenario" == fingerprint ]]; then test ! -f "$MOCK_LOG/uploaded"; fi
    fi
    [[ -z "$(find "$RUNNER_TEMP" -mindepth 1 -print -quit)" ]]
    echo "Transport $scenario: passed"
done

for scenario in success build-failure health-failure http-failure route-failure; do
    export MOCK_MODE="$scenario" MOCK_LOG="$temporary/deploy-$scenario"
    export KEP_PROJECT_ROOT="$MOCK_LOG/project" KEP_DEPLOY_TEMP_ROOT="$MOCK_LOG/uploads"
    upload="$KEP_DEPLOY_TEMP_ROOT/kep-frontend-$MOCK_SHA"
    mkdir -p "$KEP_PROJECT_ROOT/frontend/dist" "$KEP_PROJECT_ROOT/frontend/docker" "$KEP_PROJECT_ROOT/backend" "$upload/frontend-dist"
    echo old > "$KEP_PROJECT_ROOT/frontend/dist/index.html"
    echo new > "$upload/frontend-dist/index.html"
    echo '# route checks are executed by the mocked Docker container' > "$KEP_PROJECT_ROOT/frontend/docker/test-routes.sh"
    if bash "$repository/ops/deploy-production.sh" "$MOCK_SHA" "$upload" > "$MOCK_LOG/result.log" 2>&1; then
        [[ "$scenario" == success ]]
        grep -q new "$KEP_PROJECT_ROOT/frontend/dist/index.html"
        grep -q old "$KEP_PROJECT_ROOT/.deploy-rollback/frontend/dist/index.html"
        test ! -d "$upload"
    else
        [[ "$scenario" != success ]]
        grep -q old "$KEP_PROJECT_ROOT/frontend/dist/index.html"
        grep -q 'image tag kep-frontend:rollback kep-frontend:latest' "$MOCK_LOG/docker.log"
        grep -q 'compose up -d --no-deps --force-recreate frontend' "$MOCK_LOG/docker.log"
    fi
    echo "Deployment $scenario: passed"
done
