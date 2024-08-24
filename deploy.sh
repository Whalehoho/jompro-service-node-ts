#!/bin/bash

# Check the value of the argument
HOST="perodua-mini"

echo "Copying to $HOST"
rsync -rv ./dist/* ubuntu@$HOST:~/tanand/oee/
