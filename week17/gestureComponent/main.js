import { Wrapper, Text, create } from "./createElement"
import {Carousel} from "./Carousel"
import {Panel} from "./Panel"
import {TabPanel} from "./TabPanel"
import {ListView} from "./ListView"

import css from "./carousel.css";


let component = <Carousel data = {
    ["https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
        "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
        "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
        "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
    ]
} > </Carousel> ;

// let panel = <Panel title="This is title">
//     <span>This is cotent1</span>
// </Panel>
let tabpanel = <TabPanel>
    <span  title="title1">This is cotent1</span>
    <span  title="title2">This is cotent2</span>
    <span  title="title3">This is cotent3</span>
    <span  title="title4">This is cotent4</span>
</TabPanel>;

let data = [{
    title:"蓝猫",
    url:"https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg"
},{
    title:"橘猫加白",
    url:"https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg"
},{
    title:"狸花加白",
    url:"https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg"
},{
    title:"橘毛",
    url:"https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
},];

let list = <ListView data={data}>
   {record =>  <figure>
        <img src={record.url} />
        <figcation>{record.title}</figcation>
    </figure>}
</ListView>


component.moutTo(document.body);
tabpanel.moutTo(document.body);
list.moutTo(document.body);
// jsx 构建顺序，先子后父