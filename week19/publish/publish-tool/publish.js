const http = require('http');
const querystring = require('querystring');
const fs = require("fs");
const archiver = require("archiver")

// const postData = querystring.stringify({
//     "content": "hello world 1223"
// })

// let filename = "./test.jpg";
let packname = './package'

// fs.stat(filename, (err, stat) => {
const options = {
    host: 'localhost',
    port: 3000,
    method: "POST",
    path: "/?filename=" + "package.zip",
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Length': Buffer.byteLength(postData)
        "Content-Type": "application/octet-stream",
        // "Content-Length": stat.size,
        // "Content-Length": 0
    }
}
const req = http.request(options)

req.on("error", (e) => {
    console.error(e.message)
})
var archive = archiver('zip', {
    zlib: { level: 9 }
})


archive.pipe(req)
archive.directory(packname, false)
archive.finalize()



// archive.pipe(req)
// archive.on('end', () => {
//     req.end()
// })


// 上传图片
// let readStream = fs.createReadStream("./test.jpg");
// readStream.pipe(req);
// readStream.on("end", () => {
// req.end()
// })

// 模拟数据
// req.write(postData);
// req.end();


// })