var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('', function(req, res) {
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

module.exports = router;