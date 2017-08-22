# Credinet Web - Generador de código (Front-end)
  
Tiempo de desarrollo, código "chorizo", falta de lineamientos de desarrollo y problemas con el orden del código, falta de documentación entre otros. Tomando en consideración estos problemas que son los más consistentes dentro del desarrollo de aplicaciones con JavaScript, sea cual sea el framework utilizado, se creó una herramienta dependiente de gulp para generar solventar estos inconvenientes y así lograr una uniformidad de manera automática en este tipo de proyectos.  
  
## GULP Generator:  
Este es un generador de código que basado en comandos y utilizados por medio de tareas de automáticas que facilita al desarrollador el proceso de escritura de código  para permitir que se centre solo en la solución del problema.  
  
## Estructura base:   
Este generador utiliza la metodología descrita por John Papa en "Angular style Guide" con algunas modificaciones que van ligadas a la implementación de nuevas versiones del framework.

    App/ →  carpeta principal de la aplicación
        _appconfig/ →  archivos de configuración  
            App.config.js →  boques .config() y .run()  
            Messages.config.js →  constantes para mensajes del sistema  
            Resources.config.js →  constantes de recursos del API  
            Routes.config.js →  constantes con estados y URLs  
        common/ →   carpeta común   
            [components/] →  opcional (se genera cuando se crean directivas).  
                [[nombredirectiva].directive.js] 
            common.js →  Constantes comunes 
            filters.js →  todos los bloques .filter() 
            helpers.js →  Factory con funcionalidades comunes compartidas entre módulos  
            messages.js →  Factory con métodos para mostrar mensajes (pop ups)  
            requests.js →  Factory envoltura para la librería para peticiones http 
        [modulo-personalizado/]   
            [nombre-modulo].controller.js  
            [nombre-modulo].factory.js  
            [nombre-modulo].module.js  
            [[nombre-modulo].routes.js]  
            [nombre-modulo].html  
        app.js  
  
 
 Ejemplo de una estructura generada con gulp Generator (Gulp:gen): 

### Módulos Base

![Modulo Base](https://v8x0ew.bn1304.livefilestore.com/y4mRseRPNSz48KybFgYhv5SAIDnfGvC0uHuZNg9GkTg8rwbTwKxNbGBr6lCNgDGtGV3CCR7DCiYaiJS4GNdLMHMPBZQAKgrb1R4X_equ-vUwl91uLXnB2q-Qo07diDaMY1CS1C90tajdGByr_MvJXCMBywcFfH_AE0cX6kIOsxzsDkqgjroRLPAimPZWXnhO1kaygAR2HwLScpHY8clZebKAg?width=370&height=202&cropmode=none)

### Submodulos 

![submodulo](https://v8vznw.bn1304.livefilestore.com/y4mCfXBlVdGMmZmRDbJ_y8Hx4AYFTxf3kuhUN6UWOZAWTgc5m5B0kGn5NvDYCfskMHj9G1izpRFIvFnhSBhzZarI6M-TJVrufwNdTAZzw3Ab3iK1Vadcg0aFmsDh6pUQIZk1XrTGGq_rG9P1d8-iGnXOmfOWH0W4QS6yjR-jD1fXH9vg8s9FJhPODWoyf0iYHqt7DcBjMQBl4RQdoUa54zQsw?width=374&height=216&cropmode=none)
 
 
## Requerimientos: 
 
Antes de realizar cualquier acción para generar código, se debe verificar que el archivo "app.json" y la carpeta "angular-tpls" requeridos estén presentes dentro de la carpeta raíz de la aplicación, en el mismo nivel que el gulp file. 
 
 
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
 