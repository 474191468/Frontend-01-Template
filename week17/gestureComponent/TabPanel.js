import { Wrapper, Text, create } from "./createElement"


import { Timeline, Animation } from "./animation"
import {ease} from "./cubicBezier"


export class TabPanel {
    constructor(config) {
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
        // this.root = document.createElement("div");
    }
    // attribute
    setAttribute(name, value) {
        this[name] = value;
    }

    getAttribute(name) {
        return this[name];
    }

    moutTo(parent) {
        this.render().moutTo(parent);
    }

    appendChild(child) {
        this.children.push(child);
    }

    select(i) {
        for(let view of this.childViews) {
            view.style.display = "none";
        }
        this.childViews[i].style.display = "";
        for(let view of this.titleViews) {
           view.classList.remove('selected')
        }
       
        this.titleViews[i].classList.add('selected');
    }

    render() {
        this.childViews = this.children.map(child => <div style="width:300px;min-height:300px">{child}</div>);
        this.titleViews = this.children.map((child, i) => <span onClick={()=>this.select(i)} style="width:300px;min-height:300px">{child.getAttribute('title')}</span>);

        setTimeout(() => {
            this.select(0);
        },16);

        return  <div class="tab-panel" style="border:solid 1px lightgreen;width:300px">
              <h1 style="background-color:lightgreen;border:solid 1px lightgreen;width:300px;margin:0;">{this.titleViews}</h1>
                <div>{this.childViews}</div>
            </div>;
    }
}