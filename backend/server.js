const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const CacheSingleton = require('./utility/cache/redis-cache-singleton');
const MongodbSingleton = require('./utility/database/mongodb-singleton');
const AccountVerificationHandler = require('./api/account-authentication');
const vl = require('./api/req-body-validator');
const app = express();
const port = 3000;

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.send('Hello World!')
});

app.post('/api/unranked/stats', async function(req, res) {
    console.log("Receiving names: ", req.body.names);

    if (!vl.validateJSON(req.body)) {res.send({statusCode: 400, message: "Missing names array or is empty."})}
    else {
        var accounts = req.body.names;
        var accountVerification = new AccountVerificationHandler(accounts);
        const obj = await accountVerification.verifyAccounts();
        const response = {
            validAccounts: obj.validAccounts,
            invalidAccounts: obj.invalidAccounts
        }
    
        res.send(response);
    }
});

app.post('/api/ranked/stats', function(req, res) {
    res.send("ranked stats!");
});

app.listen(port, function() {
    console.log(`Listening on port ${port}!`)
});

(async () => {

    var cache = CacheSingleton.getInstance();
    cache.on('error', (err) => console.log('Redis Client Error', err));
    try {
        await cache.connect();
        var mongodb = MongodbSingleton.getInstance();
        await mongodb.connect();

    } catch (error) {
        console.log("Error: ", error);
    }
})();