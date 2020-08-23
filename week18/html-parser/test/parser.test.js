import { parseHTML } from "../src/parser.js";
const assert = require("assert");


it('parse a single element', function() {
    let root = parseHTML("<div></div>");
    let div = root.children[0];
    assert.equal(div.tagName, "div");
    assert.equal(div.children.length, 0);
    assert.equal(div.type, "element");
    assert.equal(div.attributes.length, 2);
});

it('parse a single element with text content', function() {
    let root = parseHTML("<div>hello</div>");
    let text = root.children[0].children[0];
    assert.equal(text.content, "hello");
    assert.equal(text.type, "text");

});

it('tag mismatch', function() {
    try {
        let root = parseHTML("<div></zyl>");
    } catch (e) {
        assert.equal(e.message, "Tag start end doesn't match!");
    }
});

it('text with <', function() {
    let root = parseHTML("<div>a < b</div>");
    let text = root.children[0].children[0];
    assert.equal(text.content, "a < b");
    assert.equal(text.type, "text");
});

it('with property', function() {
    let root = parseHTML("<div id=a class='cls' data=\"abc\"></div>");
    let div = root.children[0];
    let count = 0;
    for (let attr of div.attributes) {
        if (attr.name === "id") {
            count++;
            assert.equal(attr.value, "a");
        }
        if (attr.name === "class") {
            count++;
            assert.equal(attr.value, "cls");
        }
        if (attr.name === "data") {
            count++;
            assert.equal(attr.value, "abc");
        }
    }
    assert.ok(count == 3);
});

it('with double quoted peoperty', function() {
    let root = parseHTML("<div id=a class='cls' data=\"abc\"></div>");
    let div = root.children[0];
    let count = 0;
    for (let attr of div.attributes) {
        if (attr.name === "id") {
            count++;
            assert.equal(attr.value, "a");
        }
        if (attr.name === "class") {
            count++;
            assert.equal(attr.value, "cls");
        }
        if (attr.name === "data") {
            count++;
            assert.equal(attr.value, "abc");
        }
    }
    assert.ok(count == 3);
})

it('with peoperty 3', function() {
    let root = parseHTML("<div id=a class='cls' data=\"abc\" />");
    let div = root.children[0];
    let count = 0;
    for (let attr of div.attributes) {
        if (attr.name === "id") {
            count++;
            assert.equal(attr.value, "a");
        }
        if (attr.name === "class") {
            count++;
            assert.equal(attr.value, "cls");
        }
        if (attr.name === "data") {
            count++;
            assert.equal(attr.value, "abc");
        }
    }
    assert.ok(count == 3);
})

it('script', function() {
    let content = `
    <div>abdc</div>
    <span>x</span>
    /script>
    <script
    <
    </
    </s
    </sc
    </scr
    </scri
    </scrip
    </script 
    `;
    let root = parseHTML(`<script>${content}</script>`);
    let text = root.children[0].children[0];
    assert.equal(text.content, content);
    assert.equal(text.type, "text");
})

it('attrbute with no value', function() {
    let root = parseHTML(" <div class />");
})

it('attrbute with no value', function() {
    let root = parseHTML(" <div class id/>");
})

it('the capital letters', function() {
    let root = parseHTML(" <Div class id/>");
})