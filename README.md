# gulp-gen
AngularJS code Generator for gulp (Gulp-gen)

## Code Generator (Front-end projects)
  
During the time i has been working on different kinds of projects, i have found many problems in front end development process principally when javascript is involved, those problems in many cases are: Exaggerations in development time, spagetti Code, Missing code standars and philosophies, Missing documentation, etc. having this considerations and problems this tool was created, based in gulp and easy to use. This plug in contains a serie of pre-built tasks to solve some of those problems previusly mentioned.


## Important References:

To understand how this generator works an why create code in this particular structure, you should go to John Papa's "Angular Style Guide"  for Angular 1 [here](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md).
  
## Folders and Files Structure:

The Gulp Gen generator use the Jhon Papa's methodology described in "Angular style Guide" document and include some new principles that are good to this kind of projects.

    App/ →  main folder application
        _appconfig/ → folder where the settings files are stored
            App.config.js →  contains code for .config() and .run() blocks 
            Messages.config.js →  has constants to store system messages.
            Resources.config.js →  has constanst with the  API resources URIs
            Routes.config.js → has constants with states (ui-router states) and urls (routing) 
        common/ →   contains common files to be used globally in the project 
            [components/] →  Optional (this folder is generated when a directive is created through gulp gen commands).  
                [[directiveName].directive.js] 
            common.js →  should have constants that should be defined in the development process to be use as global data.
            filters.js →  should have contains code for .filter() blocks
            helpers.js →  has common Factories methods to be use in whole the application. 
            messages.js → should have factory methods to manage mesagges components or wrap pop-up libraries
            requests.js → should have code to wrap any https library.
        [custom-module/]   
            [module-name].controller.js  
            [module-name].factory.js  
            [module-name].module.js  
            [[module-name].routes.js]
            [module-name].html
            [custom-submodule/] → this is a secondary module (submodule) that depends on his custom module parent
                    [submodule-name].controller.js  
                    [submodule-name].factory.js  
                    [submodule-name].module.js  
                    [[submodule-name].routes.js] → in submodules this file is optional.
                    [submodule-name].html
        app.js → Root application file
  
 
 This is an structure example generated with this plug-in (Gulp Gen):
### Main Modules

