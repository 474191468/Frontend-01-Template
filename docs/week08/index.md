## 选择器语法

### 简单选择器
- *
- div svg|a
- .cls
- #id
- [attr=value]
- :hover
- ::before

### 复杂选择器
- <复合选择器><sp><复合选择器>
- <复合选择器>">"<复合选择器> 无回溯实现
- <复合选择器>"~"<复合选择器> 无回溯实现
- <复合选择器>"+"<复合选择器> 无回溯实现
- <复合选择器>"||"<复合选择器>（选中 table一列）

### 选择器权重计算
优先级：行内>id>class>tag  
week06中可以归为[0,2,2,1]四元组 
计算公式为：S = 0 * N^3 + 2 * N^2 + 1 * N^1 + 1 * N^0  

|选择器|四元组|注释|  
|---|---|---|  
|div#a.b .c|[0,1,3,1]|属性选择器的优先级等同于class|  
|#a:not(#b)|[0,2,0,0]|not 不参与优先级运算|   
|*.a|[0,0,1,0]|*不参与优先级运算|  
|div.a|[0,0,1,1]|tag 1 class 1|



[attr=value] = .cls  // 权重相等  
`*` 无权重  
:not(#b)  // not 无权重  

## 伪类

### 链接/行为
- :any-link
- :link :visited
- :hover
- :active
- :focus
- :target

### 树结构
- :empty
- :nth-child()
- :nth-last-child()
- :first-child :last-child :only-child

> 以上几个伪类在startTag的computeCss步骤时，不能实现的有nth-last-child、last-child、only-child，因为这三个要在标签结束后再往后检查一个token后需要回溯才能确定；nth-child和first-child都在startTag时已经知道是第几个child；empty比较特殊，虽然它在startTag时也不知道，但它只需要在startTag后只检查一个Token是不是endTag或自封闭标签，便可以确定。因此一般浏览器，都会选择实现empty、nth-child、first-child，其他几个不一定实现。

### 逻辑型
- :not伪类
- :where :has

### 伪元素
- ::brfore
- ::after
- ::first-letter
- ::first-line

**Q： 为什么first-letter可以设置float，first-line却不可以？**  
A： first-line如果float就会脱离流，就不是第一行了，产生无限循环。  

**Q： 那first-line为什么可以改字体？（改了字体也不是firstline了）**  
A： 字是一个一个的渲染的，first-line并不是先算好那些文字在first-line里边，然后应用这些特性。而是在排版过程中，把first-line相关的属性直接加到文字上（如上图可见first-line的所有属性，除line-height外都是作用在文字上的，没有作用于盒的），直到这行满了，不是firstline了，就撤销掉这些属性。layout时操作computeCSS相关的动作。  

first-letter是固定的源码里的第一个文字，而first-line是排版中的第一行，是两个不同层次的概念。  

## 排版

### 盒(box)的概念
|源代码|语义|表现|  
|---|---|---|  
|标签（tag）|元素(Element)|盒(BOX)|  


- HTML代码中可以书写开始标签，结束标签，和自封闭标签。
- 一对起止标签，表示一个元素。
- DOM树中存储的是元素和其他类型的节点（Node）。
- CSS选择器选中的是元素，在排版时可能产生多个盒。
- 排版和渲染的基本单位是盒。  

**attention：**
- 元素是node的一种。
- 选不中元素外的任何节点，如注释节点doctype
- 排版产生多盒情况：
    - inline元素分行会产生多个盒
    - 有伪元素的情况
    - first-letter

### 盒模型
W3C标准盒模型：元素宽高(width,height)不包括border和padding  
IE盒模型：元素宽高(width,height)包括border和padding  
- box-sizing: content-box 是W3C盒子模型
- box-sizing: border-box 是IE盒子模型

### 正常流的排版
1. 收集盒进入行
2. 计算盒在行中的排布
3. 计算行的排布

### 正常流的结构
分为`IFC`和`BFC`。    

Inline Formating Context  
可以简单的理解为从左到右的就是IFC。  

> 一行的排布，大致从左到右排，可能遇到文字，还可能遇到有宽高inline-box，他们会有一个对齐关系。  
> 在更新的CSS标准中，display分成两部分，分别是带和不带inline的版本。如flex和inline-flex。  
> 放文字进入行，会产生行盒，行盒不对应任何元素，是一个虚拟元素，first-line就是应用了这个行盒，实际上就是第一个line-box。  
> 在一个行内元素里放很多inline文字，就会产生很多行的看不见的行盒。给这个行内元素设背景色看到的就是这些行盒内包含的inline盒。  

Block Formating Context  
可以简单的理解为从上到下的就是BFC。  
>line-box可以和block-box一起从上到下排在纵轴。  

> 记住下面这个表现原则：如果一个元素具有 BFC，内部子元素再怎么翻江倒海、翻云覆雨，都不会影响外部的元素。所以，BFC 元素是不可能发生 margin 重叠的，因为 margin 重叠是会影响外部的元素的；BFC 元素也可以用来清除浮动的影响，因为如果不清除，子元素浮动则父元素高度塌陷，必然会影响后面元素布局和定位，这显然有违 BFC 元素的子元素不会影响外部元素的设定。

## 文字
### 文字混排关系

文字有本身占据的空间和对齐的关系，行内盒也跟文字有对其关系，还有行高的概念。  

基线概念，中文无基线，红线是基线。  

```js
<div class="container" style="font-size:50px; line-height:100px; background-color:pink;  ">
    <div class="refline" style="vertical-align:baseline; overflow:visible; display:inline-block; width:1px; height:1px;">
        <div style="width:1000px; height:1px; background:red;"></div>
    </div>
    Hello
    <div class="inline-block" style="line-height:100px; width:100px; height:100px; background-color:aqua; display:inline-block;">world!</div>
</div>
```
打开浏览器，效果如下：(.refline是基线参考线)

Hello与world基线对齐，因为.container的行高与.inline-block的高度一致，所以蓝色的.inline-block与容器粉红色.container也是完全对齐的。

现在把.inline-block的行高改为70px：
```js
<div class="inline-block" style="line-height:70px; width:100px; height:100px; background-color:aqua; display:inline-block;">world!</div>
```
效果如下：


现在.inline-block的行高70px小于本身的高度100px，而对齐方式又是baseline，文字依旧会基线对齐，而这时.inline-block的位置就必须要向下移动才能保证本身的文字与.container的文字基线对齐，向下移动的同时，又撑开了父元素.container的高度。

这时如果将.inline-block内部的文字清空，会发生什么呢？
把文本world!删除：
```js
<div class="inline-block" style="line-height:100px; width:100px; height:100px; background-color:aqua; display:inline-block;"></div>
```
效果如下：


这时，.inline-block的底部与.container的基线对齐了，说明一个line-box内如果没有文字的话，那么这个line-box的基线就会在最底部。

接下来，如果把.inline-block高度设置为大于容器行高的150px，同时vertical-align设置为top，则顶端对齐，且父元素内hello的行高会被撑高到150px。



再将vertical-align设置为bottom，父元素内hello的行高也会被撑高到150px，但因为对齐方式是bottom（元素底部与整行底部对齐），所以必须得向上撑开了：



这时的top其实也变成了撑高之后的top，如果再添加一个50px行高vertical-align为top的元素即可得到验证：
```js
<div style="font-size:50px; line-height:100px; background-color:pink;  ">
    <div class="refline" style="vertical-align:baseline; overflow:visible; display:inline-block; width:1px; height:1px;">
        <div style="width:1000px; height:1px; background:red;"></div>
    </div>
    Hello
    <div class="inline-block" style="vertical-align:bottom; line-height: 70px; width:100px; height:150px; background-color:aqua; display:inline-block;"></div>
    <div class="inline-block-2" style="vertical-align:top; line-height: 70px; width:100px; height:50px; background-color:aqua; display:inline-block;"></div>
</div>
```
如果这时再添加一个特别高的元素，将行高撑很大，则.inline-block与inline-block-2分别对齐撑高后的top和bottom。

**结论1：行模型中，如果有元素超过行的高，就会把最高的元素作为行高并保证它的对齐。**

**结论2：因此为了避免这种意料外的情况，应该尽量把内部inline-box的vertical-align设置为top、bottom、middle中的一种，高度一致的情况下，无论内部有没有文字都一直对齐，这样就会避免baseline出现的意料外情况。**
>使用dom.getClientRects()可以在一个行内元素里得到的行盒里面各inline的位置。
>align-vertical的值：（部分）
>top：使元素及其后代元素的顶部与整行的顶部对齐。
>bottom：使元素及其后代元素的底部与整行的底部对齐。
>middle：使元素的中部与父元素的基线加上父元素x-height的一半对齐。
>text-top：使元素的顶部与父元素的字体顶部对齐。
>text-bottom：使元素的底部与父元素的字体底部对齐。
>top和bottom都是相对行的，而middle是相对父元素的。

## float和clear
原理：先在原位渲染一个块级元素，然后脱离文档流顶到left或right。

## margin折叠
边距折叠只会发生在BFC里，且发生在交叉轴，inline-box、float里不存在边距折叠。

产生BFC的有以下几种：
- 浮动元素，设置了float的元素，脱离了文档流
- 绝对定位元素，position设置为absolute的元素，脱离了文档流
- 不是block的块容器（例如inline-block，table-cell，table-caption）
- overflow 不是 visible 的 block-box

如果在同一BFC中，会有同向边距折叠和异向边距折叠。在不同的BFC的边距不会发生边距折叠。其实能容纳正常流的都会产生BFC（overflow:visible除外）。

Flex-container是block level box，不是block container，不能产生BFC。
Flex-item是block container，里边产生BFC。

## BFC和Float
```js
<div style="height:500px; background-color:lightgreen; overflow:hidden;">
    <div class="float-box" style="float:right; width:100px; height:100px; background-color: aqua; margin:20px"></div>
    <div class="BFC-test" style="background-color:pink; overflow:hidden;">
        <div style="width:100px; height:90px; background-color:blue; margin:20px;"></div>
        文字 文字 文字 文字 文字
        文字 文字 文字 文字 文字
        文字 文字 文字 文字 文字
        文字 文字 文字 文字 文字
        文字 文字 文字 文字 文字
        文字 文字 文字 文字 文字
    </div>
</div>
```
效果如下：


.BFC-test的overflow为hidden，因此产生了一个BFC，该BFC虽然占据一行，但它的待遇是一个inline行盒待遇，所以会顶到float边上却并不会占据.float-box的位置。

这时，再把.BFC-test的 overflow 改为 visible ，.BFC-test这一层的BFC就消失了，.BFC-test内部的元素跟.float-box成为同一个BFC内部的内容，.BFC-test的区域就会铺到整行，文字会被拆成多行单个的行盒，就有绕排.float-box的效果。
效果如下：

## flex排版
- 收集盒进入行
- 计算盒在主轴方向的排布
- 计算交叉轴方向的排布
