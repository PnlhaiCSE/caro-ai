#!/bin/bash

set -e 

if [ -z "$VIRTUAL_ENV" ]; then
    echo "activating"
    if [ -d ".venv" ]; then
        source .venv/bin/activate
    elif [ -d "venv" ]; then
        source venv/bin/activate
    else
        echo "Creating .venv ..."
        python3 -m venv .venv
        source .venv/bin/activate
    fi
else
    echo "Virtual environment existed"
fi

#kill process chiếm port
fuser -k 5100/tcp 2>/dev/null || true
cd engine
pip install -r requirements.txt
echo " "
echo "...Running Gunicorn..."
gunicorn app:app \
    --bind 0.0.0.0:5100 \
    --workers 4 \
    --threads 2 \
    --timeout 150 