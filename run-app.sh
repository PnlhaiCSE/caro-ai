#!/bin/bash

set -e

if [ -z "$VIRTUAL_ENV" ]; then
    echo "activating"
    # venv hoặc .venv
    if  [ -d ".venv" ]; then
        source .venv/bin/activate
    elif [ -d "venv" ]; then 
        source venv/bin/activate
    else
        echo "Creating .venv ..."
        python3 -m venv .venv 
        source .venv/bin/activate 
    fi
else
    echo "virtual existed"
fi 

#kill process chiếm port
fuser -k 5100/tcp 2>/dev/null || true
pip install -r engine/requirements.txt 
echo " "
echo "....Running Flask app...."
python3 engine/app.py 