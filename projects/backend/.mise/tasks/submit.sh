#!/usr/env/bin bash

set -eu

name=rowy-backend
project_id=rowy-run
yarn
npx tsc
npm run build
gcloud config set project $project_id
gcloud builds submit --tag gcr.io/$project_id/$name
