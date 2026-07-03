#!/usr/bin/env bash

set -e

TEST_EMAIL="smoke@app1.com"
TEST_NAME="SmokeTest"
BACKUP_PATH="backups/smoke-test-before.json"

echo "== Node Console Toolkit Smoke Test =="

echo ""
echo "1) Building project..."
npm run build

echo ""
echo "2) Creating backup before smoke test..."
npm run start -- export-users "$BACKUP_PATH"

echo ""
echo "3) Health check..."
npm run start -- health-check

echo ""
echo "4) Cleaning previous smoke user if exists..."
npm run start -- delete-user "$TEST_EMAIL" || true

echo ""
echo "5) Creating smoke user..."
npm run start -- create-user "$TEST_NAME" "$TEST_EMAIL"

echo ""
echo "6) Counting users..."
npm run start -- count-users

echo ""
echo "7) Finding smoke user..."
npm run start -- find-user "$TEST_EMAIL"

echo ""
echo "8) Searching smoke user..."
npm run start -- search-users smoke

echo ""
echo "9) Filtering users by domain..."
npm run start -- filter-users app1.com

echo ""
echo "10) Sorting users..."
npm run start -- sort-users email asc

echo ""
echo "11) Validating users..."
npm run start -- validate-users

echo ""
echo "12) Creating automatic backup..."
npm run start -- backup-users

echo ""
echo "13) Deleting smoke user..."
npm run start -- delete-user "$TEST_EMAIL"

echo ""
echo "14) Validating users after cleanup..."
npm run start -- validate-users

echo ""
echo "Smoke test completed successfully"
