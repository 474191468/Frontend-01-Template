export function create(Cls, attributes, ...children) {
    let o;
    if(typeof Cls === "string") {
        o = new Wrapper(Cls);
    } else {
        o = new Cls({
            timer:""
        });
    }
        
    for (let name in attributes) {
        // o[name] = attributes[name];
        o.setAttribute(name, attributes[name]);
    }
    
    let visit = (children) => {
        for (let child of children) {
            if (typeof child === "object" && child instanceof Array) {
                visit(child);
                continue;
            }
            if (typeof child === "string") {
                child = new Text(child);
            }
           
            // o.children.push(child);
            o.appendChild(child);
        }
    }

    visit(children);
    return o;
}



export class Text {
    constructor(text) {
        this.children = [];
        this.root = document.createTextNode(text);
    }

    moutTo(parent) {
        parent.appendChild(this.root);
    }
}

// 处理小写字符
export class Wrapper {
    constructor(type) {
        this.children = [];
        this.root = document.createElement(type);
    }

    get style() {
        return this.root.style;
    }
    // attribute
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    addEventListener() {
        this.root.addEventListener(...arguments);
    }

    moutTo(parent) {
        parent.appendChild(this.root);
        for(let child of this.children) {
            child.moutTo(this.root);
        }
    }

    appendChild(child) {
        this.children.push(child);
    }
}