# gulp-gen
AngularJS code Generator for gulp (Gulp-gen)

# Code Generator (Front-end projects)
  
During the time i has been working on different kinds of projects, i have found many problems in front end development process principally when javascript is involved, those problems in many cases are: Exaggerations in development time, spagetti Code, Missing code standars and philosophies, Missing documentation, etc. Taken this considerations and problems this tool was created, based in gulp and easy to use. This plug in contains a serie of pre-built tasks to solve some of those problems previusly mentioned.
 
This is not only a code generator, in addition to this some tasks are created to help the developer to manage an  angularJS project with a pre-built structure, When a developer use this plug-in with every featured, he will be able to generate a package ready to publish with all the paramers needed in web sites.
  
## File Structure:   
The Gulp Gen generator use the Jhon Papa's methodology described in "Angular style Guide" including some new principles that are good to this kind of projects.

    App/ →  main folder application
        _appconfig/ →  folder where the settings files are stored
            App.config.js →  contains code for .config() y .run() blocks 
            Messages.config.js →  has constants to store system messages.
            Resources.config.js →  has constanst with the  API resources URIs
            Routes.config.js → has constants with states (ui-router states)  and urls (routing) 
        common/ →   common folder   
            [components/] →  opcional (this folder is generated when a directive is created through gulp gen commands).  
                [[directiveName].directive.js] 
            common.js →  has constants that are defined in the development process to be useed globally
            filters.js →  contains code for .filter() blocks
            helpers.js →  has Factory common methods that all the application needs use 
            messages.js →  has factory methods to manage mesagges components
            requests.js → should have code to wrap any https library.
        [custom-module/]   
            [nombre-modulo].controller.js  
            [nombre-modulo].factory.js  
            [nombre-modulo].module.js  
            [[nombre-modulo].routes.js]  
            [nombre-modulo].html  
        app.js  
  
 
 This is an structure example generated with this plug in (Gulp Gen):

### Main Modules

![Main Modules](https://v8x0ew.bn1304.livefilestore.com/y4mRseRPNSz48KybFgYhv5SAIDnfGvC0uHuZNg9GkTg8rwbTwKxNbGBr6lCNgDGtGV3CCR7DCiYaiJS4GNdLMHMPBZQAKgrb1R4X_equ-vUwl91uLXnB2q-Qo07diDaMY1CS1C90tajdGByr_MvJXCMBywcFfH_AE0cX6kIOsxzsDkqgjroRLPAimPZWXnhO1kaygAR2HwLScpHY8clZebKAg?width=370&height=202&cropmode=none)

### Secondary Modules (Submodules)

![Secondary Modules - submodules](https://v8vznw.bn1304.livefilestore.com/y4mCfXBlVdGMmZmRDbJ_y8Hx4AYFTxf3kuhUN6UWOZAWTgc5m5B0kGn5NvDYCfskMHj9G1izpRFIvFnhSBhzZarI6M-TJVrufwNdTAZzw3Ab3iK1Vadcg0aFmsDh6pUQIZk1XrTGGq_rG9P1d8-iGnXOmfOWH0W4QS6yjR-jD1fXH9vg8s9FJhPODWoyf0iYHqt7DcBjMQBl4RQdoUa54zQsw?width=374&height=216&cropmode=none)
 
 
## Getting starter (step by step): 


1. Install gulp and gulp-cli globally.

        npm install gulp gulp-cli -g

2. Install gulp-gen package 

        npm install gulp-gen --save-dev

3. add the package  to your gulpfile 

        var gulpGen = require('gulp-gen');

    **Important:** if your project is located into a folder you should to specify this with a dobble call javascript syntax.
        
        var gulpGen = require('gulp-gen')('[directoryName]');
 
## Configuración inicial: 
 
Para generar una carpeta de aplicación es necesario modificar las propiedades dentro de ese archivo con la información que le corresponde a la carpeta donde se ubicara la aplicación entre otros datos. 
 
Las propiedades con mayor importancia son: 
 
    - "angular-template": "angular-tpls/", →  se modifica solo si la carpeta de las plantillas cambia 
    - "appName": "cwApp", → nombre con el que se genera la carpeta de la aplicación y el nombre del modulo ppal. 
    - "appFolder": "./", →  pertenece la ruta de la carpeta raíz donde esta ubicada la aplicación 
    - "defaultFolders": ["_appconfig", "common", "app.js"], →  Elementos obligatorios dentro de la carpeta de la app generada 
 
**Nota:** Las propiedad del archivo app.json "appName" solo se modificara antes de ejecutar cualquier comando, ya que esa propiedad contendrá el nombre de la carpeta con la que se creara la aplicación. 
 
 
## Uso: 
 
Gulp:gen está ligado a la tecnología de tareas automatizadas gulp por ende la estructura que utiliza está basada en este formato: 
 
    gulp gen[:<característica> -\<nombreCarcteristica> [comandos adicionales]] 
 
## Lista de Características y sus parámetros: 
 
- app - \<nombreAplicacion> 
- config - \<nombreArchivoConfiguracion> 
- module - \<nombreModulo> 
- submodule - \<nombreSubmodulo> 
- controller - \<nombreControllador> -in -<nombreModulo[nombreSubmodulo]> 
- factory - \<nombreFactory > -in -<nombreModulo[nombreSubmodulo]> 
- routes - \<nombreRoutes > -in -<nombreModulo[nombreSubmodulo]> 
- component - \<nombreComponente[nombreDirecitva]> 
 
## Ejemplos: 
 
## Generar una app: 
    gulp gen 
    (Este comando genera una carpeta con la estructura base inicial de un proyecto tomando el nombre desde el archivo app.json en la propiedad "appName" por defecto el nombre es "app") 
 
### Generar un módulo completo: 
    gulp gen:module –nombreDeMiModulo
    (Este comando genera una carpeta de modulo dentro en la carpeta de aplicación y dentro del módulo crea los archivos, que por lineamientos debe tener, además estos archivos ya contienen un código base) 
 
### Generar un submodulo completo: (modulo hijo) 
    gulp gen:submodule –nombreSubmodulo -in –nombreModuloPadre 
    (Este comando genera una carpeta dentro de un módulo existente de la aplicación con los archivos que por lineamientos debe tener un submodulo[modulo hijo]  además, estos archivos ya contienen un código base) 
 
### Generar un controlador: 
    gulp gen:controller –nombreControlador -in –nombreModuloPadre 
    (Este comando genera un controlador dentro de un módulo existente de la aplicación indicado después del parámetro “-in”, además este archivo ya contienen un código base) 
    
### Generar un factory: 
    gulp gen:factory –nombreFactory -in –nombreModuloPadre 
    (Este comando genera un factory dentro de un módulo existente de la aplicación indicado después del parámetro “-in”, además este archivo ya contienen un código base) 
 
### Generar un archivo de rutas: 
    gulp gen:routes –nombreRutas  -in –nombreModuloPadre  
    (Este comando genera un archivo de rutas dentro del módulo indicado después del parámetro “-in”, este archivo ya contienen un código base de rutas dependiente de la librería ui-router) 
 
### Generar un componente: 
    gulp gen:component –nombreComponente  
    (Este comando genera un archivo de directiva dentro del módulo common, este archivo ya contienen el código base para una directiva). 
 