
class Timeline {
    constructor(){
        this.animations = [];
        this.requestId = null;
        this.state = "inited";
        this.tick = () => {
            let t = Date.now() - this.startTime;
            // 停止t的循环
            let animations = this.animations.filter(animation => !animation.finished);
            for(let animation of this.animations) {
                let {object, property, template, start, end, duration, timingFunction, delay, startTime} = animation;
                let progression = timingFunction((t - delay - startTime) / duration);
                if(t > duration + delay + startTime) {
                    progression = 1;
                    animation.finished = true;
                    // continue;
                }
    
    
                let value = animation.valueFromProgression(progression);
                object[property] = template(value)
            }
            if(animations.length){
                this.requestId = requestAnimationFrame(this.tick);
            }
        }
    }

    pause() {
        if(this.state !== "playing") {
            return
        }
        this.state = "paused";
        // 记录当前暂停的时间戳
        this.pauseTime = Date.now();
        if(this.requestId !== null) {
            cancelAnimationFrame(this.requestId)
        }
    }

    resume() {
        if(this.state !== "paused") {
            return
        }
        this.state = "playing";
        // 去掉暂停的时间
        this.startTime += Date.now() - this.pauseTime; 
        this.tick();
    }

    start() {
        if(this.state !== "inited") {
            return
        }
        this.state = "playing";
        this.startTime = Date.now();
        this.tick();
    }

    restart() {
        if(this.state === "playing") {
            this.pause();
        }
        this.animations = [];
        this.requestId = null;
        this.state = "playing";
        this.startTime = Date.now();
        this.pauseTime = null;
        this.tick()
    }

    add(animation, startTime) {
        this.animations.push(animation);
        animation.finished = false;
        if(this.state === "playing") {
            animation.startTime = startTime !== void 0 ? startTime : Date.now() - this.startTime;
        } else {
            animation.startTime = startTime !== void 0 ? startTime : 0;
        }
    }
}
class Animation {
    constructor(object, property, template, start, end, duration, delay, timingFunction){
        this.object = object;
        this.property = property;
        this.template = template;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction || ((start, end) => {
            return (t) => start + (t / duration) * (end - start)
        })
    }
    valueFromProgression(progression) {
        return this.start + progression * (this.end - this.start)
    }
}


class ColorAnimation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
        this.property = property;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction;
    }
    valueFromProgression(progression) {
        return {
            r: this.start.r + progression * (this.end.r - this.start.r),
            g: this.start.g + progression * (this.end.g - this.start.g),
            b: this.start.b + progression * (this.end.b - this.start.b),
            a: this.start.a + progression * (this.end.a - this.start.a),
        }
    }
}