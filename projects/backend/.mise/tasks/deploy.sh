#!/usr/env/bin bash

set -eu

name=rowy-backend
region=us-central1

if [[ -z "$GCP_PROJECT_ID" ]];
then
  echo "Environment variable GCP_PROJECT_ID is not set."
  exit 1
fi

pnpm run build
gcloud config set project $GCP_PROJECT_ID
gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/$name
gcloud run deploy $name --image gcr.io/$GCP_PROJECT_ID/$name --platform managed --cpu 1000m --memory 2Gi --allow-unauthenticated --region $region
