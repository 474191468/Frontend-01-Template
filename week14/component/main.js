import {Wrapper,Text,create} from "./createElement"


class Carousel {
    constructor(config) {
        this.children = [];
        this.root = document.createElement("div");
    }
    // attribute
    setAttribute(name, value) {
        this[name] = value;
        // this.root.setAttribute(name, value);
        // console.log(name, value)
    }

    render() {
        let children = this.data.map(url => {
            let element = <img src={url}/>;
            element.addEventListener("dragstart", e => e.preventDefault());
            return element;
        })
        let root = <div class="carousel">
                    {children}
                </div>;
        let position = 0;
        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length;
            let current = children[position];
            let next = children[nextPosition];

            current.style.transition = "ease 0s";
            next.style.transition = "ease 0s";


            current.style.transform = `translateX(${-100 * position}%)`;
            next.style.transform = `translateX(${100 -100 * nextPosition}%)`;

            // settimeout 改成requestAnimationFrame 需要嵌套两层 
            // 第一层是上面设置的css生效，第二层是下一帧生效
            // requestAnimationFrame(() => {
            //     requestAnimationFrame(() => {
            //         // 使用css rule 控制
            //         current.style.transition = "";
            //         next.style.transition = "";

            //         current.style.transform = `translateX(${-100 -100 * position}%)`;
            //         next.style.transform = `translateX(${-100 * nextPosition}%)`;

            //         // 自动循环 取余
            //         position = nextPosition;
            //     })
            // })
            // 16 毫秒代表一帧动画
            setTimeout(() => {

                current.style.transition = "";
                next.style.transition = "";

                current.style.transform = `translateX(${-100 -100 * position}%)`;
                next.style.transform = `translateX(${-100 * nextPosition}%)`;

                // 自动循环 取余
                position = nextPosition;
            },16)
            setTimeout(nextPic, 3000);
        }
        setTimeout(nextPic, 3000);

        return root;
    }

    moutTo(parent) {
        this.render().moutTo(parent);
    }

    appendChild(child) {
        this.children.push(child);
    }
}


class MyComponent {
    constructor(config) {
        this.children = [];
        // this.root = document.createElement("div");
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
            <header>I'm a header</header>
                {this.slot}
            <footer>I'm a footer</footer>
        </acticle>
    }

    moutTo(parent) {
        this.slot = <div></div>
        // parent.appendChild(this.root);
        for(let child of this.children) {
            // child.moutTo(this.slot);
            // debugger;
            this.slot.appendChild(child);
        }
        this.render().moutTo(parent);
    }

    appendChild(child) {
        this.children.push(child);
    }
}

// let component = <MyComponent>
//        <div>text text text</div>
//     </MyComponent>

let component = <Carousel data={
    [ "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",]
}></Carousel> ;


component.moutTo(document.body);
    // jsx 构建顺序，先子后父
