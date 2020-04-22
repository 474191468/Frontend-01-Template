# 在极客时间前端训练营的学习

## 启动文档
docsify serve docs

## week01  
### homework:
1. 在重学 | 构建知识体系这节课上，老师所列的知识体系的脑图，自己根据老师所教授的追溯法，并通过理解将其补充完整，形成自己的知识体系。
2. 产出面向对象文章
   
> 脑图地址：链接:https://pan.baidu.com/s/1BadQp6z7O8NSAW8THRxETw  密码:98tm  
> 文章地址：https://www.yuque.com/longlong-enq2g/kydme9/dy8cum

## week02
> 本周笔记：https://z-longlong.github.io/Frontend-01-Template/#/week02/index.md
### homework:
1. 写一个正则表达式 匹配所有 Number 直接量
2. 写一个 UTF-8 Encoding 的函数
3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
   
### answer
1. number直接量包括整数，浮点数，二进制数，八进制数，十六进制数
```js
// 整数
let integer = /^-?[0-9]+$/;  
// 浮点数
let floatPointNumber = /^[+-]?[0-9]*\.[0-9]*$/; 
// 二进制 0b
let binaryNumber = /^0b[01]+$/;
// 八进制 0o
let  octalNumber = /^0o[0-7]+$/;
// 十六进制 0x
let hexadecimalNumber = /^0x[0-9][a-f][A-F]+$/;
let result = /^-?[0-9]+$|^[+-]?[0-9]*\.[0-9]*$|^0b[01]+$|^0o[0-7]+$|^0x[0-9][a-f][A-F]+$/;
```
2. 写一个 UTF-8 Encoding 的函数
```js
// 网上抄的，并不了解位运算符 与函数中的 192 31 128等的比较是怎么来的 
let writeUTF = function (str, isGetBytes) {
      let back = [];
      let byteSize = 0;
      for (v i = 0; i < str.length; i++) {
          let code = str.charCodeAt(i);
          if (0x00 <= code && code <= 0x7f) {
                byteSize += 1;
                back.push(code);
          } else if (0x80 <= code && code <= 0x7ff) {
                byteSize += 2;
                back.push((192 | (31 & (code >> 6))));
                back.push((128 | (63 & code)))
          } else if ((0x800 <= code && code <= 0xd7ff) 
                  || (0xe000 <= code && code <= 0xffff)) {
                byteSize += 3;
                back.push((224 | (15 & (code >> 12))));
                back.push((128 | (63 & (code >> 6))));
                back.push((128 | (63 & code)))
          }
       }
       for (i = 0; i < back.length; i++) {
            back[i] &= 0xff;
       }
       if (isGetBytes) {
            return back
       }
       if (byteSize <= 0xff) {
            return [0, byteSize].concat(back);
       } else {
            return [byteSize >> 8, byteSize & 0xff].concat(back);
        }
}
```
3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
```js
// Unicode特殊字符 [\u0021-\u007E]{6,16}
// ASCII特殊字符 [\x21-\x7E]{6,16}
// 基本汉字+基本汉字补充 [\u4E00-\u9FEF]
let result = /[\u0021-\u007E]{6,16}|[\x21-\x7E]{6,16}|[A-z]|[\u4E00-\u9FEF]/;
```

