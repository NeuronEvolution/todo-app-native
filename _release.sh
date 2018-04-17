#!/usr/bin/env bash

cd ./android && ./gradlew assembleRelease \
&& ossutilmac64 cp -f ./app/build/outputs/apk/app-release.apk \
oss://neuron-public/files/neuron-todo/app-release.apk \
&& cd ..