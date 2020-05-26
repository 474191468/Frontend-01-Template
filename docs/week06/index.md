## 有限状态机
- 每一个状态都是一个机器
  1.  每一个机器里，我们可以做计算，存储，输出
  2.  机器接受的输入是一致的
  3.  每一个机器本身无状态，应该是纯函数
- 每一个机器知道下一个状态
  1. 有确定的下一个状态 摩尔状态机
  2. 无确定的下一个状态 米利状态机

```js
// 找到一个字符串中的a
function match(string ){
    for(let c of string) {
        if(c === 'a'){
            return true
        }
    }
}
// 找到一个字符串中的ab
function match(string ){
    let foundA = false;
    for(let c of string) {
        if(c === 'a'){
            foundA = true;
        } else if (foundA && c == "b") {
            return true;
        } else {
            foundA = false;
        }
        return false
    }
}
// 找到一个字符串中的abcdef
function match(string ){
    let foundA = false;
    let foundB = false;
    let foundC = false;
    let foundD = false;
    let foundE = false;
    for(let c of string) {
        if(c === 'a'){
            foundA = true;
        } else if (foundA && c == "b") {
            foundB = true;
        } else if (foundB && c == "c") {
            foundC = true;
        } else if (foundC && c == "d") {
            foundD = true;
        } else if (foundD && c == "e") {
            foundE = true;
        } else if (foundE && c == "f") {
            return true;
        } else {
             foundA = false;
             foundB = false;
             foundC = false;
             foundD = false;
             foundE = false;
        }
        return false
    }
}
// 状态机重写第三个函数
function match(string ){
    let state = start;
    for(let c of string) {
        state = state(c);
    }
    return state === end;
}

function start(c){
    if (c === 'a') {
        return foundA;
    } else {
        return start;
    }
}

function foundA(c){
    if (c === 'b') {
        return foundB;
    } else {
        return start(c);
    }
}

function foundB(c){
    if (c === 'c') {
        return foundC;
    } else {
        return start(c);
    }
}

function foundC(c){
    if (c === 'd') {
        return foundD;
    } else {
        return start(c);
    }
}

function foundD(c){
    if (c === 'e') {
        return foundE;
    } else {
        return start(c);
    }
}

function foundE(c){
    if (c === 'f') {
        return end;
    } else {
        return start(c);
    }
}

function end(c){
    return end;
}

```

## HTML 解析
URL => HTTP => HTML => parse => DOM => css computing => DOM with CSS
=> layout => DOM with position => render => Bitmap




> Mealy ：在计算理论中，米利型有限状态机（英语：Mealy machine）是基于它的当前状态和输入生成输出的有限状态自动机（更精确的叫有限状态变换器）。这意味着它的状态图将为每个转移边包括输入和输出二者。与输出只依赖于机器当前状态的摩尔有限状态机不同，它的输出与当前状态和输入都有关。但是对于每个 Mealy 机都有一个等价的 Moore 机，该等价的 Moore 机的状态数量上限是所对应 Mealy 机状态数量和输出数量的乘积加 1（|S’|=|S|*|Λ|+1）。