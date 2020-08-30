import {enableGesture} from "./gesture"
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
    getAttribute(name) {
        return 
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

    get classList() {
        return this.root.classList;
    }

    set innerText(text){
        return this.root.innerText = text;
    }
    // attribute
    setAttribute(name, value) {
        this.root.setAttribute(name, value);

        if(name.match(/^on([\s\S]+)$/)){
            let eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
            this.addEventListener(eventName, value);
        }
        if(name === "enableGesture") {
            enableGesture(this.root);
        }
    }

    getAttribute(name) {
        return this.root.getAttribute(name);
    }

    addEventListener() {
        this.root.addEventListener(...arguments);
    }

    moutTo(parent) {
        parent.appendChild(this.root);
        for(let child of this.children) {
            if(typeof child == "string") {
                child = new Text(child);
            }
            child.moutTo(this.root);
        }
    }

    appendChild(child) {
        this.children.push(child);
    }
}