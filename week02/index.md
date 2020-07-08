## day01 编程语言通识

### 语言按语法分类
- 非形式语言
  1.  中文
  2.  英文
- 形式语言（乔姆斯基谱系）
  1. 0型 无限制文法 ?::=?
  2. 1型 上下文相关文法 ?< A >?::=?< B >?
  3. 2型 上下文无关文法 < A >::=? JavaScript 大部分是2型
  4. 3型 正则文法 解析慢 < A >::=< A >?
### BNF 产生式去定义语言
> **定义**  
> 巴科斯范式(BNF)：以美国人巴科斯(Backus)和丹麦人诺尔(Naur)的名字命名的一种形式化的语法表示方法，用来描述语法的一种形式体系，是一种典型的元语言。  
> **符号含义如下：**  
> " 在双引号中的字代表字符本身。  
> A::=B 表示被定义为的意思。  
> [A] 方括号中包含的为可选项。  
> A|B 竖线表示其左右两边只能选一项。  
> A* 表示元素A可以有0次或多次出现。  
> A+ 表示元素A可以有1次或多次出现。  
> (A B) 元素A和B被组合在一起。  
**产生式**
在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（Backus-Naur Form，BNF）的语句

- 用尖括号扩起来的名称来表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的复合结构
  1. 基础结构称`终结符`
  2. 复合机构称`非终结符`
- 引号和中间的字表示终结符
- 可以用括号
- `*`表示重复多次
- `|`表示或
- `+`表示至少一次

> example  
```js
// 定义一个Number类型
<Number> ::= "0" | "1" | "2" | ...... | "9"  

// 定义一个十进制数
// 首位为0 或者(|) 1～0的任意值 后跟 可重复的(*) Number类型
<DecimalNumber> ::=  "0" | (("1" | "2" | ...... | "9") <Number>* )

// 带尖括号 尖括号优先
<PrimaryExpression> ::= <DecimalNumber> | 
    "(" <LogicalExpression> ")"

// 乘法
<MultiplicativeExpression> ::= <DecimalNumber> |  
    <MultiplicativeExpression> "*" <DecimalNumber> |  
    <MultiplicativeExpression> "/" <DecimalNumber>

// 加法表达式
// 首位可以是数字或者表达式
// <MultiplicativeExpression> 可表示 <DecimalNumber> || <MultiplicativeExpression>(此处可继续表示DecimalNumber) "*" <DecimalNumber>
<AdditiveExpression> ::= <MultiplicativeExpression> |  
    <AdditiveExpression> "*" <MultiplicativeExpression> |  
    <AdditiveExpression> "-" <MultiplicativeExpression>  

// 逻辑表达式
<LogicalExpression> ::= <AdditiveExpression> |  // 只有加法
    <LogicalExpression> "||" <AdditiveExpression> |  // 前面的本身表递归 支持连续运算
    <LogicalExpression> "&&" <AdditiveExpression> 
```

### 图灵完备性
- 命令式——图灵机
  - goto
  - if和while
- 声明式——lambda
  - 递归

### 动态与静态语言
- 动态
  - 在用户的设备/在线服务器上
  - 产品实际运行时
  - runtime
- 静态
  - 在程序员的设备上
  - 产品开发时
  - compiltime

### 类型系统
- 动态类型系统与静态类型系统
- 强类型(无隐式转换)与弱类型(有隐式转换)
  - string + number
  - string === boolean
- 复合类型
  - 结构体
  - 函数签名
- 子类型
  - 逆变/协变

## day 02 JavaScript 词法，类型
### 学习unicode网址
https://home.unicode.org/  
https://www.fileformat.info/info/unicode/  
`codePointAt`返回字符串中指定位置字符的Unicode码点值，与`charCodeAt`方法功能相同
> 二者区别：
> charCodeAt方法对于使用四个字节存储的字符无法返回正确的码点值，功能存在一定缺陷。  
> codePointAt弥补此缺陷，不但可以返回两个字节存储的字符的码点值，也可以返回四个字节存储字符的码点值。  
> 注：UTF-16中，十六位二进制位表示一个字符，码点范围介于U+0000到U+FFFF，用两个字节存储一个字符。  
> 但是随着时间的推移，字符不断增加，十六位编码空间无法容纳新增的字符，于是采用四个字节存储新增的字符。  
> charCodeAt是以码元为单位来处理的，也就是说按照每16位2进制数为单位。一个16位2进制数就是一位，所以处理不了Unicode扩展编码字符（32位2进制）。他会把32位2进制数当成两个16位2进制数处理  
> codePointAt也是以`码元`位单位来处理的。与charCodeAt不同的地方是，当处理到当前位码元时，如果超过了16位2进制数值的上线，他就明白这是一个32位2进制数(`码点`)，就会以32位2进制数当作一个来处理。  
```js
console.log("厉害".codePointAt(0).toString(16));// 5389
console.log("厉害".codePointAt(1).toString(16));// 5bb3

let \u5389\u5bb3 = 1;
console.log(厉害); // 1

// codePointAt & charCodeAt
"𠮷".length; // 2

"𠮷".charCodeAt(0); // 53362
"𠮷".charCodeAt(1); // 57271

"𠮷".codePointAt(0); // 134071
"𠮷".codePointAt(1); // 57271
charCodeAt是以一个`码元`为一个索引，codePointAt是以一个`码点`为一个索引进行处理的
```

