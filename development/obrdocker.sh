#!/bin/bash

echo "Starting installation!"

if [ -x "$(command -v docker)" ]; then
#    if [ -z "$(docker images -q 213920689726.dkr.ecr.eu-north-1.amazonaws.com/obrnpm)" ]; then
#        echo "Node already built, moving to Python..."
#    else
#        cd nodeDocker/
#        node="docker build -t obrnpm ."
#        $node
#        cd ..
#    fi
#    if [ -z "$(docker images -q 213920689726.dkr.ecr.eu-north-1.amazonaws.com/obrpy)" ]; then
#        echo "Python already built, moving to compose..."
#    else
#        cd pythonDocker/
#        python="docker build -t obrpy ."
#        $python
#        cd ..
#    fi
    compose="docker-compose -f setup.yaml up"
    $compose
    echo "Completed work!"
else
    echo "Error: Please install docker first"
fi
