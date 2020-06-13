/***
 * @file 模仿浏览器发起请求
 * @description zyl
 */

const net = require('net');
const parser = require('./parser.js');


class Request {
    // methods url = host + port + path
    // body
    // headers
    constructor(options) {
        // 拆分URL
        this.method = options.methods || 'GET';
        this.host = options.host;
        this.port = options.port || 80;
        this.body = options.body || {};
        this.path = options.path || '/';
        this.headers = options.headers || {};
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            // 参数处理
            this.bodyText = Object.keys(this.body)
                .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
                .join('&');
        }
        // 计算length 避免bad Request
        this.headers['Content-Length'] = this.bodyText.length;
    }
    toString() {
        // 格式必须按照下方格式进行排列 否则会bad Request
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map((key) => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
    }


    send(connection) {
        return new Promise((reslove, reject) => {
            const parser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                        host: this.host,
                        port: this.port
                    },
                    () => {
                        connection.write(this.toString());
                    }
                );
            }
            connection.on('data', (data) => {
                // TCP是流式传输 不知数据有没有发完 所以需要解析数据转换成response
                // 后端返还数据包，保证其顺序正确，我们需要根据数据大小一部分一部分灌入解析过程
                // 随后根据数据大小比较来保证数据接受完全
                parser.receive(data.toString());
                // reslove(data.toString());
                if (parser.isFinished) {
                    reslove(parser.response);
                }
                connection.end();
            });
            // connection.on('end', () => {
            //     console.log('disconnected from server');
            // });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        });
    }
}

class Response {}

// HTTP/1.1 200 OK status line   

// Content-Type: text/html
// Connection: keep-alive     headers
// Transfer-Encoding: chunked

// name=zyl                  body
class ResponseParser {
    constructor() {
        this.WATING_STATUS_LINE = 0; // 等待解析状态栏
        this.WAITNG_STATUS_LINE_END = 1; // 解析状态栏尾部 /r/n
        this.WAITING_HEADER_NAME = 2; // 等待解析header name
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5; // 解析header尾部 /r/n
        this.WAITING_HEADER_BLOCK_END = 6; // 等待解析header 中的两个空格
        this.WAITING_BODY = 7;

        this.current = this.WATING_STATUS_LINE; //当前状态
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';

        this.bodyPaser = null;
    }
    get isFinished() {
        return this.bodyPaser && this.bodyPaser.isFinished;
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyPaser.content.join('')
        };
    }
    receive(string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char) {
        if (this.current === this.WATING_STATUS_LINE) {
            // status line 尾部
            if (char === '\r') {
                this.current = this.WAITNG_STATUS_LINE_END;
            }
            // 切换到header解析状态
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            } else {
                // 如不是以上两种状态 则拼接statusline
                this.statusLine += char;
            }
        } else if (this.current === this.WAITNG_STATUS_LINE_END) {
            if (char === '\n') {
                // 切换到header解析状态
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                // 解析到 ： 则说明要拼接在header value
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === '\r') {
                // 如果直接匹配到/r 则直接切换到body的解析
                this.current = this.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    // 根据Transfer-Encoding 去解析body
                    this.bodyPaser = new TrunkedBodyParser();
                }
            } else {
                // 如不是以上状态 则拼接header name
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerValue = '';
                this.headerName = '';
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            this.bodyPaser.receiveChar(char);
        }
    }
}
class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LEMGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;

        this.current = this.WAITING_LENGTH;
    }
    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITING_LEMGTH_LINE_END;
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_LEMGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if (this.current === this.READING_TRUNK) {
            this.content.push(char);
            this.length--;
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}

void(async function() {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: '8088',
        path: '/',
        headers: {
            ['X-Foo']: 'bar'
        },
        body: {
            name: 'zyl'
        }
    });

    let response = await request.send();
    let dom = parser.parseHTML(response.body);
    console.log(JSON.stringify(dom, null, "    "))
})();

// const client = net.createConnection({
//         host: '127.0.0.1',
//         port: 8088
//     },
//     () => {
//         console.log('connect to server');

// let request = new Request({
//     method: "POST",
//     host: "127.0.0.1",
//     port: "8088",
//     path: '/',
//     headers: {
//         ["X-Foo"]: "test"
//     },
//     body: {
//         name: 'zyl'
//     }
// })

// console.log(request.toString());
// client.write(request.toString());
// length 长度即参数长度 否则会bad request
//         client.write(`
// POST / HTTP/1.1\r
// Content-Type: application/x-www-form-urlencoded\r
// Content-Length: 8\r 
// \r
// name=zyl`);
//     }
// );
// client.on('data', (data) => {
//     console.log(data.toString());
//     client.end();
// });
// client.on('end', (data) => {
//     console.log('disconnected from server');
// client.end();
// });