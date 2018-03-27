#!/usr/bin/env bash

react-native run-android
react-native bundle --platform android --dev false --entry-file index.js \
--bundle-output android/app/src/main/assets/index.android.bundle  \
--assets-dest android/app/src/main/res/