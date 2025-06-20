#!/bin/bash
cp -r ./Frontend/* ./Backend/src/main/resources/static/
cd ./Backend
clear
mvn spring-boot:run
