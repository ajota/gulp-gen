//**
//* =======================================GULP:GEN=================================================
//* 
//*/
(function(){
    
        'use strict';
    
        const PLUGIN_NAME = 'gulp-gen';
        //modules required
        var fs = require('fs');
        var gulp = require('gulp');
        var ejs = require('gulp-ejs');
        var inject = require('gulp-inject');
        var rename = require('gulp-rename');
        var injectStr = require('gulp-inject-string');
        //var browserSync = require('browser-sync').create();
    
        //globals
        var name;
    
        var tasksData = {};
        var AppResources = {};
    
        var tplAppJson = __dirname + '/angular-tpls/app.json' ;
        var tplInstructions = __dirname + '/angular-tpls/instructions.md';
        var currentDate = (new Date()).getHours() + ':' + (new Date()).getMinutes() + ':' + (new Date()).getSeconds();
        var gulpGenPrefix = '----------[Gulp:gen ' + (currentDate) + ']----------\n';
    
        function getDirectories (dir) {
            //folder from command execution
            var nUserDir = dir;
            var nDirectory = process.cwd() + '/';
    
            if(nUserDir) {
                var cond = (/\w+\/$/i).test(nUserDir);
                if(!cond){
                    nUserDir =+ '/';
                }
                nDirectory = nDirectory + nUserDir;
            }
    
            return {appAbsoluteFolder: nDirectory, appFolder: nUserDir };
        }
    
        function generateAppConfigFile (appDirectory, reset) {
            
            var directory = getDirectories(appDirectory);
            var locationAppJson =  directory.appAbsoluteFolder + 'app.json';
            var locationInstructions = directory.appAbsoluteFolder + 'instructions.md';
    
            var cond1 = fs.existsSync(locationAppJson);
            if(!cond1 || reset){
                var instructions = fs.readFileSync(tplInstructions, { encoding: 'utf8' });
                var appJson = fs.readFileSync(tplAppJson, { encoding: 'utf8' });
                    appJson = JSON.parse(appJson);
                    
                    //Se configuran las rutas 
                    appJson.appFolder = appDirectory;
                    appJson.mainFolders.styles = directory.appFolder + appJson.mainFolders.styles;
                    appJson.mainFolders.scripts = directory.appFolder + appJson.mainFolders.scripts;
                    appJson.mainFolders.images = directory.appFolder + appJson.mainFolders.images;
                //create initial files 
                fs.writeFileSync(locationAppJson, JSON.stringify(appJson, null, 4));
                fs.writeFileSync(locationInstructions, instructions);
            }
            
            // AppResources = JSON.parse(fs.readFileSync(locationAppJson, { encoding: 'utf8' }));
            AppResources = require(locationAppJson);
            
        }
    
        /**
         * This function initialize the new default tasks to generate modules and sample code
         * @param {Object} appDirectory: application directory where the code should bue generated
         * @param {Object} reset: TRUE if is necessary to regenerate the app.json file, default UNDEFINED or FALSE
         */
        var gulpGen = function (appDirectory) {
    
            generateAppConfigFile(appDirectory);
    
            gulp.task('gen', ['gen:app', 'gen:config'], function () {
    
                var commonFiles = [
                    AppResources['angular-template'] + 'messages.js',
                    AppResources['angular-template'] + 'commons.js',
                    AppResources['angular-template'] + 'requests.js',
                    AppResources['angular-template'] + 'leeme.md',
                ];
                var commonFolder = AppResources.appName + '/common/';
                var isDir = fs.existsSync(AppResources.appFolder + commonFolder);
    
                if (!isDir) {
                    console.log(gulpGenPrefix + 'Creating common folder for angular ' + AppResources.appName + ' app...');
                    gulp.src(commonFiles)
                        .pipe(ejs({ mainModule: name }, { ext: '.js' }))
                        .pipe(rename({ dirname: commonFolder }))
                        .pipe(gulp.dest(AppResources.appFolder));
                    console.log(gulpGenPrefix + 'The common folder it\'s ready!.');
                } else {
                    console.warn(gulpGenPrefix + 'The folder common/ all ready exists.');
                    process.exit();
                }
            });
    
            gulp.task('gen:app', function () {
    
                name = AppResources.appName;
    
                if (name.length > 0) {
                    name = (Array.isArray(name)) ? name[0].replace(/[^\w]/, '') : name;
    
                    var appFiles = [
                        AppResources['angular-template'] + 'app.js',
                        //AppResources['angular-template'] + 'instructions.md',
                    ];
                    var appFolder = AppResources.appName + '/';
                    var isDir = fs.existsSync(AppResources.appFolder + appFolder);
    
                    if (!isDir) {
    
                        console.log(gulpGenPrefix + 'Creating angular app folder...');
    
                        gulp.src(appFiles)
                            .pipe(ejs({ mainModule: name }, { ext: '.js' }))
                            .pipe(rename({ dirname: appFolder }))
                            .pipe(gulp.dest(AppResources.appFolder));
                        console.log(gulpGenPrefix + 'Angular app folder ready!.');
                    } else {
                        console.warn( gulpGenPrefix + 'The folder' + AppResources.appName + ' all ready exists.');
                        console.warn( gulpGenPrefix + 'Please, change the name of the app with the property "appName" in "app.json" configuration file located in ' + appDirectory );
                        process.exit();
                    }
                } else {
                    console.warn(gulpGenPrefix + 'You should provide an argument with the name of the app in property "appName" into the file app.json.');
                    console.warn(gulpGenPrefix + 'Example: gulp gen -appName.');
                    process.exit();
                }
            });
    
            gulp.task('gen:config', function () {
    
                var configFiles = AppResources['angular-template'] + '*.config.js';
                var configFolder = AppResources.appName + '/_appconfig/';
                var isDir = fs.existsSync(AppResources.appFolder + configFolder);
    
                if (!isDir) {
                    console.log(gulpGenPrefix + 'Creating configuartion folder for angular ' + AppResources.appName + ' app...');
                    gulp.src(configFiles)
                        .pipe(ejs({ mainModule: name, AppResources: AppResources }, { ext: '.js' }))
                        .pipe(rename({ dirname: configFolder }))
                        .pipe(gulp.dest(AppResources.appFolder));
                    console.log(gulpGenPrefix + 'The configuartion folder it\'s ready!.');
                } else {
                    console.warn(gulpGenPrefix + 'The folder _appconfig/ all ready exists.');
                    process.exit();
                }
            });
    
            gulp.task('gen:module', function () {
                var originalName;
                var camel;
                //ask name
                name = process.argv.slice(3);
    
                if (name.length <= 0) {
                    prompt.get(['name'], createModule);
                } else {
                    createModule();
                }
    
                function createModule(err, result) {
                    var task;
    
                    name = (name.length > 0) ? name : result.name;
    
                    if (name.length > 0) {
                        name = (Array.isArray(name)) ? name[0].replace(/[^\w]/, '') : name;
                        originalName = name;
                        camel = name.search('-');
                        if (camel >= 0) {
                            name = name.substr(0, camel) +
                                name.substr((camel + 1), name.length).charAt(0).toLocaleUpperCase() +
                                name.substr((camel + 1), name.length).slice(1);
                        }
                        var mainFileModule = AppResources.appFolder + AppResources.appName + '/' + (AppResources.mainAppFileName || 'app.js');
                        // console.log(mainFileModule);
                        // process.exit();
                        if(fs.existsSync(mainFileModule)){    
                            var mainModule = fs.readFileSync(mainFileModule, 'utf8').match(/module\('(.*)'/)[1];
                            var moduleName = mainModule + '.' + name;
                            var hasModule = (new RegExp('\'' + moduleName + '\',', 'i')).test(fs.readFileSync(mainFileModule, 'utf8'));
    
                            var moduleUpper = name.charAt(0).toUpperCase() + name.slice(1);
                            var moduleFolder = AppResources.appName + '/' + originalName + '/';
                            var isApp = fs.existsSync(AppResources.appFolder + AppResources.appName + '/');
    
                            var issetModules = fs.readdirSync(AppResources.appFolder + AppResources.appName + '/');
    
                            var isModule = fs.existsSync(AppResources.appFolder + moduleFolder);
    
                            var moduleFiles = [
                                AppResources['angular-template'] + 'controller.js',
                                AppResources['angular-template'] + 'factory.js',
                                AppResources['angular-template'] + 'module.js',
                                AppResources['angular-template'] + 'routes.js',
                            ];
    
                            //Exists modules
                            AppResources.defaultFolders.forEach(function (item) {
                                issetModules.splice(issetModules.indexOf(item), 1);
                            });
    
                            var options = {
                                module: moduleName,
                                folderName: originalName,
                                factoryName: name,
                                factoryNameUpper: moduleUpper,
                                controllerName: name,
                                routerName: name,
                                viewName: name,
                                controllerNameUpper: moduleUpper,
                                defaultRoute: (issetModules.length > 0),
                            };
    
                            if (isApp && !isModule) {
                                console.log(gulpGenPrefix + 'Creating folder ' + originalName + '...');
    
                                gulp.src(AppResources['angular-template'] + 'views.html')
                                    .pipe(rename({ dirname: '', basename: originalName }))
                                    .pipe(gulp.dest(AppResources.appFolder + moduleFolder));
    
                                task = gulp.src(moduleFiles)
                                    .pipe(ejs(options, { ext: '.js' }))
                                    .pipe(rename({ dirname: moduleFolder, prefix: originalName + '.' }))
                                    .pipe(gulp.dest(AppResources.appFolder));
                                setTimeout(function () {
                                    tasksData = options;
                                    gulp.start('inject');
                                    gulp.start('inject:route');
                                }, 2000);
    
                                console.log(gulpGenPrefix + 'The ' + originalName + '/ folder it\'s ready!.');
                            } else {
                                console.warn(gulpGenPrefix + 'It is not posible create the module ' + originalName + '/');
                                console.warn(gulpGenPrefix + 'Please, Make sure that the ' + AppResources.appName + ' folder it\'s  all ready created.');
                                console.warn(gulpGenPrefix + 'Also, Make sure that the ' + originalName + '/ module folder was not created yet.');
                            }
                            /*console.log('se crea el modulo');
                            process.exit();*/
                            if (!hasModule) {
                                console.log(gulpGenPrefix + 'Injecting the module name in' + mainFileModule + ' main file...');
    
                                task = gulp.src(mainFileModule)
                                    .pipe(injectStr.before('\/\*@endCustomModule\*\/', '\'' + moduleName + '\',\n            '))
                                    .pipe(gulp.dest(AppResources.appFolder + AppResources.appName));
    
                                console.log(gulpGenPrefix + 'The ' + moduleName + ' has been injected!.');
                                return task;
                            } else {
                                console.log(gulpGenPrefix + 'The ' + moduleName + ' is already injected!.');
                            }
                        }else{
                            console.warn(gulpGenPrefix + '\n Make sure that the root file for the application in \"' + appDirectory + '\" directory is called the same as the folder application name. if not please use the \"mainAppFileName"\ property in app.json to put the name for this main application file.\n' );
                            process.exit();
                        }
                    } else {
                        console.warn(gulpGenPrefix + 'You should provide an argument with the name of the module.');
                        console.warn(gulpGenPrefix + 'Example: gulp gen:module -moduleName or -module-name.');
                        return task;
                    }
                }
            });
    
            //To use this task just type on terminal gen:submodule -[name of the new module] -in -[name of the parent module]
            gulp.task('gen:submodule', function () {
    
                var name;
                var camel;
                var subModule;
                var originalName;
                var camelSubModulo;
                var originalSubModule;
    
                name = process.argv.slice(5);
                subModule = process.argv.slice(3);
    
                if (name.length > 0) {
    
                    name = (Array.isArray(name)) ? name[0].replace(/[^\w]/, '') : name;
                    subModule = subModule[0].replace(/[^\w]/, '');
    
                    originalName = name;
                    originalSubModule = subModule;
    
                    camel = name.search('-');
                    camelSubModulo = originalSubModule.search('-');
    
                    if (camel >= 0) {
                        name = name.substr(0, camel) +
                            name.substr((camel + 1), name.length).charAt(0).toLocaleUpperCase() +
                            name.substr((camel + 1), name.length).slice(1);
                    }
                    if (camelSubModulo >= 0) {
                        subModule = subModule.substr(0, camelSubModulo) +
                            subModule.substr((camelSubModulo + 1), subModule.length).charAt(0).toLocaleUpperCase() +
                            subModule.substr((camelSubModulo + 1), subModule.length).slice(1);
                    }
    
                    var mainModule = fs.readFileSync(AppResources.appFolder + AppResources.appName + '/app.js', 'utf8').match(/module\('(.*)'/)[1];
                    var moduleName = mainModule + '.' + name;
                    var subModuleUpper = subModule.charAt(0).toUpperCase() + subModule.slice(1);
    
                    var moduleFolder = AppResources.appName + '/' + originalName + '/' + originalSubModule + '/';
                    var isApp = fs.existsSync(AppResources.appFolder + AppResources.appName + '/');
    
                    var issetModules = fs.readdirSync(AppResources.appFolder + AppResources.appName + '/');
    
                    var isModule = fs.existsSync(AppResources.appFolder + moduleFolder);
    
                    var moduleFiles = [
                        AppResources['angular-template'] + 'controller.js',
                        AppResources['angular-template'] + 'factory.js',
                        AppResources['angular-template'] + 'routes.js',
                    ];
    
                    //Exists modules
                    AppResources.defaultFolders.forEach(function (item) {
                        issetModules.splice(issetModules.indexOf(item), 1);
                    });
    
                    var options = {
                        module: moduleName,
                        folderName: originalSubModule,
                        factoryName: subModule,
                        factoryNameUpper: subModuleUpper,
                        routerName: subModule,
                        viewName: subModule,
                        controllerName: subModule,
                        controllerNameUpper: subModuleUpper,
                        defaultRoute: (issetModules.length > 0),
                    };
    
                    if (isApp && !isModule) {
                        console.log(gulpGenPrefix + 'Creating folder ' + originalSubModule + '...');
    
                        gulp.src(AppResources['angular-template'] + 'views.html')
                            .pipe(rename({ dirname: '', basename: originalSubModule }))
                            .pipe(gulp.dest(AppResources.appFolder + moduleFolder));
    
                        gulp.src(moduleFiles)
                            .pipe(ejs(options, { ext: '.js' }))
                            .pipe(rename({ dirname: moduleFolder, prefix: originalSubModule + '.' }))
                            .pipe(gulp.dest(AppResources.appFolder));
    
                        console.log(gulpGenPrefix + 'The ' + originalSubModule + '/ folder it\'s ready!.');
                    } else {
                        console.warn(gulpGenPrefix + 'It is not posible create the module ' + originalSubModule + '/ in ' + originalName + '/');
                        console.warn(gulpGenPrefix + 'Please, Make sure that the' + AppResources.appName + ' folder it\'s  all ready created.');
                        console.warn(gulpGenPrefix + 'Also, Make sure that the ' + originalSubModule + '/ module folder was not created yet.');
                        process.exit();
                    }
                } else {
                    console.warn(gulpGenPrefix + 'You should provide an argument with the name of the module.');
                    console.warn(gulpGenPrefix + 'Example: gulp gen:module -moduleName or -module-name.');
                    process.exit();
                }
            });
    
            gulp.task('gen:controller', function () {
                name = process.argv.slice(3);
    
                if (name.length === 3 && name[1] === '-in') {
    
                    var controller = (Array.isArray(name)) ? name[0].replace(/[^\w]/, '') : name;;
                    var module = name[2].replace(/[^\w]/, '');
    
                    var moduleFolder = AppResources.appName + '/' + module + '/';
                    var mainModule = fs.readFileSync(AppResources.appFolder + moduleFolder + module + '.module.js', 'utf8').match(/module\('(.*)'/)[1];
    
                    var controllerUpper = controller.charAt(0).toUpperCase() + controller.slice(1);
                    var isModule = fs.existsSync(AppResources.appFolder + moduleFolder);
                    var isController = fs.existsSync(AppResources.appFolder + moduleFolder + controller + '.controller.js');
    
                    var controllerTpl = AppResources['angular-template'] + 'controller.js';
    
                    var options = {
                        module: mainModule,
                        controllerName: controller,
                        controllerNameUpper: controllerUpper,
                        factoryName: controller,
                        factoryNameUpper: controllerUpper,
                    };
                    if (isModule && !isController) {
                        console.log(gulpGenPrefix + 'Creating Controller ' + controller + '...');
                        //            console.log(isModule, isController);
                        //            process.exit();
    
                        gulp.src(controllerTpl)
                            .pipe(ejs(options, { ext: '.js' }))
                            .pipe(rename({ dirname: '', prefix: controller + '.' }))
                            .pipe(gulp.dest(AppResources.appFolder + moduleFolder));
    
    
                        console.log(gulpGenPrefix + 'The ' + controller + '/ folder it\'s ready!.');
                    } else {
                        console.warn(gulpGenPrefix + 'It is not posible create the controller ' + controller + '.controller.js');
                        console.warn(gulpGenPrefix + 'Please, Make sure that the the folder module' + controller + ' it\'s  all ready created.');
                        console.warn(gulpGenPrefix + 'Also, Make sure that the ' + controller + '.controller.js module was not created before.');
                        process.exit();
                    }
                } else {
                    console.warn(gulpGenPrefix + 'The command should have (3) aguments, example: gulp gen:controller -<controllerName> -in <moduleName>');
                    console.warn(gulpGenPrefix + 'The <moduleName> argument it is name of the existing module where you want to put the controller generated');
                    process.exit();
                }
            });
            //To use this task just type on your terminal gen:factory -[name of the new factory] -in -[relative directory to the module]
            gulp.task('gen:factory', function () {
                var name = process.argv.slice(3);
    
                if (name.length === 3 && name[1] === '-in') {
    
                    var mainModule;
                    var factory = name[0].replace(/[^\w]/, '');
                    var module = name[2].replace(/[^\w]/, '');
    
                    var moduleFolder = AppResources.appName + '/' + module + '/';
                    //
                    var isModule = fs.existsSync(AppResources.appFolder + moduleFolder + factory + '.module.js');
                    var isModuleFolder = fs.existsSync(AppResources.appFolder + moduleFolder);
                    var isFactory = fs.existsSync(AppResources.appFolder + moduleFolder + factory + '.factory.js');
                    if (isModule) {
                        mainModule = fs.readFileSync(AppResources.appFolder + moduleFolder + factory + '.module.js', 'utf8').match(/module\('(.*)'/)[1];
                    } else {
                        var parentModule = moduleFolder.split('/').filter(function (item) { return (item !== ''); });
                        var moduleName = parentModule[(parentModule.length - 1)];
    
                        parentModule.shift();
                        parentModule = (parentModule.join('/')) + '/';
                        if (moduleName.search('-') >= 0) {
                            var txt = moduleName.match(/-./).toUpperCase();
                            var rgx = new RegExp(txt, 'i');
                            moduleName = moduleName.replace(rgx, txt);
    
                        }
    
                        mainModule = fs.readFileSync(AppResources.appName + '/' + parentModule + moduleName + '.module.js', 'utf8').match(/module\('(.*)'/)[1];
                    }
                    //        console.log(AppResources.appFolder + moduleFolder + moduleName);
                    //        process.exit();
    
                    var factoryUpper = factory.charAt(0).toUpperCase() + factory.slice(1);
    
                    var factoryTpl = AppResources['angular-template'] + 'factory.js';
    
                    var options = {
                        module: mainModule,
                        factoryName: factory,
                        factoryNameUpper: factoryUpper
                    };
    
                    if (isModuleFolder && !isFactory) {
                        console.log(gulpGenPrefix + 'Creating factory ' + factory + '...');
    
                        gulp.src(factoryTpl)
                            .pipe(ejs(options, { ext: '.js' }))
                            .pipe(rename({ dirname: '', prefix: factory + '.' }))
                            .pipe(gulp.dest(AppResources.appFolder + moduleFolder));
    
    
                        console.log(gulpGenPrefix + 'The factory' + factory + ' it\'s ready!.');
                    } else {
                        console.warn(gulpGenPrefix + 'It is not posible create the factory ' + factory + '.factory.js');
                        console.warn(gulpGenPrefix + 'Please, Make sure that the the folder module' + factory + ' it\'s  all ready created.');
                        console.warn(gulpGenPrefix + 'Also, Make sure that the ' + factory + '.factory.js module was not created before.');
                        process.exit();
                    }
                } else {
                    console.warn(gulpGenPrefix + 'The command should have (3) aguments, example: gulp gen:factory -<factoryName> -in <moduleName>');
                    console.warn(gulpGenPrefix + 'The <moduleName> argument it is name of the existing module where you want to put the factory generated');
                    process.exit();
                }
            });
    
            gulp.task('gen:routes', function () {
                name = process.argv.slice(3);
    
                if (name.length === 3 && name[1] === '-in') {
    
                    var routes = name[0].replace(/[^\w]/, '');
                    var isRoutes = false;
    
                    var module = name[2].replace(/[^\w]/, '');
                    var issetModules = fs.readdirSync(AppResources.appFolder + AppResources.appName + '/');
                    var moduleFolder = AppResources.appName + '/' + module + '/';
                    var isModule = fs.existsSync(AppResources.appFolder + moduleFolder);
    
                    var mainModule = fs.readFileSync(AppResources.appFolder + moduleFolder + module + '.module.js', 'utf8').match(/module\('(.*)'/)[1];
    
                    var routesUpper = routes.charAt(0).toUpperCase() + routes.slice(1);
                    var dirFiles = fs.readdirSync(AppResources.appFolder + moduleFolder);
    
                    AppResources.defaultFolders.forEach(function (item) {
                        issetModules.splice(issetModules.indexOf(item), 1);
                    });
    
                    dirFiles.forEach(function (item) {
                        if (item.search(/\.routes\.js/) >= 0) {
                            isRoutes = true;
                        }
                    });
    
                    var routesTpl = AppResources['angular-template'] + 'routes.js';
    
                    var options = {
                        module: mainModule,
                        routerName: routes,
                        controllerNameUpper: routesUpper,
                        viewName: routes,
                        defaultRoute: (issetModules.length > 0)
                    };
    
                    if (isModule && !isRoutes) {
                        console.log(gulpGenPrefix + 'Creating routes ' + routes + '...');
    
                        gulp.src(routesTpl)
                            .pipe(ejs(options, { ext: '.js' }))
                            .pipe(rename({ dirname: '', prefix: routes + '.' }))
                            .pipe(gulp.dest(AppResources.appFolder + moduleFolder));
    
    
                        console.log(gulpGenPrefix + 'The ' + routes + ' router it\'s ready!.');
                    } else {
                        console.warn(gulpGenPrefix + 'It is not posible create the routes ' + routes + '.routes.js');
                        if (isRoutes) {
                            console.warn(gulpGenPrefix + 'Also, You can not create more than one (1) file type *.routes.js in that module folder.');
                        } else {
                            console.warn(gulpGenPrefix + 'Please, Make sure that the the folder module "' + module + '/" folder has been created.');
                        }
                        process.exit();
                    }
                } else {
                    console.warn(gulpGenPrefix + 'The command should have (3) aguments, example: gulp gen:routes -<routesName> -in <moduleName>');
                    console.warn(gulpGenPrefix + 'The <moduleName> argument it is name of the existing module where you want to put the routes generated');
                    process.exit();
                }
            });
    
            gulp.task('gen:component', function () {
                name = process.argv.slice(3);
    
                if (name[0]) {
    
                    var directivefileName = (Array.isArray(name)) ? name[0].replace(/[^\w]/g, '') : name;
                    var directiveName = directivefileName;
    
                    if (directiveName.search(/[-\.]/g) >= 0) {
                        var cond1 = (directiveName.search('-') >= 0);
                        directiveName = (cond1) ? directiveName.split('-') : directiveName.split('.');
                        directiveName = directiveName[0] + directiveName[1].charAt(0).toUpperCase() + directiveName[1].slice(1);
                    }
    
                    var commonFolder = AppResources.appName + '/common/';
                    var dierctiveFolder = commonFolder + 'components/';
                    var isCommon = fs.existsSync(AppResources.appFolder + commonFolder);
                    var isComponent = fs.existsSync(AppResources.appFolder + dierctiveFolder + directivefileName + '.directive.js');
                    var mainModule = fs.readFileSync(AppResources.appFolder + commonFolder + 'commons.js', 'utf8').match(/module\('(.*)'/)[1];
                    var directiveTpl = AppResources['angular-template'] + 'directive.js';
    
                    var options = {
                        mainModule: mainModule,
                        directiveName: directiveName,
                    };
                    if (isCommon && !isComponent) {
                        console.log(gulpGenPrefix + 'Creating component ' + directiveName + '...');
    
                        gulp.src(directiveTpl)
                            .pipe(ejs(options, { ext: '.js' }))
                            .pipe(rename({ dirname: 'components', prefix: directivefileName + '.' }))
                            .pipe(gulp.dest(AppResources.appFolder + commonFolder));
                        setTimeout(function () {
                            gulp.start('inject');
                        }, 2000);
    
                        console.log(gulpGenPrefix + 'The ' + directiveName + ' component it\'s ready!.');
                    } else {
                        console.warn(gulpGenPrefix + 'It is not posible create the component ' + directivefileName + '.directive.js');
                        console.warn(gulpGenPrefix + 'Please, Make sure that the the folder module common it\'s  all ready created.');
                        console.warn(gulpGenPrefix + 'Also, Make sure that the ' + directivefileName + '.directive.js component was not created before.');
                        process.exit();
                    }
                } else {
                    console.warn(gulpGenPrefix + 'The command should have (3) aguments, example: gulp gen:component -<directiveName>');
                    process.exit();
                }
            });
        };
        
        module.exports = gulpGen;
    })();