const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const auth = require('./apis/authentication.controller');
const parcel = require('./apis/parcel.controller');

const secretKey = 'parceltrackersecretkey';
const mongoConnURL = 'mongodb://localhost:27017/Parceltracker';
const mongoOptions = { useNewUrlParser: true };


process.on('uncaughtException', function(err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

mongoose.connect(mongoConnURL, mongoOptions).then(() => {

    console.log('Connected to mongoDB...')
    const app = express();

    app.set('port', process.env.PORT || 5002);
    app.set('secretKey', secretKey);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.post('/authenticate', auth.authenticateUser);
    app.get('/getDeliveryDetailsAdmin', parcel.getDeliveryDetailsAdmin);
    app.get('/getParcelDetailsUser', parcel.getParcelDetailsUser);
    app.post('/setDeliveryStatus', parcel.changeDeliveryStatus);

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });

    // module.exports = app;

}).catch(err => {
    console.error('App starting error:', err.stack);
    process.exit(1);
});