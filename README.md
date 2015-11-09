Dazzle
========

[Swarm](https://swarm.fund/)'s front-end application.

Requirements
------------

- NPM;
- Ruby;
- Sass;
- Compass.

Installation
-----------

Once NPM, Ruby, Sass and Compass are installed, run

- `npm install` to install dependencies.
- `bower install` to install vendor dependencies;

Development
-----------

- `grunt development` for development build;
- `grunt production` for production build.

Sources are compiled into `dist/` folder.

Deployment
-----------

- `grunt firebase-development` - deploy to --DEVELOPMENT-- server [https://dazzle-dev.firebaseapp.com/](https://dazzle-dev.firebaseapp.com/);
- `grunt firebase-splash` - deploy to --STAGING-- server [https://dazzle-splash.firebaseapp.com/](https://dazzle-splash.firebaseapp.com/);
- `grunt firebase-staging` - deploy to --PRODUCTION-- server [https://swarm.fund/](https://swarm.fund/).