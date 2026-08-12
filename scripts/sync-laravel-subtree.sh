#!/usr/bin/env bash

set -euo pipefail

mirror="${1:?Mirror repository URL is required.}"
source="${2:-https://github.com/usepictum/pictum.git}"
prefix="integrations/laravel"
repository="$(mktemp -d)"

trap 'rm -rf "$repository"' EXIT

git clone --quiet --bare --no-local "$source" "$repository"

while IFS= read -r ref; do
    if [[ "$ref" == "refs/heads/main" ]]; then
        continue
    fi

    base="$(git -C "$repository" merge-base refs/heads/main "$ref" || true)"
    if [[ -z "$base" ]] || \
       ! git -C "$repository" cat-file -e "$ref:$prefix" 2>/dev/null || \
       git -C "$repository" diff --quiet "$base" "$ref" -- "$prefix"; then
        git -C "$repository" update-ref -d "$ref"
    fi
done < <(git -C "$repository" for-each-ref --format='%(refname)' refs/heads)

while IFS= read -r ref; do
    tag="${ref#refs/tags/}"
    if [[ ! "$tag" =~ ^pictum-laravel@v[0-9]+\.[0-9]+\.[0-9]+([-+][0-9A-Za-z.-]+)?$ ]]; then
        git -C "$repository" update-ref -d "$ref"
    fi
done < <(git -C "$repository" for-each-ref --format='%(refname)' refs/tags)

git -C "$repository" filter-repo \
    --subdirectory-filter "$prefix" \
    --tag-rename 'pictum-laravel@:'

git -C "$repository" remote add mirror "$mirror"
git -C "$repository" push --force --prune --all mirror
git -C "$repository" push --tags mirror
