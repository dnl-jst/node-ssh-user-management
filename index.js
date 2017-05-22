var fs = require('fs');
var path = require('path');
var trim = require('trim');
var chalk = require('chalk');
var nodemiral = require('nodemiral');

var SSH_PRIVATE_KEY = fs.readFileSync(process.env.HOME + '/.ssh/id_rsa', 'utf8');

var files = fs.readdirSync(path.resolve(__dirname, 'conf/'));

var config;
var user;
var username;
var sudo;
var keyPath;
var privateKey;

for (var i = 0; i < files.length; i++) {

    if (path.extname(files[i]) != '.json') {
        continue;
    }

    config = require(path.resolve(__dirname, 'conf/') + '/' + files[i]);

    for (var j = 0; j < config.users.length; j++) {

        user = config.users[j];
        username = user.name;
        sudo = user.sudo;

        keyPath = path.resolve(__dirname, 'keydir/') + '/' + username + '.key';

        if (!fs.existsSync(keyPath)) {
            console.log('[' + config.name + '] key for ' + username + ' not found, skipping');
            continue;
        }

        publicKey = fs.readFileSync(keyPath);

        (function(config, username, sudo, publicKey) {

            var session = nodemiral.session(config.address, {username: 'root', pem: SSH_PRIVATE_KEY});

            session.executeScript(path.resolve(__dirname, 'scripts/') + '/handle_user.sh', {username: username, sudo: sudo, publicKey: publicKey}, function(err, code, logs) {
                console.log('[' + config.name + '] user: ' + username + ', sudo: ' + sudo + ', output: ' + chalk.green(trim(logs.stdout)));
            });

        })(config, username, sudo, publicKey);

    }

}
