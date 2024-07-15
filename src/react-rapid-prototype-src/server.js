require('dotenv').config();
var express = require('express'),
    app = express(),
    fs =  require('fs'),
    bodyParser = require('body-parser'),
    cors = require('cors');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({
    origin: /http:\/\/localhost:/, // Allow all localhost ports
  }));

// dynamically include routes (Controller)
fs.readdirSync(__dirname + '/server/controllers').forEach(function (file) {
    if (file.substring(file.length - 3) === '.js') {
        var fc = file.replace('.js', '');
        app.use('/'+fc, require(__dirname + '/server/controllers/' + file));
    }
});

app.listen(process.env.SERVER_PORT, function() {
    console.log('Listening on port ' + process.env.SERVER_PORT);
});