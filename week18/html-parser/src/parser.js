const EOF = Symbol('EOF'); // End of File 标示文件结尾
// 主要标签有开始标签，自闭和标签，结束标签

let currentToken = null; // 词法解析
let currentAttribute = null; // 属性解析

let stack; // 栈结构，用来做dom树的构建
let currentTextNode = null; // 文本节点解析


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

        top.children.push(element);
        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;
    } else if (token.type == 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
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

// in script
function scriptData(c) {
    if (c == "<") {
        return scriptDataLessThanSign
    } else {
        emit({
            type: "text",
            content: c
        })
        return scriptData
    }
}
// inscript received <
function scriptDataLessThanSign(c) {
    if (c == "/") {
        return scriptDataEndTagOpen
    } else {
        emit({
            type: "text",
            content: "<"
        })
        return scriptData(c)
    }
}
// in script received </
function scriptDataEndTagOpen(c) {
    if (c == "s") {
        return scriptDataEndTagNameS
    } else {
        emit({
            type: "text",
            content: "<"
        })
        emit({
            type: "text",
            content: "/"
        })
        return scriptData(c)
    }
}
// in script received </s
function scriptDataEndTagNameS(c) {
    if (c == "c") {
        return scriptDataEndTagNameC
    } else {
        emit({
            type: "text",
            content: "</s"
        })
        return scriptData(c)
    }
}
// in script received </sc
function scriptDataEndTagNameC(c) {
    if (c == "r") {
        return scriptDataEndTagNameR
    } else {
        emit({
            type: "text",
            content: "</sc"
        })
        return scriptData(c)
    }
}
// in script received </scr
function scriptDataEndTagNameR(c) {
    if (c == "i") {
        return scriptDataEndTagNameI
    } else {
        emit({
            type: "text",
            content: "</scr"
        })
        return scriptData(c)
    }
}
// in script received </scri
function scriptDataEndTagNameI(c) {
    if (c == "p") {
        return scriptDataEndTagNameP
    } else {
        emit({
            type: "text",
            content: "</scri"
        })
        return scriptData(c)
    }
}
// in script received </scrip
function scriptDataEndTagNameP(c) {
    if (c == "t") {
        return scriptDataEndTag
    } else {
        emit({
            type: "text",
            content: "</scrip"
        })
        return scriptData(c)
    }
}
// in script received </sscript
let spaces = 0;

function scriptDataEndTag(c) {
    if (c == " ") {
        spaces++;
        return scriptDataEndTag
    }
    if (c == ">") {
        emit({
            type: "endTag",
            tagName: "script"
        });
        return data
    } else {
        emit({
            type: "text",
            content: "</script" + new Array(spaces).fill(' ').join('')
        })
        return scriptData(c)
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
            content: "<"
        });
        emit({
            type: 'text',
            content: c
        });
        return data;
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
        return singleQuotedAttributeValue;
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

export function parseHTML(html) {
    let state = data;
    stack = [{
        type: 'document',
        children: []
    }];
    for (let c of html) {
        state = state(c);
        if (stack[stack.length - 1].tagName === "script" && state == data) {
            state = scriptData;
        }
    }
    state = state(EOF);
    return stack[0];
};