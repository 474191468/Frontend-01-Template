var parse = require('./parser');

module.exports = function(source, map) {
    let tree = parse.parseHTML(source)
    // console.log(tree.children[1].children[0].content)

    let template = null;
    let script = null;

    for (let node of tree.children) {
        if(node.tagName == "template") {
            template = node.children.filter(e => e.type != "text")[0];
        }
        if(node.tagName == "scripe"){
            script = node.children[0].content
        }
    }

    let createCode = "";
    let visit = (node) => {
        if(node.type === "text") {
            return JSON.stringify(node.content)
        }
        let attrs = {};
        for (let attribute of node.attributes) {
            attrs[attribute.name] = attribute.value;
        }
        let children = node.children.map(node => visit(node))
        return `create("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
    }

    visit(template)

    let r = `
    import {Wrapper,Text,create} from "./createElement";
    export class Carousel {
        render(){
            return ${visit(template)}
        }
        moutTo(parent) {
            this.render().moutTo(parent);
        }
        setAttribute(name, value) {
            this[name] = value;
            // this.root.setAttribute(name, value);
            // console.log(name, value)
        }
    }
    
`
    console.log(r)
    return r
}