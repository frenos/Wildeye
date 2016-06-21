/**
 * Created by Rene on 17.06.16.
 */

var ftpClient = require('ftp-client'),
    config = {
        host: '192.168.42.1',
        port: 21,
        user: 'anonymous',
        password: 'anonymous@'
    },
    options = {
        logging: 'basic'
    },
    client = new ftpClient(config, options);


client.connect(function () {

    client.upload(['../mavlink/flightplan.mavlink'], '/internal_000/flightplans', {
        baseDir: '../mavlink',
        overwrite: 'all'
    }, function (result) {
        console.log(result);
    });

});