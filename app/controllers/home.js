const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const TempHumidity = mongoose.model('TempHumidity')
const NetcatServer = require('node-netcat').server
var ncServer = NetcatServer(5000);

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  TempHumidity.find(function (err, measures) {
    if (err) return next(err);
    res.render('index', {
      title: 'Temperarue and humidity measurments',
      measures: measures
    })
  })
})

router.get('/add', function (req, res, next) {

  ncServer.on('ready', function() {
    console.log('server ready');
});

ncServer.on('data', function(client, data) {
    console.log('server rx: ' + data + ' from ' + client);
});

ncServer.on('client_on', function(client) {
    console.log('client on ', client);
});

ncServer.on('client_of', function(client) {
    console.log('client off ', client);
});

ncServer.on('error', function(err) {
    console.log(err);
});

ncServer.on('close', function() {
    console.log('server closed');
});

ncServer.listen(); // start to listening

  let tempHum = new TempHumidity({
    temp: '22',
    humidity: '67',
    time: '2016-09-04 23:31'
  })

  // tempHum.save(function(err, thor) {
  //   if (err) return console.error(err);
  //   console.dir(tempHum);
  // });
})