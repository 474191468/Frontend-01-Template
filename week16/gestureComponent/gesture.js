export function enableGesture(element) {
    let contexts = Object.create(null);

    let MOUSE_SYMBOL = Symbol("mouse");

    // 判断是pc还是移动端 非触屏为undefined 触屏为null
    if (document.ontouchstart !== null) {
        element.addEventListener('mousedown', (event) => {
            contexts[MOUSE_SYMBOL] = Object.create(null);
            start(event, contexts[MOUSE_SYMBOL]);
            let mousemove = event => {
                move(event, contexts[MOUSE_SYMBOL]);
            }
            let mouseend = event => {
                end(event, contexts[MOUSE_SYMBOL]);
                document.removeEventListener("mousemove", mousemove);
                document.removeEventListener("mouseup", mouseend);
            }

            document.addEventListener("mousemove", mousemove);
            document.addEventListener("mouseup", mouseend);
        })
    }


    element.addEventListener("touchstart", event => {
        for (let touch of event.changedTouches) {
            contexts[touch.indentifier] = Object.create(null);
            start(touch, contexts[touch.indentifier]);
        }
    })

    element.addEventListener("touchmove", event => {
        for (let touch of event.changedTouches) {
            move(touch, contexts[touch.indentifier]);
        }
    })

    element.addEventListener("touchend", event => {
        for (let touch of event.changedTouches) {
            end(touch, contexts[touch.indentifier]);
            delete contexts[touch.indentifier]
        }
    })

    element.addEventListener("touchcancel", event => {
        for (let touch of event.changedTouches) {
            cancel(touch, contexts[touch.indentifier]);
            delete contexts[touch.indentifier]
        }
    })

    let start = (point, context) => {
        element.dispatchEvent(Object.assign(new CustomEvent('start'), {
            startX: point.clientX,
            startY: point.clientY,
            clientX: point.clientX,
            clientY: point.clientY
        }))
        context.startX = point.clientX;
        context.startY = point.clientY;
        context.moves = []
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.timoutHandler = setTimeout(() => {
            if (context.isPan) {
                return;
            }
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            // element.dispatchEvent(new CustomEvent('pressstart', {}))
        }, 500);
    }

    let move = (point, context) => {
        let dx = point.clientX - context.startX,
            dy = point.clientY - context.startY;

        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            // if (context.isPress) {
            //     element.dispatchEvent(Object.assign(new CustomEvent('presscancel'), {}))
            // }
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            element.dispatchEvent(Object.assign(new CustomEvent('panstart'), {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY
            }))
        }

        if (context.isPan) {
            context.moves.push({
                dx,
                dy,
                t: Date.now()
            })
            context.moves = context.moves.filter(record => Date.now() - record.t < 300);
            let e = new CustomEvent('pan')

            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY
            })
            element.dispatchEvent(e)
        }
    }

    let end = (point, context) => {
        if (context.isPan) {
            let dx = point.clientX - context.startX,
                dy = point.clientY - context.startY;
            let record = context.moves[0];
            let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t);
            let isFlick = speed > 2.5;

            if (isFlick) {
                element.dispatchEvent(Object.assign(new CustomEvent('flick'), {}))
            }
            element.dispatchEvent(Object.assign(new CustomEvent('panend'), {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                speed: speed,
                isFlick: isFlick
            }))
        }
        if (context.isTap) {
            element.dispatchEvent(Object.assign(new CustomEvent('tap'), {}))
        }
        if (context.isPress) {
            element.dispatchEvent(Object.assign(new CustomEvent('pressend'), {}))
        }
        clearTimeout(context.timoutHandler)
    }

    let cancel = (point, context) => {
        element.dispatchEvent(Object.assign(new CustomEvent('canceled'), {}))
        clearTimeout(context.timoutHandler)
    }
}