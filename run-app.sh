#!/bin/bash

set -e

if [ -z "$VIRTUAL_ENV" ]; then
    echo "activating"
    # venv hoặc .venv
    if  [ -d ".venv" ]; then
        source .venv/bin/activate
    elif [-d "venv" ]; then 
        source venv/bin/activate
    else
        python3 -m venv .venv 
        source .venv/bin/activate 
    fi
else
    echo "virtual existed"
fi 

pip install -r engine/requirements.txt
python3 engine/app.py 
