## day01 重学JavaScript | 表达式，类型转换

### 表达式
#### 运算符优先级 
**left handside 等号左边**
等号左边必须是reference类型  
- member，new运算符为最高优先级
  - member：a.b;a[b];foo`string`;super.b;new Foo()
    - foo`string${name}!`:foo为函数时，该写法为函数调用，参数解析为 0:[string,1] 1:name的值
  - new Foo
    - new Foo 运算符优先级比new Foo()优先级低 
- call
  - foo();super();foo()['b'];foo().b;foo()`...`

**example**
```js
function parent() {

}
function child() {
    return parent;
}
new child // f parent(){}
child() // f parent(){}
new child() // f parent(){}
new (child()) // parent {}
new (new child) // parent {}
new new child() // parent {}

class foo {
    constructor(){
        this.b = 1;
    }
}
new foo['b'] // 1 new 的优先级高
foo.b = function(){};
new foo['b'] // foo.b {}
new (foo['b']) // 与上方等效 foo.b {}
```
Reference类型
Object delete
key    assign

**right handside 等号右边**
换行符会导致语义解析错误
```js
let a = 1, b = 1, c = 1;
a
++
b
++
c

// a = 1 b = 2 c = 2解析为 a ++b ++c

a/*

*/++
/*
*/b
// a = 1 b = 3

// IIFE ；立即执行函数
(function(){
    console.log('IIFE')
})() // 这么写会有弊端，多个文件合并时会产生下面情况


(function(){
    console.log('IIFE1')
})()
(function(){
    console.log('IIFE2')
})()// IIFE2未执行

// 推荐void声明IIFE
void function(){

}()

!!1 // true 会做默认转换

&& // 可以当成if else来使用
```

**homework**
```js
function covertStringToNumber(string, x) {
    if(arguments.length < 2){
        x = 10;
    }
    var charts = string.split('');
    var number = 0;
    var i = 0;
    while(i < charts.length && chars[i] != '.') {
        number = number * x;
        number += chars[i].codePointAt(0) - '0'.codePointAt(0);
        i++
    }
    if(chars[i] == '.') {
        i++;
    }
    var fraction = 1;
    while(i < chars.length){
        fraction = fraction / x;
        number += (charts.length[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
        i++;
    }
    fraction = fraction / x;
    return number;
}

function covertNumberToString(number, x) {
    var integer = Math.floor(number);
    var fraction = String(number).match(/\.\d+$/);
    var string = '';
    if (fraction) {
      fraction = fraction[0].replace('.', '');
    }
    while(integer > 0)  {
        string = String(integer % x) + string;
        interger = Math.floor(integer / x);
    }
  
    return number + (fraction ? fraction : '');
}
```