### 词法
**InputElement**
- WhiteSpace 空格 [unicode链接](https://www.fileformat.info/info/unicode/category/Zs/list.htm)
  - TAB 制表符
  - VT 纵向制表符
  - FF FormFeed
  - SP Space  U+0020
  - NBSP  U+00A0 NO-BREAK SPACE（与语义有关，可起到不断词的作用）
  - 。。
- LineTerminator 换行符
  - LF  U+000A line feed(/n)
  - CR  U+000D carriage return(/r)
- Comment 注释
- Token 有效输入
  - Punctuator(符号，>,<,=,{,}...)
  - IdentifierName(表示符)
    - Identifier(变量名)不可以用keywords，属性可以使用keywords `get`, `undefined` 全局不可改`变量名`
    - Keywords(关键字)
    - Future reserved Keywords: enum
  - Literal(类型)
    - Number
      - 二进制0b
      - 八进制0o
      - 十六进制0x
      - 比较浮点是否相等：Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
    - String
      - ""
      - ''
      - ``
    - Boolean
    - Null
    - Undefined
  
### homeWork
- 写一个正则表达式 匹配所有 Number 直接量
- 写一个 UTF-8 Encoding 的函数
- 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

### 参考知识
#### 正则相关
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


#### Unicode特殊符号编码 
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

#### Unicode汉字基本范围
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

### 参考名词
**day 01**
> 图灵机（Turing machine）：又称确定型图灵机，是英国数学家艾伦·图灵于 1936 年提出的一种将人的计算行为抽象掉的数学逻辑机，其更抽象的意义为一种计算模型，可以看作等价于任何有限逻辑数学过程的终极强大逻辑机器。  
> 图灵完备性：在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完全的。这个词源于引入图灵机概念的数学家艾伦·图灵。虽然图灵机会受到储存能力的物理限制，图灵完全性通常指“具有无限存储能力的通用物理机器或编程语言”。  
> 终结符： 最终在代码中出现的字符（ https://zh.wikipedia.org/wiki/ 終結符與非終結符）  
> 产生式： 在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则  （Backus-Naur Form，BNF）的语句  
> 静态和动态语言： https://www.cnblogs.com/raind/p/8551791.html  
> 强类型： 无隐式转换  
> 弱类型： 有隐式转换  
> 协变与逆变： https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html  
> Yacc 与 Lex 快速入门： https://www.ibm.com/developerworks/cn/linux/sdk/lex/index.html  
> 关于元编程： https://www.zhihu.com/question/23856985  
> 编程语言的自举： https://www.cnblogs.com/lidyan/p/6727184.html  
推荐阅读：ECMA-262 Grammar Summary 部分  

**day 02**
> 码元：一个16位的二进制编码叫做一个码元（Code Unit），Unicode编码范围在0 - 2^16，占1个字节。  
> 码点：一个32位的二进制编码叫做一个码点（Code Point），Unicode编码范围在0 - 2^32，占2个字节。  
> [字符集](https://zh.wikipedia.org/zh/%E5%AD%97%E7%AC%A6%E7%BC%96%E7%A0%81)：字符编码（英语：Character encoding）、字集码是把字符集中的字符编码为指定集合中某一对象（例如：比特模式、自然数序列、8 位组或者电脉冲），以便文本在计算机中存储和通过通信网络的传递。常见的例子包括将拉丁字母表编码成摩斯电码和 ASCII。其中，ASCII 将字母、数字和其它符号编号，并用 7 比特的二进制来表示这个整数。通常会额外使用一个扩充的比特，以便于以 1 个字节的方式存储。在计算机技术发展的早期，如 ASCII（1963 年）和 EBCDIC（1964 年）这样的字符集逐渐成为标准。但这些字符集的局限很快就变得明显，于是人们开发了许多方法来扩展它们。对于支持包括东亚 CJK 字符家族在内的写作系统的要求能支持更大量的字符，并且需要一种系统而不是临时的方法实现这些字符的编码。  
> [Unicode](https://zh.wikipedia.org/zh-hans/Unicode)：中文：万国码、国际码、统一码、单一码。是计算机科学领域里的一项业界标准。它对世界上大部分的文字系统进行了整理、编码，使得电脑可以用更为简单的方式来呈现和处理文字。
> [ASCII](https://zh.wikipedia.org/wiki/ASCII)：（American Standard Code for Information Interchange，美国信息交换标准代码）是基于拉丁字母的一套电脑编码系统。它主要用于显示现代英语，而其扩展版本延伸美国标准信息交换码则可以部分支持其他西欧语言，并等同于国际标准 ISO/IEC 646。美国信息交换标准代码是这套编码系统的传统命名，互联网号码分配局现在更倾向于使用它的新名字 US-ASCII[2]。美国信息交换标准代码是美国电气和电子工程师协会里程碑之一。  
> Token：记号、标记。JS 里有效的输入元素都可以叫 Token。  
> [NBSP](https://zh.wikipedia.org/wiki/%E4%B8%8D%E6%8D%A2%E8%A1%8C%E7%A9%BA%E6%A0%BC) ：不换行空格（英语：no-break space，NBSP）是空格字符，用途是禁止自动换行。HTML 页面显示时会自动合并多个连续的空白字符（whitespace character），但该字符是禁止合并的，因此该字符也称作“硬空格”（hard space、fixed space）。Unicode 码点为：U+00A0 no-break space。  
> [零宽空格](https://zh.wikipedia.org/zh-hans/%E9%9B%B6%E5%AE%BD%E7%A9%BA%E6%A0%BC)：（zero-width space, ZWSP）是一种不可打印的 Unicode 字符，用于可能需要换行处。在 HTML 页面中，零宽空格可以替代。但是在一些网页浏览器（例如 Internet Explorer 的版本 6 或以下）不支持零宽空格的功能。  