![Main Modules](https://v8x0ew.bn1304.livefilestore.com/y4mRseRPNSz48KybFgYhv5SAIDnfGvC0uHuZNg9GkTg8rwbTwKxNbGBr6lCNgDGtGV3CCR7DCiYaiJS4GNdLMHMPBZQAKgrb1R4X_equ-vUwl91uLXnB2q-Qo07diDaMY1CS1C90tajdGByr_MvJXCMBywcFfH_AE0cX6kIOsxzsDkqgjroRLPAimPZWXnhO1kaygAR2HwLScpHY8clZebKAg?width=370&height=202&cropmode=none)

### Secondary Modules (Submodules)

![Secondary Modules - submodules](https://v8vznw.bn1304.livefilestore.com/y4mCfXBlVdGMmZmRDbJ_y8Hx4AYFTxf3kuhUN6UWOZAWTgc5m5B0kGn5NvDYCfskMHj9G1izpRFIvFnhSBhzZarI6M-TJVrufwNdTAZzw3Ab3iK1Vadcg0aFmsDh6pUQIZk1XrTGGq_rG9P1d8-iGnXOmfOWH0W4QS6yjR-jD1fXH9vg8s9FJhPODWoyf0iYHqt7DcBjMQBl4RQdoUa54zQsw?width=374&height=216&cropmode=none)
 
 
# Getting starter 


1. Install gulp and gulp-cli globally.

        npm install gulp gulp-cli -g

2. Install gulp-gen package 

        npm install gulp-gen --save-dev

3. add the package  to your gulpfile 

        var gulpGen = require('gulp-gen')();

    **Important:** if your project is located into a folder you should to specify this with a dobble call javascript syntax.
        
        var gulpGen = require('gulp-gen')('[directoryName]');
 
 4. Verify exists in gulp environment the pre-built tasks from gulp-gen all of those should have a prefix 'gen:' next to it, the name of the item to generate.

        gulp --tasks

## Settings: 
 
To generate an application directory is necessary to know that the name for this folder will be created by default with the name "app", but it could be changed from the "app.json" settings file that should has been created after you run the "gulp gen" initial command.
 
### The minimum properties required in this file are:
 
    - "angular-template": "node_modules/gulp-gen/angular-tpls/", →  Contains by default the templates location created for angular to this plug-in
    - "appName": "cwApp", → it correspond to the name that will be used for generate the application directory and to create the name of the main module in the root file for the app. 
    - "appFolder": "./", →  Contains the path where the application files will be created.
    - "defaultFolders": ["_appconfig", "common", "app.js"], →  Required files and folders.

### Extra Settings
    - "injectThirdApp": It is expected to be used only when the app that you are creating has a direct dependency from other angular application so you are using some files comming from that application, could be an application that you created before and you want to recycle functionalities or maybe a third part application that you need to use some of these functionalities.
    - "ignoreModuleInject": This was created specifically to be used when you need to exlude files to be injected or user by the app you are creating
    - "mainAppModuleName": This property could be used to provide the name for the main module.
    - "commonFolderName": This property could be used to provide the name for the common folder that contains some general functionality.
    - "appConfigFolder": With this property si posible define a name to a config folder for the application.
     
## Use (commands): 
 
All the commands built in this plug-in hava a structure based on the following parameters> 
 
    gulp gen[:<itemToGenerate> -\<nameForThatItem> [others commands depending on task]] 
 
## Availables items list to generate: 
 
- app 
- config (configurations files)
- module 
- submodule 
- component (Directives and components)
- controller
- factory
- routes
 
# Examples: 

 **Important Notes:**  
 
- Gulp gen tasks generate files with code this in not totally necesary is use like samples to show how the code should be writed and distributed in the entired file.

## Generar una app: 
    gulp gen 

This command create a directory with all the project base initial structure (folders and files) into the the folder you specified into the gulp-gen instance. also this command create a folder that corresponds to a basic ancgular application this dierctory take his name from app.json settings file with the "appName" property value (by default this value is "app").
    
Folder Structure generated  with this command:

    - app/
    - images/
    - styles/
    - scripts/
    - app.json
    - bower.json
    - instructions.md

Note: As you can see there is a "bower.json" file, this document contains all the necessary angular dependencies, so you need to run the "bower install" command, before you start coding and testng.

 ## Generate a module: 
        gulp gen:module -moduleName

This command create a directory into the app folder that should had created previously with all the files required in this kind of module.
 
## Generate a submodule: (modulo hijo) 
        gulp gen:submodule -submoduleName -in -parentModuleName 

This command create a folder into the application existing module directory  with the files that are required for any submodule.
 
## Generate a controller file: 
        gulp gen:controller –controllerName -in –parentModuleName 
    
This command create a controller file with the name provided in the first argument into the directory specified in the third argument after the keyword ("-in").
    
## Generate a factory file: 
        gulp gen:factory –factoryName -in –parentModuleName 

This command create a factory file with the name provided in the first argument into the directory specified in the third argument after the keyword ("-in").
 
## Generate a routes file: 
        gulp gen:routes –routesFor  -in –parentModuleName  
    
This command create a routes file with the name provided in the first argument into the directory specified in the third argument after the keyword ("-in")
 
## Generate a componente: 
    gulp gen:component –componentName  
    
This command create a directive file with the name provided in the argument inside the common folder into a directory called "components" if this folder does not exist this command will create it.

## Inject app files in index.html: 
    gulp gen:inject  

## launch a testing Server: 
    gulp gen:server  

## Generate a distribution folder: 
    gulp gen:build -[enviroment]

    (Important: this command depends on the parameters wroted into the property enviroments located in the app.json file, the [enviroment] default variables are local, develop, production )

    Examples:
        - To genera a distribution folder and run the site with a local test configuration profile, use:
            gulp gen:build -local
        - To genera a distribution folder and run the site with a develop test configuration profile in local use:
            gulp gen:build -develop
        - To genera a distribution folder and run the site with a production test configuration profile in local use:
            gulp gen:build -production



## Release Notes:
- 1.2.3, 1.2.4, 1.2.5
    - BUG Fixed: Update documentation for gulp gen command

- 1.2.2
    - BUG Fixed: Added some additional documentation

- 1.2.1
    - BUG Fixed: Updated documentation with some new features

- 1.2.0
    - Added site generator helper.
    - Added enviroments profiles (building profiles).
        *This task generate the distribution folder ready to a public publishing
    - Added automatically file injection.
    - Added server launch.

- 1.1.0
    - Some adjustments and improvemenst, resolving some bugs with gulp basic tasks
    
- 1.0.0 
    - Added Gup gen basic tasks to create an angular app
    - Adding documentation for develeopment process using this plugin.

## Pending features in mind:
| Feature | Status |
|-|-|
 Automatically files optimization by developments profiles environment | Development
 Generate a distribution folder ready to a public pusblishing. | Development
 Add taks for continuous integration. | Development
 Automatically unit test creation. | Planning
 Angular version updates helper | Idea


---
 ## ¡ Please be patient many updates and great functionalities comming !
 