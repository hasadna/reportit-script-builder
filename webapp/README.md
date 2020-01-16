# ReportitScriptBuilder

To set up your development environment, follow these steps:

## Installation
Install these:
* [node](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* [protoc](https://github.com/protocolbuffers/protobuf/releases)
* [ng](https://angular.io/)

Optional:
* [firebase](https://firebase.google.com/docs/hosting/quickstart), to be able to deploy.

Run `npm ci` to install common node modules  

Run `npm ci` to install node modules  

## Development
Open direct project  
Run `npm start` to start a dev server. Navigate to `http://localhost:4200/`  
Run `npm run lint` to find tslint errors.  
Run `npm run lint-fix` to fix tslint errors.  

## Deploying
```
npm run build
npm run deploy
```

How to use firebase hosting:  
https://firebase.google.com/docs/hosting/quickstart  
