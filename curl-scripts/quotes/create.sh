#!/bin/bash

API="http://localhost:4741"
URL_PATH="/quotes/crawler"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "quote": {
      "pickUpDate": "'"${DATE}"'",
      "startZip": "'"${START}"'",
      "endZip": "'"${END}"'"
    }
  }'

echo
