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
> 本周笔记：
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

### 正则相关
语法：/正则表达式主体/修饰符(可选)  
-  修饰符
   -  i：不区分大小写
   -  g：执行全局匹配，而不是匹配一个后停止
   -  m：执行多行匹配
- 括号表达式
  - [^abc]查找任何不在括号集合的字符
  - [abc]查找方括号之间的任何字符
  - [0-9]查找任何从0至9的数字
  - (x|y)查找任何以|分割的选项
- 元字符
  - .   查找单个字符，除了换行和行结束符
  - \w	查找单词字符。
  - \W	查找非单词字符。
  - \d	查找数字。
  - \D	查找非数字字符。
  - \s	查找空白字符。
  - \S	查找非空白字符。
  - \b	匹配单词边界。
  - \B	匹配非单词边界。
  - \0	查找 NULL 字符。
  - \n	查找换行符。
  - \f	查找换页符。
  - \r	查找回车符。
  - \t	查找制表符。
  - \v	查找垂直制表符。
  - \xxx	查找以八进制数 xxx 规定的字符。
  - \xdd	查找以十六进制数 dd 规定的字符。
  - \uxxxx	查找以十六进制数 xxxx 规定的 Unicode 字符。
- 量词
  - n+ 匹配任何包含至少一个 n 的字符串。
  - n* 匹配任何包含零个或多个 n 的字符串。
  - n? 匹配任何包含零个或一个 n 的字符串。
  - n{X} 匹配包含 X 个 n 的序列的字符串。
  - n{X,}	X 是一个正整数。前面的模式 n 连续出现至少 X 次时匹配。
  - n{X,Y} X 和 Y 为正整数。前面的模式 n 连续出现至少 X 次，至多 Y 次时匹配。
  - n$	匹配任何结尾为 n 的字符串。
  - ^n	匹配任何开头为 n 的字符串。
  - ?=n	匹配任何其后紧接指定字符串 n 的字符串。
  - ?!n	匹配任何其后没有紧接指定字符串 n 的字符串。


### Unicode特殊符号编码 
范围：`[\u0021-\u007E]`对应ACSII范围`[\x21-\x7E]`
- U + 0020 空格
- U + 0021 ! 
- U + 0022 " 
- U + 0023 # 
- U + 0024 $ 
- U + 0025 % 
- U + 0026 & 
- U + 0027 ' 
- U + 0028 ( 
- U + 0029 ) 
- U + 002A *
- U + 002B + 
- U + 002C , 
- U + 002D - 
- U + 002E . 
- U + 002F / 
- U + 0030 0 
- U + 0031 1 
- ...
- U + 0039 9 
- U + 003A : 
- U + 003B ; 
- U + 003C < 
- U + 003D = 
- U + 003E > 
- U + 003F ? 
- U + 0040 @ 
- U + 0041 A
- ... 
- U + 005A Z 
- U + 005B [ 
- U + 005C \ 
- U + 005D ] 
- U + 005E ^ 
- U + 005F _ 
- U + 0060 ` 
- U + 0061 a
- ...
- U + 007A z
- U + 007B { 
- U + 007C | 
- U + 007D } 
- U + 007E ~ 

### Unicode汉字基本范围
- \u4E00-\u9FA5 基本汉字
- 9FA6-9FEF     基本汉字补充
- 3400-4DB5     扩展A	
- 20000-2A6D6   扩展B
- 2A700-2B734   扩展C
- 2B740-2B81D   扩展D
- 2B820-2CEA1   扩展E
- 2CEB0-2EBE0   扩展F
- 30000-3134A   扩展G
- 2F00-2FD5     康熙部首
- 2E80-2EF3     部首扩展
- F900-FAD9     兼容汉字
- 2F800-2FA1D   兼容扩展
- E815-E86F     PUA(GBK)部件
- E400-E5E8     部件扩展
- E600-E6CF     PUA增补
- 31C0-31E3     汉字笔画
- 2FF0-2FFB     汉字结构
- 3105-312F     汉语注音
- 31A0-31BA     注音扩展
- 3007          〇