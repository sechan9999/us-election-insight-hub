# Push the latest commit and redeploy the "us-election-insight-hub" Cloud Run service.
# Keeps the service's existing settings (memory, CPU, public access, env vars); only the code changes.
$ErrorActionPreference = "Stop"
$REGION = "us-central1"
$SERVICE_NAME = "us-election-insight-hub"
$PROJECT_NUMBER = "38273401034"   # from the service URL
Set-Location $PSScriptRoot

Write-Host "1/3 Pushing main to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "2/3 Finding the Google Cloud project..." -ForegroundColor Cyan
$PROJECT_ID = gcloud projects list --filter="projectNumber=$PROJECT_NUMBER" --format="value(projectId)"
if (-not $PROJECT_ID) { throw "No project with number $PROJECT_NUMBER for this gcloud account." }
Write-Host "   Project: $PROJECT_ID"

Write-Host "3/3 Deploying (Cloud Build, about 5-10 minutes)..." -ForegroundColor Cyan
gcloud run deploy $SERVICE_NAME --source . --region $REGION --project $PROJECT_ID

Write-Host "Done. Open: https://us-election-insight-hub-38273401034.us-central1.run.app/us?lang=ko" -ForegroundColor Green
