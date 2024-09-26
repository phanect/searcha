#!/usr/bin/env bash

set -eu

LOCKFILE="pnpm-lock.yaml"

DIRNAME="$(realpath "$(dirname  -- "${BASH_SOURCE[0]}")")"
PROJECT_ROOT="$(realpath "${DIRNAME}/..")"

mv "${PROJECT_ROOT}/${LOCKFILE}" "${PROJECT_ROOT}/${LOCKFILE}.scriptbackup"
git restore --source HEAD^ "${PROJECT_ROOT}/${LOCKFILE}"
git add "${PROJECT_ROOT}/${LOCKFILE}"
git commit --amend --no-edit
rm --force "${PROJECT_ROOT}/${LOCKFILE}"
mv "${PROJECT_ROOT}/${LOCKFILE}.scriptbackup" "${PROJECT_ROOT}/${LOCKFILE}"
git add "${PROJECT_ROOT}/${LOCKFILE}"
git commit --message="chore: update ${LOCKFILE}"
