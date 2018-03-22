#!/usr/bin/env bash

PROD_IP=${PROD_IP}
scp ./android/app/app-release.apk root@${PROD_IP}:/nginx/static/files