#!/usr/bin/env bash
set -Eeuo pipefail

unset HTTP_PROXY HTTPS_PROXY ALL_PROXY http_proxy https_proxy all_proxy
release_sha="${1:-}"
[[ "$release_sha" =~ ^[0-9a-f]{40}$ ]] || { echo 'A full commit SHA is required' >&2; exit 64; }
project_root="$(realpath "${KEP_PROJECT_ROOT:-/home/KEP.uz}")"
app_root="$project_root/frontend"
compose_root="$project_root/backend"
upload_base="$(realpath "${KEP_DEPLOY_TEMP_ROOT:-/tmp}")"
upload_root="$(realpath "${2:-$upload_base/kep-frontend-$release_sha}")"
[[ "$upload_root" == "$upload_base/kep-frontend-$release_sha" ]]
[[ "$(realpath "$app_root")" == "$app_root" ]]
rollback_root="$project_root/.deploy-rollback/frontend"
install -d -m 700 "$rollback_root"
[[ "$(realpath "$rollback_root")" == "$rollback_root" ]]
rollback_dist="$rollback_root/dist"
staging_dist=''
rollback_needed=0
old_image_available=0

rollback() {
    local result=${1:-$?}
    trap - ERR HUP INT TERM
    set +e
    if ((rollback_needed == 1)); then
        echo 'Frontend deployment failed; restoring the previous release.' >&2
        if [[ -d "$rollback_dist" ]]; then
            failed_dist="$rollback_root/dist.failed-$release_sha"
            rm -rf -- "$failed_dist"
            if [[ -d "$app_root/dist" ]]; then mv -- "$app_root/dist" "$failed_dist"; fi
            mv -- "$rollback_dist" "$app_root/dist"
        fi
        if ((old_image_available == 1)); then
            docker image tag kep-frontend:rollback kep-frontend:latest
            cd "$compose_root" || exit "$result"
            docker compose up -d --no-deps --force-recreate frontend
        fi
    fi
    if [[ -n "$staging_dist" && -d "$staging_dist" ]]; then rm -rf -- "$staging_dist"; fi
    exit "$result"
}
trap rollback ERR
trap 'rollback 129' HUP
trap 'rollback 130' INT
trap 'rollback 143' TERM
test -s "$upload_root/frontend-dist/index.html"
git -C "$app_root" fetch origin production
git -C "$app_root" checkout production
git -C "$app_root" pull --ff-only origin production
test "$(git -C "$app_root" rev-parse HEAD)" = "$release_sha"
staging_dist="$(mktemp -d "$app_root/.dist-staging.XXXXXXXX")"
cp -a "$upload_root/frontend-dist/." "$staging_dist/"
test -s "$staging_dist/index.html"
if docker image inspect kep-frontend:latest >/dev/null 2>&1; then
    docker image tag kep-frontend:latest kep-frontend:rollback
    old_image_available=1
fi
rm -rf -- "$rollback_dist"
rollback_needed=1
if [[ -d "$app_root/dist" ]]; then mv -- "$app_root/dist" "$rollback_dist"; fi
mv -- "$staging_dist" "$app_root/dist"
staging_dist=''
cd "$compose_root"
docker compose build frontend
docker compose up -d --no-deps frontend
container_id="$(docker compose ps -q frontend)"
test -n "$container_id"
healthy=0
for ((attempt = 1; attempt <= 45; attempt++)); do
    container_status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id" 2>/dev/null || true)"
    if [[ "$container_status" == healthy ]]; then healthy=1; break; fi
    if [[ "$container_status" == exited || "$container_status" == dead || "$container_status" == unhealthy ]]; then break; fi
    sleep 2
done
if ((healthy != 1)); then docker logs --tail 100 "$container_id" >&2 || true; false; fi
curl --fail --silent --show-error --max-time 10 http://127.0.0.1:18080/healthz >/dev/null
docker exec -i "$container_id" sh -s < "$app_root/docker/test-routes.sh"
rollback_needed=0
trap - ERR HUP INT TERM
rm -rf -- "$upload_root"
echo "Frontend $release_sha deployed successfully."
