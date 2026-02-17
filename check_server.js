const http = require('http');
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 2000
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
});

req.on('timeout', () => {
    console.log('TIMEOUT');
    req.destroy();
});

req.end();
