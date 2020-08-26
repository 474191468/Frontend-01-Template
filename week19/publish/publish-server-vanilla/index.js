const http = require('http')
const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')

const server = http.createServer((req, res) => {
      
    // let matched = req.url.match(/filename=([^&]+)/)
    // let filename = matched && matched[1]
    // if (!filename) return

    // const filepath = path.resolve(__dirname, '../server/public', filename)
    // const writeStream = fs.createWriteStream(filepath)
    let writeStream = unzipper.Extract({ path: path.resolve(__dirname, '../server/public')})

    req.pipe(writeStream)
    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('okay')
    })

})

server.listen(3000)