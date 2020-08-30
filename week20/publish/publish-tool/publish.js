const http = require('http');
const querystring = require('querystring');
const fs = require("fs");
const archiver = require("archiver")
const child_process = require("child_process");

let packname = './package'

const redirect_uri = encodeURIComponent('http://localhost:8081/auth');
child_process.exec(`open  https://github.com/login/oauth/authorize?client_id=Iv1.1e339efb99ad07ca&redirect_uri=${redirect_uri}&state=abc123`);
const server = http.createServer((request, res) => {
    console.log("real publish")
    let token = request.url.match(/token=([^&]+)/)[1];
    const options = {
        host: 'localhost',
        port: 8081,
        method: "POST",
        path: "/?filename=" + "package.zip",
        headers: {
            'token': token,
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Length': Buffer.byteLength(postData)
            "Content-Type": "application/octet-stream",
            // "Content-Length": stat.size,
            // "Content-Length": 0
        }
    }
    var archive = archiver('zip', {
        zlib: { level: 9 }
    })

    archive.directory(packname, false)
    archive.finalize()
    const req = http.request(options)

    req.on("error", (e) => {
        console.error(e.message)
    })

    archive.pipe(req)


    archive.on('end', () => {
        req.end();
        console.log("publish success")
        res.end("success");
        server.close()

    })
})
server.listen(8080);