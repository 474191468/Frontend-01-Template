const css = require('css');
const EOF = Symbol('EOF'); // End of File 标示文件结尾
// 主要标签有开始标签，自闭和标签，结束标签

let currentToken = null; // 词法解析
let currentAttribute = null; // 属性解析

let stack = [{
    type: 'document',
    children: []
}]; // 栈结构，用来做dom树的构建
let currentTextNode = null; // 文本节点解析

let rules = [];

// 调用CSS Parser来分析CSS规则
function addCSSRules(text) {
    var ast = css.parse(text);
    console.log(JSON.stringify(ast, null, '    '));
    rules.push(...ast.stylesheet.rules);
}

function computeCSS(el) {
    // 获取父元素序列
    // slice两个参数，这里用法是表复制一份stack，防止污染原来的stack
    // reverse 首先获取当前元素，查找时应该是从里向外找
    // ex：div p #myId
    // 先获取#myId，再向外寻找
    var elements = stack.slice().reverse();

    if (!el.computedStyle) {
        el.computedStyle = {};
    }

    for (let rule of rules) {
        // selectors 即获取到class属性名 body div #myId
        // selectors[0] 表body
        var selectorParts = rule.selectors[0].split(' ').reverse();
        // 如果当前元素不匹配第一个元素就干掉循环，进行下一步
        if (!match(el, selectorParts[0])) {
            continue;
        }

        let matched = false;

        var j = 1;
        for (var i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        // 如果j大于等于selectorParts.length证明匹配成功
        if (j >= selectorParts.length) {
            matched = true;
        }
        if (matched) {
            // 如果匹配到生成computedStyle并且运用到dom上
            var sp = specificity(rule.selectors[0]);
            var computedStyle = el.computedStyle;
            for (var declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {};
                }
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if (compare(computedStyle[declaration.property], sp) < 0) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
            }
        }
    }
}

function match(element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }

    if (selector.charAt(0) == '#') {
        var attr = element.attributes.filter((attr) => attr.name === 'id')[0];
        if (attr && attr.value === selector.replace('#', '')) {
            return true;
        }
    } else if (selector.charAt(0) == '.') {
        var attr = element.attributes.filter((attr) => attr.name === 'class')[0];
        // 复合选择器 值为 value:"class1 class2"
        if (attr) {
            const attrClassArray = attr.value.split(' ')
            for (let attrClass of attrClassArray) {
                if (attrClass === selector.replace(".", '')) {
                    return true
                }
            }
        }
        // if (attr && attr.value === selector.replace('.', '')) {
        //     return true;
        // }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }
}

// css权重处理
function specificity(selector) {
    // div body .class #id  ==> [2,1,1,0] 2 表示2个tagName 1表示一个class  1表示一个id 0 
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(' ');
    for (var part of selectorParts) {
        if (part.charAt(0) == '#') {
            p[1] += 1;
        } else if (part.charAt(0) == '.') {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    }
    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
}

function emit(token) {
    // if (token.type != "text") {
    //     console.log(token)
    // }
    let top = stack[stack.length - 1];
    if (token.type == 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        };

        element.tagName = token.tagName;

        for (let p in token) {
            if (p != 'type' || p != 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }
        // 创建一个元素后，立即计算CSS
        // 因为有些css解析依赖父元素，所有元素创建完后再计算会导致性能问题
        // 理论上，分析一个元素时，所有CSS规则已经收集完毕
        // 真实浏览器下，遇到写在body里面的style标签，需要重新计算CSS，这里pass掉
        computeCSS(element);

        top.children.push(element);
        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;
    } else if (token.type == 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            // 遇到style标签执行添加css规则的操作
            if (top.tagName == 'style') {
                addCSSRules(top.children[0].content);
            }
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type == 'text') {
        if (currentTextNode == null) {
            currentTextNode = {
                type: 'text',
                content: ''
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

function data(c) {
    if (c == '<') {
        // 进入标签
        return tagOpen;
    } else if (c == EOF) {
        emit({
            type: 'EOF'
        });
        return;
    } else {
        emit({
            type: 'text',
            content: c
        });
        return data;
    }
}

function tagOpen(c) {
    if (c == '/') {
        // 自闭合标签
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        };
        // 正常标签
        return tagName(c);
    } else {
        emit({
            type: 'text',
            content: c
        });
        return;
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        };
        // 正常标签
        return tagName(c);
    } else if (c == '>') {} else if (c == EOF) {} else {}
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        // 遇到空格说明要进入处理属性状态
        return beforeAttributeName;
    } else if (c == '/') {
        // 自闭合标签
        return selfClosingStartTag;
    } else if (c.match(/^[A-Z]$/)) {
        currentToken.tagName += c;
        // 遇到字母说明还是解析标签tagName状态
        return tagName;
    } else if (c == '>') {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c);
    } else if (c == '=') {
        // return beforeAttributeName;
    } else {
        currentAttribute = {
            name: '',
            value: ''
        };
        return attributeName(c);
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c);
    } else if (c == '=') {
        return beforeAttributeValue;
    } else if (c == '\u0000') {} else if (c == '"' || c == "'" || c == '<') {} else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return beforeAttributeValue;
    } else if (c == '"') {
        return doubleQuotedAttributeValue;
    } else if (c == "'") {
        return singleQuotedAttributeValue;
    } else if (c == '>') {} else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if (c == '"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {} else if (c == EOF) {} else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c == '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == '\u0000') {} else if (c == '"' || c == "'" || c == '<' || c == '=' || c == '`') {} else if (c == EOF) {} else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c == "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {} else if (c == EOF) {} else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {} else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function selfClosingStartTag(c) {
    if (c == '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c == 'EOF') {} else {}
}

// function endTagOpen(c) {
//     if (c.match(/^[a-zA-Z]$/)) {
//         currentToken = {
//             type: "endTag",
//             tagName: ""
//         }
//         return tagName(c)
//     } else if (c == ">") {

//     } else if (c == EOF) {

//     } else {

//     }
// }

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c == '=') {
        return beforeAttributeValue;
    } else if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {} else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: '',
            value: ''
        };
        return attributeName(c);
    }
}

module.exports.parseHTML = function parsrHtml(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
};