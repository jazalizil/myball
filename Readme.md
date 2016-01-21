# weBall myBall Portal

The myBall portal is a project designed to use the weBall API to allow 'five' futsal owners
to manage their reservations and their fields.

## Instructions
### 1. Install Node.js
* http://howtonode.org/how-to-install-nodejs

### 2. Install yeoman, gulp and bower
* npm install -g yo gulp bower

### 3. Install node modules
* cd into project folder
* npm install

### 4. Install bower components
* cd into project folder
* bower install

### 5. Build project
* cd into project folder
* gulp build for the vitrine app
* gulp build --users for the users app
* gulp build --managers for the managers app

### 6. Start testserver
* cd into project folder
* gulp serve

### 7. Documentations are friendly
* Angular - material for css ; angularJs for the rest
* https://material.angularjs.org/latest/
* https://docs.angularjs.org/api

### 8. Don't forget tests !
* Each controller/service/directive that you code should be tested !!

### Possible Gulp tasks

* gulp or gulp build to build an optimized version of your application in /dist
* gulp serve to launch a browser sync server on your source files
* gulp serve:dist to launch a server on your optimized application
* gulp test to launch your unit tests with Karma
* gulp test:auto to launch your unit tests with Karma in watch mode
* gulp protractor to launch your e2e tests with Protractor
* gulp protractor:dist to launch your e2e tests with Protractor on the dist files
* gulp pot to extract all translatable strings into the file po/template.pot
* gulp translations to compile all translation files into a json structure
* gulp config to config project environment

### Possible Gulp args

* gulp --dev run the project with API URL on local and DEBUG
* gulp --prod run the project with distant API URL and no DEBUG
* gulp --staging (default) run the project with distant API URL and DEBU
* gulp --users run the users application
* gulp --managers run the manager application