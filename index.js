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
        var concat = require('gulp-concat');
        var rename = require('gulp-rename');
        var htmlmin = require('gulp-htmlmin');
        var uglify =  require('gulp-uglify');
        var injectStr = require('gulp-inject-string');
        var replace = require('gulp-replace');
        var browserSync = require('browser-sync').create();
    
        //globals
        var name;
    
        var tasksData = {};
        var AppResources = {};
    

        var tplbower = __dirname + '/angular-tpls/bower.json';
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
                    nUserDir += '/';
                }
                // console.log(nUserDir);
                // process.exit();
                nDirectory = nDirectory + nUserDir;
            }
    
            return {appAbsoluteFolder: nDirectory || './', appFolder: nUserDir || './' };
        }
    
        function generateAppConfigFile (appDirectory, reset) {
            
            var directory = getDirectories(appDirectory);
            var locationBower =  directory.appAbsoluteFolder + 'bower.json';
            var locationAppJson =  directory.appAbsoluteFolder + 'app.json';
            var locationInstructions = directory.appAbsoluteFolder + 'instructions.md';
    
            var cond1 = fs.existsSync(locationAppJson);
            if(!cond1 || reset){
                var cond2 = fs.existsSync(locationBower);

                var instructions = fs.readFileSync(tplInstructions, { encoding: 'utf8' });
                
                var bower = fs.readFileSync(tplbower, { encoding: 'utf8' });
                    bower = JSON.parse(bower);
                var appJson = fs.readFileSync(tplAppJson, { encoding: 'utf8' });
                    appJson = JSON.parse(appJson);

                    //Adding settings for app.json file 
                    bower.name = appJson.appName;
                    //Adding settings for app.json file 
                    appJson.appFolder = appDirectory || './';
                    appJson.mainFolders.styles = directory.appFolder + appJson.mainFolders.styles;
                    appJson.mainFolders.scripts = directory.appFolder + appJson.mainFolders.scripts;
                    appJson.mainFolders.images = directory.appFolder + appJson.mainFolders.images;
                //create initial files 
                if(!cond2){
                    fs.writeFileSync(locationBower, JSON.stringify(bower, null, 4));
                }
                fs.writeFileSync(locationAppJson, JSON.stringify(appJson, null, 4));
                fs.writeFileSync(locationInstructions, instructions);
            }
            
            // AppResources = JSON.parse(fs.readFileSync(locationAppJson, { encoding: 'utf8' }));
            AppResources = require(locationAppJson);
            AppResources.defaultFolders = [
                AppResources.appConfigFolder || '_appconfig',
                AppResources.commonFolderName || 'common',
                AppResources.mainAppModuleName + '.js' || 'app.js'
            ];
            
            
        }
    
        /**
         * This function initialize the new default tasks to generate modules and sample code
         * @param {Object} appDirectory: application directory where the code should bue generated
         * @param {Object} reset: TRUE if is necessary to regenerate the app.json file, default UNDEFINED or FALSE
         */
        var gulpGen = function (appDirectory) {
    
            generateAppConfigFile(appDirectory);
            //createInjectSections();

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
                        AppResources['angular-template'] + (AppResources.mainAppModuleName || AppResources.appName) + '.js',
                    ];
                    
                    var siteFiles = {
                        index: AppResources['angular-template'] + 'index.html',
                        images: AppResources['angular-template'] + 'README-images.md',
                        styles: AppResources['angular-template'] + 'README-styles.md',
                        scripts: AppResources['angular-template'] + 'README-scripts.md',
                    };

                    var appFolder = AppResources.appName + '/';
                    var isDir = fs.existsSync(AppResources.appFolder + appFolder);
                    
                    if (!isDir) {
    
                        console.log(gulpGenPrefix + 'Creating angular app folder...');
    
                        gulp.src(appFiles)
                            .pipe(ejs({ mainModule: name }, { ext: '.js' }))
                            .pipe(rename({ dirname: appFolder }))
                            .pipe(gulp.dest(AppResources.appFolder));

                        gulp.src(siteFiles.index).pipe(gulp.dest(AppResources.appFolder));
                        gulp.src(siteFiles.images).pipe(gulp.dest(AppResources.appFolder + '/images/'));
                        gulp.src(siteFiles.styles).pipe(gulp.dest(AppResources.appFolder + '/styles/'));
                        gulp.src(siteFiles.scripts).pipe(gulp.dest(AppResources.appFolder + '/scripts/'));

                        console.log(gulpGenPrefix + 'Angular app folder ready!.');
                    } else {
                        console.warn( gulpGenPrefix + 'The folder ' + AppResources.appName + ' all ready exists.');
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
                var configFolder = AppResources.appName + '/' + AppResources.appConfigFolder + '/';
                var isDir = fs.existsSync(AppResources.appFolder + configFolder);
    
                if (!isDir) {
                    console.log(gulpGenPrefix + 'Creating configuartion folder for angular ' + AppResources.appName + ' app...');
                    gulp.src(configFiles)
                        .pipe(ejs({ mainModule: name, AppResources: AppResources }, { ext: '.js' }))
                        .pipe(rename({ dirname: configFolder }))
                        .pipe(gulp.dest(AppResources.appFolder));
                    console.log(gulpGenPrefix + 'The configuartion folder it\'s ready!.');
                } else {
                    console.warn(gulpGenPrefix + 'The folder ' + AppResources.appConfigFolder + '/ all ready exists.');
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
                        var mainFileModule = AppResources.appFolder + AppResources.appName + '/' + (AppResources.mainAppFileName || AppResources.mainAppModuleName + '.js');
                        // console.log(mainFileModule);
                        // process.exit();
                        if(fs.existsSync(mainFileModule)){    
                            var fileModule = fs.readFileSync(mainFileModule, 'utf8');
                            var mainModule = fileModule.toString().match(/module\('(.*)'/)[1];
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
                                               gulp.start('gen:inject');
                                               gulp.start('gen:inject:route');
                                           }, 2000);
        
                                console.log(gulpGenPrefix + 'The ' + originalName + '/ folder it\'s ready!.');
                            } else {
                                console.warn(gulpGenPrefix + 'It is not posible create the module ' + originalName + '/');
                                console.warn(gulpGenPrefix + 'Please, Make sure that the ' + AppResources.appName + ' folder it\'s  all ready created.');
                                console.warn(gulpGenPrefix + 'Also, Make sure that the ' + originalName + '/ module folder was not created yet.');
                            }
                            if (!hasModule) {
                                console.log(gulpGenPrefix + 'Injecting the module name in' + mainFileModule + ' main file...');
                                
                                var hasNotColen = /[\"\']([\r\n\s]+)\/\*@endCustomModule/g.test(fileModule.toString());

                                var moduleRegex = (hasNotColen) ? /[\"\']([\r\n\s]+)\/\*@endCustomModule/g : /[\"\'],([\r\n\s]+)\/\*@endCustomModule/g ;

                                task = gulp.src(mainFileModule)
                                    .pipe(replace(moduleRegex, '\',$1\'' + moduleName + '$&'))
                                    .pipe(gulp.dest(AppResources.appFolder + AppResources.appName + '/'));
    
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
    
                    var mainModule = fs.readFileSync(AppResources.appFolder + AppResources.appName + '/' + AppResources.mainAppModuleName + 'js', 'utf8').match(/module\('(.*)'/)[1];
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
                            gulp.start('gen:inject');
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

            gulp.task('gen:inject', ['gen:inject:generals'], function(){

                //Default properties
                AppResources.ignoreModuleInject = AppResources.ignoreModuleInject || [];
                //
                var ignoreInjects = [];
                var resources = AppResources.common_bower.scripts || [];
                var resourcesCss = AppResources.common_bower.styles || [];
                var cssFolder = AppResources.mainFolders.styles || [];
                var scripts = AppResources.mainFolders.scripts || [];

                var customScripts = AppResources.custom_scripts || [];
                var customStyles = AppResources.custom_styles || [];
                
                var injectsThird = AppResources.injectThirdApp || [];
                var injectCss = [];
                var injectSass = [];
                var injectsLibs = [];
                var injectScripts = [];
                var injectsApp = AppResources.appFolder + AppResources.appName + '/' + (AppResources.appMainModuleName || AppResources.appName ) + '.js';
                var injectsCommon = AppResources.appFolder + AppResources.appName + '/' + AppResources.commonFolderName + '/*.js';
                var injectsComponents = AppResources.appFolder + AppResources.appName + '/' + AppResources.commonFolderName + '/**/*.directive.js';
                var injectsModule = [
                    AppResources.appFolder + AppResources.appName + '/' + AppResources.appConfigFolder + '/*.js',
                    AppResources.appFolder + AppResources.appName + '/**/*.module.js',
                    AppResources.appFolder + AppResources.appName + '/**/*.routes.js'
                ];
                var injectsFactory = AppResources.appFolder + AppResources.appName + '/**/*.factory.js';
                var injectsControllers = AppResources.appFolder + AppResources.appName + '/**/*.controller.js';   
                
                //if a ignore path is set into app.json "ignoreModuleInject" property.
                if (AppResources.ignoreModuleInject && AppResources.ignoreModuleInject.length > 0) {
                    injectsApp = [injectsApp];
                    injectsCommon = [injectsCommon];
                    injectsComponents = [injectsComponents];
                    injectsFactory = [injectsFactory];
                    injectsControllers = [injectsControllers];

                    for (var i = 0; i < AppResources.ignoreModuleInject.length; i++) {

                        var isNotModule = /\..*$/i.test(AppResources.ignoreModuleInject[i]);
                        //var endPath = (isNotModule) ? '' : '/*';
                        var ignore = '!' + AppResources.appFolder + AppResources.appName + '/' + AppResources.ignoreModuleInject[i];

                        injectsApp.push(ignore);
                        injectsCommon.push(ignore);
                        injectsComponents.push(ignore);
                        injectsFactory.push(ignore);
                        injectsControllers.push(ignore);//--
                        injectsModule.push(ignore);
                        injectScripts.push(ignore);
                        injectsLibs.push(ignore);
                        if(injectsThird.length > 0){
                            injectsThird.push(ignore);
                        }
                    }
                }
                
                injectScripts.push(scripts + '*.js');
                injectScripts = injectScripts.concat(customScripts);
                
                resourcesCss.forEach(function(item){
                    var fileRoute = cssFolder +'libs/' + item;
                    var isSetRouteCss = injectCss.indexOf(fileRoute);
                    var isSetRouteSass = injectSass.indexOf(fileRoute);
                    var ext = fileRoute.split('.').pop();
                    
                    if(ext.search(/sass|scss|less/g) >= 0){
                        if(isSetRouteSass >= 0){
                            injectSass.splice(isSetRouteSass,1);
                        }
                        injectSass.push(fileRoute);
                    }else{
                        if(isSetRouteCss >= 0){
                            injectCss.splice(isSetRouteCss,1);
                        }
                        injectCss.push(fileRoute);
                    }
                });
                
                customStyles.forEach(function(item){
                    var fileRoute = item;
                    var isSetRouteCss = injectCss.indexOf(fileRoute);
                    var isSetRouteSass = injectSass.indexOf(fileRoute);
                    var ext = fileRoute.split('.').pop();
                    
                    if(ext.search(/sass|scss|less/g) >= 0){
                        if(isSetRouteSass >= 0){
                            injectSass.splice(isSetRouteSass,1);
                        }
                        injectSass.push(fileRoute);
                    }else{
                        if(isSetRouteCss >= 0){
                            injectCss.splice(isSetRouteCss,1);
                        }
                        injectCss.push(fileRoute);
                    }
                });
                //inject default css
                injectCss.push(cssFolder + '*.css');
                injectCss = injectCss.concat(customStyles);
                
                
                //inject  default pre-compilers
                injectSass.push(cssFolder + '*.sass');
                injectSass.push(cssFolder + '*.scss');
                injectSass.push(cssFolder + '*.less');
                
                resources.forEach(function(item){
                    scripts = scripts.replace(AppResources.appFolder, '');
                    
                    injectsLibs.push( AppResources.appFolder + scripts + 'libs/' + item);
                });
                // console.log(injectsThird);
                // process.exit();
                gulp.src(AppResources.appFolder + '/index.html')
                    .pipe(inject(
                        gulp.src(injectsLibs, {read:false}), 
                        {relative: true}
                    ))
                    .pipe(inject(
                        gulp.src(injectCss, {read:false}), 
                        {relative: true}
                    ))
                    .pipe(inject(
                        gulp.src(injectsThird, { read: false }),
                        { starttag: '<!--inject:thirdApp:{{ext}}-->', relative: true, empty: true }
                    ))
                    .pipe(inject(
                        gulp.src(injectScripts, {read:false}), 
                        {starttag: '<!--inject:custom:{{ext}}-->',relative:true}
                    ))
                    .pipe(inject(
                        gulp.src(injectSass, {read:false}),
                        {   starttag:'<!--inject:sass-->',
                            endtag:'<!--endinject-->',
                            transform: function (filepath) {
                                return '<link rel="stylesheet" href="'+filepath+'">';
                            },
                            relative:true
                        }
                    ))
                    .pipe(inject(
                        gulp.src(injectsApp, {read:false}),
                        {starttag: '<!--inject:app:{{ext}}-->', relative:true}
                    ))
                    .pipe(inject(
                        gulp.src(injectsCommon, {read:false}),
                        {starttag: '<!--inject:common:{{ext}}-->', relative:true}
                    ))
                    .pipe(inject(
                        gulp.src(injectsComponents, {read:false}),
                        {starttag: '<!--inject:components:{{ext}}-->', relative:true}
                    ))
                    .pipe(inject(
                        gulp.src(injectsModule, {read:false}),
                        {starttag: '<!--inject:module:{{ext}}-->', relative:true}
                    ))
                    .pipe(inject(
                        gulp.src(injectsFactory, {read:false}),
                        {starttag: '<!--inject:factory:{{ext}}-->', relative:true}
                    ))
                    .pipe(inject(
                        gulp.src(injectsControllers, {read:false}),
                        {starttag: '<!--inject:controller:{{ext}}-->', relative:true}
                    ))
                    .pipe(gulp.dest(AppResources.appFolder));
            });

            gulp.task('gen:inject:route', function () {
                if (tasksData.viewName) {
                    var routesFolder = AppResources.appFolder + AppResources.appName + '/' + AppResources.appConfigFolder + '/';
                    var routesFile = 'routes.config.js';
                    var routesConfig = routesFolder + routesFile;
                    var routesContent = fs.readFileSync(routesConfig);
                    
                    var isRoutes = /\'SITE_ROUTES\'/i.test(routesContent);
                    var isInitial = /[\/\/].*([\r\n\s]+)\/\*@endRoutes/i.test(routesContent);
                    var routesHasNotColen = /[\"\']([\r\n\s]+)\/\*@endRoutes/g.test(routesContent.toString());
                    var urlHasNotColen = /[\"\']([\r\n\s]+)\/\*@endUrls/g.test(routesContent.toString());
                    
                    
                    if (isRoutes) {
                        //TODO: Probar tarea de injeccion de route
                        var hasRoute = (new RegExp('\\b' + tasksData.viewName + '\\b', 'ig')).test(routesContent.toString());
                        
     
                        if (!hasRoute) {
                            //please doesn't clean the whitespaces that is needed for indention
                            console.log(isInitial+'\n');
                            if(isInitial){
                                var task = gulp.src(routesConfig)
                                    .pipe(replace(/(.*[^])(\/\*@endRoutes\*\/)/g, '$1'+tasksData.viewName+': \''+tasksData.viewName+'\',\n$1$2'))
                                    .pipe(replace(/(.*[^])(\/\*@endUrls\*\/)/g, '$1'+tasksData.viewName+': \'/'+tasksData.viewName+'\',\n$1$2'))
                                    .pipe(gulp.dest(routesFolder));
                                    tasksData = {};
                                return task;
                            }else{
                                var routeRegex = (routesHasNotColen)? /[\"\']([\r\n\s]+)\/\*@endRoutes/g : /[\"\'],([\r\n\s]+)\/\*@endRoutes/g;
                                var urlRegex = (urlHasNotColen)? /[\"\']([\r\n\s]+)\/\*@endUrls/g : /[\"\'],([\r\n\s]+)\/\*@endUrls/g;
                                
                                
                                var task = gulp.src(routesConfig)
                                    .pipe(replace(routeRegex, '\',$1' + tasksData.viewName + ': \'' + tasksData.viewName + '$&'))
                                    .pipe(replace(urlRegex, '\',$1' + tasksData.viewName + ': \'/' + tasksData.viewName + '$&'))
                                    .pipe(gulp.dest(routesFolder));
                                    tasksData = {};
                                return task;
                            }
                        } else {
                            console.info(gulpGenPrefix + 'The route "' + tasksData.viewName + '" has been already created');
                        }
                    } else {
                        console.info(gulpGenPrefix + 'The could not find the ".routes.js" file in "' + AppResources.appConfigFolder + '" folder');
                    }
                }
            });

            gulp.task('gen:inject:generals', function () {
                
                var styles = [],
                    scripts = [],
                    bower = AppResources.appFolder + '/bower_components/',
                    style_libs = AppResources.common_bower.styles,
                    scripts_libs = AppResources.common_bower.scripts,
                    ignore = AppResources.common_bower.ignore;
                
                
                var copyToApplication = {
                    styles:  AppResources.mainFolders.styles + 'libs/',
                    scripts: AppResources.mainFolders.scripts + 'libs/',              
                };
                
                style_libs.forEach(function(item){
                    styles.push(bower + '**/' + item);
                });
                scripts_libs.forEach(function(item){
                    scripts.push(bower + '**/' + item);
                });
                if(ignore && ignore.length > 0){
                    ignore.forEach(function(item) {
                        scripts.push('!'+ bower + '**/' + item);   
                    });
                }
                
                // console.log(bower, copyToApplication);
                // process.exit();

                gulp.src(styles)
                    .pipe(rename({dirname: ''}))
                    .pipe(gulp.dest(copyToApplication.styles));
                
                gulp.src(scripts)
                    .pipe(rename({dirname: ''}))
                    .pipe(gulp.dest(copyToApplication.scripts));
            });

            gulp.task('gen:server', function () {
                return gulp.start('gen:' + AppResources.appName + ':server-reload');
            });
            
            gulp.task('gen:build', function () {
                return gulp.start('gen:' + AppResources.appName + ':build');
            });
            
            gulp.task('gen:' + AppResources.appName + ':server-reload', function () {
                var reloadWhenChange = AppResources.reloadWhenChange;
                var browserConfig = {
                    server: "./",
                    index: 'index.html'
                };
                var cond = AppResources.serverPort && !isNaN(AppResources.serverPort);
                if(cond){
                    browserConfig.port = AppResources.serverPort;
                }
            
                browserSync.init(browserConfig);
                gulp.watch(reloadWhenChange).on('change', browserSync.reload);
            });

            gulp.task('gen:' + AppResources.appName + ':publish', function () {
                var task;
                var enviroments = AppResources.enviroments;
                var argEnviroment = process.argv.pop().replace(/-/g, '');
                    argEnviroment = (!enviroments[argEnviroment]) ? 'local' : argEnviroment;
            
                if (enviroments[argEnviroment]) {
            
                    var destConfigApp = AppResources.appFolder + AppResources.appName + '/' + (AppResources.appConfigFolder || '_app.config' )+ '/';
                    var configApp = [AppResources.configFile || destConfigApp + 'resources.config.js'];
                    var esArchivoApp = fs.existsSync(configApp[0]);
                    
                    if( AppResources.thirdConfigFile && AppResources.thirdConfigFile.length > 0 ){
                        configApp.push.apply(configApp, AppResources.thirdConfigFile);
                    }
                    if (esArchivoApp) {
                        task = gulp.src(configApp);
                        
                        for(var i in enviroments[argEnviroment]){
                            var itemValue = enviroments[argEnviroment][i];
                            var regex = new RegExp(i +"(\s+)?:.+", 'i');
                            
                            task.pipe(replace(regex, i.toLocaleUpperCase() +': "' + itemValue + '",'));
                        }
                        
                        task.pipe(gulp.dest(function(file){
                            return file.base;
                        }));
                        
                    } else {
                        console.info(gulpGenPrefix + 'No se pudo encontrar el archivo ' + configApp);
                    }
                    return task;
                }
            });

            gulp.task('gen:' + AppResources.appName + ':build', ['gen:' + AppResources.appName + ':publish'], function () {
                var commentsRegexp = /<!--Uncomment Dist-->([\s\S]*?)<!--([\s\S]*?)-->([\s\S]*?)<!--End:Uncomment Dist-->/g;
                var removeRegex = /<!--Remove Dist-->([\s\S]*?)<!--End:Remove Dist-->/g;
                var versionRegex = '{{version}}';
                var thirdFiles = AppResources.thirdConfigFile;
            
                //var appAll = [AppResources.appFolder + AppResources.buildFolder + 'app/' + config.appdest];
            
                var others = AppResources.injectThirdApp;
                    others.concat([
                        AppResources.appFolder + AppResources.appName + '/**/*.json',
                        AppResources.appFolder + AppResources.appName + '/**/**/*.json',
                        AppResources.appFolder + AppResources.appName + '/**/**/**/*.json'
                    ]);
                    
                var appfiles = [
                    AppResources.appFolder + AppResources.appName + '/**/resources.config.js',
                    AppResources.appFolder + AppResources.appName + '/**/*.config.js',
                    AppResources.appFolder + AppResources.appName + '/common/*.js',
                    AppResources.appFolder + AppResources.appName + '/**/*.directive.js',
                    AppResources.appFolder + AppResources.appName + '/**/*.module.js',
                    AppResources.appFolder + AppResources.appName + '/**/*.routes.js',
                    AppResources.appFolder + AppResources.appName + '/**/*.controller.js',
                    AppResources.appFolder + AppResources.appName + '/**/**/*.factory.js',
                    AppResources.appFolder + AppResources.appName + '/**/**/*.controller.js',
                    AppResources.appFolder + AppResources.appName + '/app.js'
                ];
                var appViews = [
                    AppResources.appFolder + AppResources.appName + '/**/*.html',
                ];
            
                var sources = others.concat(appfiles);
                //optimizing js files
                var task = gulp.src(sources);
                    task.pipe(concat('app.js'))
                        .pipe(uglify()).on('error', function (e) { console.log(e); })
                        .pipe(gulp.dest(AppResources.buildFolder + 'app/'));

                    //injecting resources optimized
                        task = gulp.src(AppResources.buildFolder + 'index.html');
                        task.pipe(injectStr.replace(removeRegex, ''))
                            .pipe(injectStr.replace(commentsRegexp, '$2'))
                            .pipe(injectStr.replace(versionRegex, Date.parse(new Date())))
                            .pipe(gulp.dest(AppResources.buildFolder));

                    //optimizing html files    
                        task = gulp.src(appViews);
                        task.pipe(htmlmin());
                        task.pipe(gulp.dest(function (file) {
                            var buildPath = file.base.replace(AppResources.appName, AppResources.buildFolder + 'app/');
                            buildPath = buildPath.replace('_directivas', AppResources.buildFolder + 'app/directivas');
                            buildPath = buildPath.replace(/\//g, '\u005c');
                
                            return buildPath;
                        }));
            
                return task;
            });
            
        };
        
        module.exports = gulpGen;
    })();
