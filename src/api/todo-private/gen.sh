#!/usr/bin/env bash

rm -rf ./gen/
mkdir gen

swagger-codegen generate \
    -t ~/work/neuron/src/github.com/swagger-api/swagger-codegen/modules/swagger-codegen/src/main/resources/typescript-fetch/ \
    -i swagger.json -l typescript-fetch -o ./gen