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

module.exports = router;