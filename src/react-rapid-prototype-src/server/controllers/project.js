var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('', function(req, res) {
    res.contentType('application/json');

    if (!process.env.PATH_TO_PROJECT) {
        res.status(500);
        res.end('{"message":"Missing environment variable PATH_TO_PROJECT"}');
        return;
    }

    fs.readFile('src/' + process.env.PATH_TO_PROJECT, function (err, content) {
        if (err) {
            res.status(500);
            res.end(JSON.stringify({
                message: "Missing project file",
                pathToProject: process.env.PATH_TO_PROJECT
            }));
            return;
        }

        res.end(content);
    });
});

router.post('', function(req, res) {
    res.contentType('application/json');

    if (!process.env.PATH_TO_PROJECT) {
        res.status(500);
        res.end('{"message":"Missing environment variable PATH_TO_PROJECT"}');
        return;
    }

    if (!req.body.project) {
        res.status(500);
        res.end('{"message":"Missing project data"}');
        return;
    }

    fs.writeFile('src/' + process.env.PATH_TO_PROJECT, JSON.stringify(req.body.project), function (err) {
        if (err) {
            res.status(500);
            res.end('{"message":"Error saving project file"}');
            return;
        }

        res.json({
            status: "OK",
            message: "Project saved successfully"
        });
    });
});

router.get('/files', function(req, res) {
    function componentNameFromRoute(strRoute) {
        let componentName = strRoute
            .replace('/', '').replace(/:/g, '')
            .split('/').map((part) => part.substring(0,1).toUpperCase() + part.substring(1).toLowerCase())
            .join('');
        if (!componentName.length) {
            componentName = 'Home';
        }
        componentName += 'Page';
    
        return componentName;
    }
    
    function componentNameFromRouteProps(routeProps) {
        if (routeProps.hasOwnProperty('filename') && routeProps.filename.length > 0) {
            return routeProps.filename;
        }
        const {route} = routeProps;
        return componentNameFromRoute(route);
    }

    function formNameFromFormProps(formProps, currentFormIndex) {
        return formProps.hasOwnProperty('filename') ? formProps.filename : `Form${currentFormIndex+1}`;
    }

    res.contentType('application/json');

    if (!process.env.PATH_TO_PROJECT) {
        res.status(500);
        res.end('{"message":"Missing environment variable PATH_TO_PROJECT"}');
        return;
    }

    fs.readFile('src/' + process.env.PATH_TO_PROJECT, function (err, content) {
        if (err) {
            res.status(500);
            res.end(JSON.stringify({
                message: "Missing project file",
                pathToProject: process.env.PATH_TO_PROJECT
            }));
            return;
        }

        const project = JSON.parse(content);
        const files = project.routes.map((routeProps) => {
            const folder = componentNameFromRouteProps(routeProps);
            return {
                folder: `pages/${folder}`,
                files: [
                    {name: 'index.jsx', exists: fs.existsSync(`src/pages/${folder}/index.jsx`)},
                    ...routeProps.forms.map((formProps, idx) => {
                        const formName = `${formNameFromFormProps(formProps, idx)}.jsx`;
                        return {name: formName, exists: fs.existsSync(`src/${folder}/${formName}`)}
                    })
                ]
            }
        });

        files.push({
            folder: 'template',
            files: [
                {name: 'index.jsx', exists: fs.existsSync('src/template/index.jsx')}
            ]
        });

        files.push({
            folder: '',
            files: [
                {name: 'App.jsx', exists: fs.existsSync('src/App.jsx')},
                {name: 'index.js', exists: fs.existsSync('src/index.js')}
            ]
        })
        
        res.end(JSON.stringify(files));
    });
});

module.exports = router;