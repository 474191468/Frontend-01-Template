function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    for (const prop in element.computedStyle) {
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/^px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}

function layout(element) {
    if (!element.computedStyle) {
        return 1;
    }
    var elementStyle = getStyle(element);
    if (elementStyle.display !== "flex") {
        return 1;
    }
    var items = element.children.filter((item) => {
        return item.type === "element"
    })

    items.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
    });

    var style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    })

    // 给属性一个默认值
    if (!style.flexDirection || style.flexDirection === "auto") {
        style.flexDirection = "row";
    }
    if (!style.alignItems || style.alignItems === "auto") {
        style.alignItems = "stretch";
    }
    if (!style.justifyContent || style.justifyContent === "auto") {
        style.justifyContent = "flex-start";
    }

    if (!style.flexWrap || style.flexWrap === "auto") {
        style.flexWrap = "nowrap";
    }

    if (!style.alignContent || style.alignContent === "auto") {
        style.alignContent = "stretch";
    }


    //  mainSize, // 主轴size width / height
    //  mainStart, // 主轴起点 left / right / top / bottom
    //  mainEnd, // 主轴终点 left / right / top / bottom
    //  mainSign, // 主轴符号位，用于 是否 reverse +1 / -1
    //  mainBase, // 主轴开始的位置 0 / style.width
    //  crossSize, // 交叉轴size width / height
    //  crossStart, // 交叉轴坐标起点 left / right / top / bottom
    //  crossEnd, // 交叉轴坐标终点 left / right / top / bottom
    //  crossSign, // 交叉轴符号位，用于 是否 reverse +1 / -1
    //  crossBase; // 交叉轴开始的位置 0 / style.width
    var mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    if (style.flexDirection === "row") {
        // 从左往右
        mainSize = "width";
        mainStart = "left";
        mainEnd = "right";
        mainSign = +1;
        mainBase = 0;

        crossSize = "height";
        crossStart = "top";
        crossEnd = "bottom";
    }

    if (style.flexDirection === "row-reverse") {
        // 从右往左
        mainSize = "width";
        mainStart = "right";
        mainEnd = "left";
        mainSign = -1;
        mainBase = 0;

        crossSize = "height";
        crossStart = "top";
        crossEnd = "bottom";
    }

    if (style.flexDirection === "column") {
        //从上到下
        mainSize = "height";
        mainStart = "top";
        mainEnd = "bottom";
        mainSign = +1;
        mainBase = 0;

        crossSize = "width";
        crossStart = "left";
        crossEnd = "right";
    }

    if (style.flexDirection === "column-reverse") {
        //从下到上
        mainSize = "height";
        mainStart = "bottom";
        mainEnd = "top";
        mainSign = -1;
        mainBase = style.height;

        crossSize = "width";
        crossStart = "left";
        crossEnd = "right";
    }

    if (style.flexWrap === "wrap-reverse") {
        var tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }
    // 是否自适应宽度
    var isAutoMainSize = false;
    // 如果父元素容器没有宽度
    if (!style[mainSize]) {
        // 宽度设为默认值0
        elementStyle[mainSize] = 0;
        // 循环计算子元素的宽度相加 变成父元素宽度
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }
    // flexline 当前行 flexlines 共分了多少行
    var flexLine = [];
    var flexLines = [flexLine];

    var mainSpace = elementStyle[mainSize];
    var crossSpace = 0;
    // 计算主轴
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemStyle = getStyle(item);

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }
        // 如果子元素也具备flex属性，直接push进去
        if (itemStyle.flex) {
            flexLine.push(item);
            // 如果父元素容器不许换行，且是自适应宽度
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            // 取子元素最高的元素高度值设置为父元素高度值
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item)
        } else {
            // 当前flex 子项，大于 flex mainSize,自适应
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize]
            }
            // 如果元素总宽度超过父元素宽度，则保存当前行，并且新建行，插入元素
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0
            } else {
                // 未超过父元素容器宽度 mainSpace 继续添加
                flexLine.push(item);
            }
            // 取子元素最高的元素高度值设置为父元素高度值
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === "nowrap" || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }
    // 若剩余空间为负数，等比压缩剩余元素
    if (mainSpace < 0) {
        // 对负的 mainSpace， 所有该行 flex 子项等比例缩放（未设置 flex-shrink 默认值是1，也就是默认所有的 flex 子项都会收缩）
        var scale = style[mainSize] / (style[mainSize] - mainSpace);
        var currentMain = mainBase;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }
            // flex 容器这一行内，flex 子项排布
            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];

            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach(function(items) {
            var mainSpace = items.mainSpace;
            var flexTotal = 0;
            // 找出所有 flex 子项也为 flex 元素
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemStyle = getStyle(item);
                if ((itemStyle.flex !== null) && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }
            // 填充 flexLine 剩余 mainSpace 空间
            if (flexTotal > 0) {
                var currentMain = mainBase;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                // 不存在 flex 子项也为 flex，把主轴方向剩余尺寸按比例分配给这些元素
                if (style.justifyContent === "flex-start") {
                    var currentMain = mainBase;
                    // step 元素间距
                    var step = 0;
                }
                if (style.justifyContent === "flex-end") {
                    var currentMain = mainSpace * mainSign + mainBase;
                    var step = 0;
                }
                if (style.justifyContent === "center") {
                    var currentMain = mainSpace / 2 * mainSign + mainBase;
                    var step = 0;
                }
                if (style.justifyContent === "space-between") {
                    var step = mainSpace / (item.length - 1) * mainSign;
                    var currentMain = mainBase;
                }
                if (style.justifyContent === "space-around") {
                    var step = mainSpace / item.length - 1 * mainSign;
                    var currentMain = step / 2 + mainBase;
                }
                // 循环计算flex子项的位置
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    itemStyle[mainStart, currentMain];
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        })
    }
    // 计算交叉轴
    var crossSpace;
    // 根据每一行最大元素尺寸计算行高
    if (!style[crossSize]) {
        // 交叉轴，crossSize 未设定时默认为 count flexLines 每行最大 crossSpace 之和 
        crossSpace = 0;
        elementStyle[crosssSize] = 0;
        for (var i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
    } else {
        // 如果已设定后，计算出 最终的 crossSpace，为 crossSpace 减去每行最大 crossSpace，剩余空间，用作分配
        crossSpace = style[crossSize];
        for (var i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }

    if (style.flexWrap === "wrap-reverse") {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    var lineSize = style[crossSize] / flexLines.length;
    var step;
    if (style.alignContent === "flex-start") {
        crossBase += 0;
        step = 0;
    }
    if (style.alignContent === "flex-end") {
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    if (style.alignContent === "center") {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }
    if (style.alignContent === "space-between") {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }
    if (style.alignContent === "space-around") {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }
    if (style.alignContent === "stretch") {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(function(items) {
        var lineCrossSize = style.alignContent === "stretch" ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);

            var align = itemStyle.alignSelf || style.alignItems;

            if (itemStyle[crossSize] === null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0
            }

            if (align === "flex-start") {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[corssStart] + crossSign * itemStyle[crossSize];
            }
            if (align === "flex-end") {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[corssEnd] - crossSign * itemStyle[crossSize];;
            }
            if (align === "center") {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[corssStart] + crossSign * itemStyle[crossSize];
            }
            if (align === "stretch") {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
                    itemStyle[crossSize] : lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + step)
    })
    console.log(items);
}

module.exports = layout