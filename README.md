# Blazor WebAssembly - Hello world - Static Web Apps - C#

This is an example of [Blazor WebAssembly](https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-6.0#blazor-webassembly) client application and an API, all hosted in a single [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/). Both Client and the Api is written C#. The infrastructure is created with [Bicep](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/). The deployments use staging environments and is done with Github actions. This example is based on the template [staticwebdev](https://github.com/staticwebdev/blazor-starter/generate) for more information see https://docs.microsoft.com/en-us/azure/static-web-apps/deploy-blazor.

## Folder structure

* **Client**: The Blazor WebAssembly sample application
* **API**:  A C# Azure Functions API, which the Blazor application will call
* **Shared**: A C# class library with a shared data model between the Blazor and Functions application
* **Infrastructure**: Infrastructure by code, a bicep template
* **.github/workflows/deploy-static-web-app.yml**: A github actions for deployment

Setup
-----
Api:
    F1 - Azure Static Web Apps: Create HTTP Function
Client:
    yarn create react-app my-app --template typescript

Run
---
Client:
    yarn start
Api:
    npm run start
    curl http://localhost:7071/api/HttpTrigger1
Both:
    swa start ./client/build/ --api-location ./api
    http://localhost:4280

## Deployment
Before a deploy of Static Web Apps code can be done, you have to create the infrastructure (see below). The github action needs a secret to be able to deploy to the static web app. Copy the deployment token (on the static web app overview) and create a secret in github called "AZURE_STATIC_WEB_APPS_API_TOKEN"

### Create the infrastructure

First deploy infrastructure with bicep

```
az login
az account set --subscription <SUBSCRIPTION-ID-OR-SUBSCRIPTION-NAME>

resourceGroupName="<resource group name>"
az group create --name $resourceGroupName --location "westeurope"

az deployment group create \
--name DeployLocalTemplate-01 \
--resource-group $resourceGroupName \
--template-file main.bicep \
--parameters main.parameters.json \
--verbose
```

### Deploy to Azure Static Web Apps

At this time the only option is to deploy with github actions, see .github/workflows/deploy-static-web-app.yml.

Not supported:
* Deploy with vscode (works if you link static app to github, this is not done in this example)
* Deploy with az cli

### How it works
On each PR a new staging environment is created on your Static Web App. If you browse to your Static Web App in the Azure portal you find the staging uri for your PR. When the PR is closed the staging environment (for your PR) is removed. Then the main branch is deployd automatically on the production environment.

## How to Run locally:
It should be possible to start this from vscode, in this example it's not finalized. So you have start each project manually. You need a tool called [Azure Functions Core tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Clinux%2Ccsharp%2Cportal%2Cbash%2Ckeda)
which let run the azure functions locally.
 
### Start the API
```
cd api
npm run start
(curl http://localhost:7071/api/HttpTrigger1)
```

### Start the Client
```
cd client
yarn start
```

### Start Both Api and Client
```
swa start ./client/build/ --api-location ./api
(http://localhost:4280)
```

## Prerequisite
------------
npm i -g azure-functions-core-tools@4 --unsafe-perm true
npm install -g @azure/static-web-apps-cli

## Links:

--------------------------------------------------------------------

https://github.com/bbachi/react-azure-static-web-app
https://github.com/aaronpowell/aswa-react-template
https://github.com/GeekTrainer/aswa-student-starter-kit
Med dev container
https://github.com/aaronpowell/swa-elmish-template

swa cli
https://docs.microsoft.com/en-us/azure/developer/javascript/how-to/with-web-app/static-web-app-with-swa-cli/introduction
https://github.com/Azure/static-web-apps-cli


https://docs.microsoft.com/en-us/azure/developer/javascript/how-to/with-web-app/static-web-app-with-swa-cli/connect-client-to-api

launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to Node Functions",
            "type": "node",
            "request": "attach",
            "port": 9229,
            "preLaunchTask": "func: host start"
        }
    ]
}