function create(Cls, attrbutes, ...children) {
    let o;
    if(typeof Cls === "string") {
        o = new Wrapper(Cls);
        return ;
    } else {
        o = new Cls({
            timer:""
        });
    }
        
        for (let name in attrbutes) {
            o[name] = attrbutes[name];
            o.setAttribute(name, attrbutes[name]);
        }
        
        for (let child of children) {
            if(typeof child === "string") {
                child = new Text(child);
            }
            o.children.push(child);
        }

    return o;
}

class Text{
    constructor(text) {
        this.root = document.createTextNode(text);
    }

    moutTo(parent) {
        parent.appendChild(this.root);
    }
}

// 处理小写字符
class Wrapper {
    constructor(type) {
        this.children = [];
        this.root = document.createElement(type);
    }
    // property
    set class(v) {
        console.log("Parent::class", v);
    }
    set id(v) {
        console.log("Parent::id", v);
    }
    // attribute
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
        // console.log(name, value)
    }

    moutTo(parent) {
        parent.appendChild(this.root);
        for(let child of this.children) {
            child.moutTo(this.root);
        }
    }

    appendChild(child) {
        // this.root.appendChild(child);
        this.children.push(child);
        // console.log("Parent::appendChild", child)
    }
}

class MyComponent {
    constructor(config) {
        this.children = [];
        this.root = document.createElement("div");
    }
    // property
    set class(v) {
        console.log("Parent::class", v);
    }
    set id(v) {
        console.log("Parent::id", v);
    }
    // attribute
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
        // console.log(name, value)
    }

    render() {
        
        return <acticle>
            <header>
                I'm a header
            </header>
                {this.slot}
            <footer>
                I'm a footer
            </footer>
        </acticle>
    }

    moutTo(parent) {
        this.slot = document.createElement("div");
      
        // parent.appendChild(this.root);
        for(let child of this.children) {
            console.log(child);
            // child.moutTo(this.slot);
            // debugger;
            this.slot.appendChild(child);
        }
        this.render().moutTo(parent);
    }

    appendChild(child) {
        // this.slot.appendChild(child);
        this.children.push(child);
        // this.root.appendChild(child);
        // console.log("Parent::appendChild", child)
    }
}
// class Child {
//     constructor(config) {
//         this.children = [];
//         this.root = document.createElement("div");
//     }

//     setAttribute(name, value) {
//         this.root.setAttribute(name, value);
//         // console.log(name, value)
//     }

//     moutTo(parent) {
//         parent.appendChild(this.root);
//     }

//     appendChild(child) {
//         child.moutTo(this.root);
//         // this.root.appendChild(child);
//         // console.log("Parent::appendChild", child)
//     }
// }
// let component = <Div id="a" class="b"> 
//         <Div></Div>
//         <Div></Div>
//         <Div></Div>
//     </Div> ;

// let component = <Div id="a" class="b"> 
// text
// </Div> ;

let component = <MyComponent> 
       <div>text text text</div>
    </MyComponent> ;

// component.id = "c";
component.moutTo(document.body);
    // jsx 构建顺序，先子后父

// var component = create(Parent, {
//     id: "a",
//     "class": "b"
//   }, 
// create(Child, null), 
// create(Child, null), 
// create(Child, null));

console.log(component)

{ /* component.setAttrbute('id', a); */ }