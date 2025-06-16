#!/bin/bash
cp -r ./Frontend/* ./Backend/src/main/resources/static/
echo "¡¡¡FRONTEND COPIADO CON EXITO!!!"
sleep 2
cd ./Backend
mvn spring-boot:run
