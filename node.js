const url = require('url');
const http = require('http');
const crypto = require('crypto');

const webhookSecret = '463edba8b57b37eebce1364b2d22fab8a4e4b60a8aa247db';

const app = http.createServer((request, response) => {
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        const gotSig = Buffer.from(request.headers['x-kernel-sig-sha256'], 'hex');
        const expectedSig = crypto.createHmac("sha256", webhookSecret).update(body).digest();
        const ok = crypto.timingSafeEqual(gotSig, expectedSig);
        if(!ok) {
            response.writeHead(400);
            response.write('bad sig');
            response.end();
            return;
        }

        const event = JSON.parse(body.toString());
        console.log('Got event!');
        console.log(event);

        response.writeHead(200);
        response.write('cool');
        response.end();
    });
});

app.listen(8088);
