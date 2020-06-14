## 重学CSS
### 动画与绘制
#### Animation

- @keyframes定义 【关键帧】
- animation使用
```js
// from to 表示从开始到结束
// 也可使用 0% - 100% 表示 但二者通常不混用
@keyframes mykf {
    from {background: red;}
    to {background: blue;}
}
div {
    animation:mykf 5s infinite;
}
```
#### Property
- animation-name 时间曲线（@keyframes 定义的关键帧）
- animation-druation 动画的时长
- animation-timing-function 动画的时间曲线
- animation-delay 动画开始前的延迟
- animation-iteration-count 动画的播放次数
- animation-direction 动画的方向

#### Transition
- transition-property 要变换的属性
- transition-duration 变换的时长
- transition-timing-function 时间曲线
- transition-delay 延迟

#### cubic-bezier
[贝塞尔曲线](http://cubic-bezier.com/)

### 渲染与颜色
#### 颜色
- CMYK：Cyan-青色，Magenta-品红，Yellow-黄色，blacK-黑色
- RGB：Red-红色，Green-绿色，Blue-蓝色
- HSL：Hue-颜色（0-360），Saturation-饱和度（0-100%），Lightness-亮度（0-100%，黑-白）
- HSV：Hue-颜色（0-360），Saturation-饱和度（0-100%），Value-明度（0-100%，黑-白）

#### 形状
- border  
- box-shadow  
- border-radius

## 重学HTML
### 需掌握字符

|Entity|&nbsp;|HTML|JavaScript|  
|---|---|---|  
|quot|"|&quot|\u0022|  
|amp|&|&amp|\u0026|  
|lt|<|&lt|\u003c|  
|gt|>|&gt|\u003e|  



### 语义化
[参考链接](https://html.spec.whatwg.org/multipage/sections.html)
### HTML 语法
- Element：......
- Text：text
- Comment：
- DocumentType：<!Doctype html>
- ProcessingInstruction：
- CDATA：

## 重学DOM
### DOM
[参考链接](https://github.com/double202/Frontend-01-Template/blob/master/week09)

### Node
- Element：元素型节点，跟标签对应。namespace 划分
    - HTMLElement
    - SVGElement
    - ...
- Document：文档根节点
- CharacterDate：字数数据
    - Text：文本节点
    - Comment：注释
    - ProcessingInstruction：处理信息
- DocumentFragment：文档片段 ---- 批量添加处理元素
- DocumentType：文档类型

### DOM操作
#### 导航类操作
|Node|Element|  
|---|---|  
|parentNode|ParentElement|  
|childNodes|children|  
|firstChild|firstElementChild|  
|lastChild|lastElementChild|  
|nextSibling|nextElementSibling|  
|previousSibling|previousElementSibling| 

#### 修改操作
- appendChild
- insertBefore
- removeChild
- replaceChild
> 所有的 DOM 元素默认只有一个父元素，不能两次被插入到 DOM trees 中，同一个节点先插入到 DOM trees 中 A 位置，再插入到 B 位置，会默认从 A 位置 remove 掉。
> childNodes 是一个 living Collection，执行 removeChild 或者其他修改操作后，childNodes 会实时改变。

#### 高级操作
- compareDocumentPosition 是一个用于比较两个节点中关系的函数。
- contains 检查一个节点是否包含另一个节点的函数。
- isEqualNode 检查两个节点是否完全相同。
- isSameNode 检查两个节点是否是同一个节点，实际上在 JavaScript 中可以用 ===。
- cloneNode 复制一个节点，如果传入参数为 true，则会连同子元素做深拷贝。


## Events
`addEventListener` (type,function,useCapture);
- type 监听事件名称
- function 回掉函数
- useCapture true(捕获事件) | false(冒泡事件) / options 
  - options : 
    - once :只执行一次
    - passive :  承诺此事件监听不会调用 preventDefault，这有助于性能。
    - useCapture :是否捕获（否则冒泡）。

> 当点击一个元素时首先拿到的是坐标，从外到里捕获，直到找到 EventTarget，从里到外冒泡。



