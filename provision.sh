#! /bin/bash

GROUP_NAME=winGroup
LOCATION=westeurope
PLAN_NAME=winPlan
SKU=FREE
APP_NAME=ath

az group create -n $GROUP_NAME --location $LOCATION
az appservice plan create -n $PLAN_NAME -g $GROUP_NAME --sku $SKU
az webapp create -n $APP_NAME -g $GROUP_NAME -p $PLAN_NAME
az webapp deployment source config-local-git -n $APP_NAME -g $GROUP_NAME --query url --output tsv
az webapp log config -n $APP_NAME -g $GROUP_NAME --web-server-logging filesystem --application-logging true --level error
