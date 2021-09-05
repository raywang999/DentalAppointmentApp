#!/usr/bin/env bash
echo "Starting backend..."
nohup node /services/backend/app.js >backend.log 2>&1 &
tail -f backend.log

