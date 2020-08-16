
export class Timeline {
    constructor() {
        this.animations = new Set();
        this.finishedAnimations = new Set();
        this.requestId = null;
        this.addTimes = new Map();
        this.state = "inited";
        this.tick = () => {
            let t = Date.now() - this.startTime;
            // 停止t的循环
            // let animations = this.animations.filter(animation => !animation.finished);
            for (let animation of this.animations) {

                let { object, property, template, start, end, duration, timingFunction, delay } = animation;
                let addTime = this.addTimes.get(animation);

                if(t < delay + addTime) {
                    continue
                }

                let progression = timingFunction((t - delay - addTime) / duration);

                if (t > duration + delay + addTime) {
                    progression = 1;
                    this.animations.delete(animation);
                    this.finishedAnimations.add(animation);
                }


                let value = animation.valueFromProgression(progression);

                object[property] = template(value)
            }
            if (this.animations.size) {
                this.requestId = requestAnimationFrame(this.tick);
            } else {
                this.requestId = null;
            }
        }
    }

    pause() {
        if (this.state !== "playing") {
            return
        }
        this.state = "paused";
        // 记录当前暂停的时间戳
        this.pauseTime = Date.now();
        if (this.requestId !== null) {
            cancelAnimationFrame(this.requestId);
            this.requestId = null;
        }
    }

    resume() {
        if (this.state !== "paused") {
            return
        }
        this.state = "playing";
        // 去掉暂停的时间
        this.startTime += Date.now() - this.pauseTime;
        this.tick();
    }

    start() {
        if (this.state !== "inited") {
            return
        }
        this.state = "playing";
        this.startTime = Date.now();
        this.tick();
    }

    reset() {
        if (this.state === "playing") {
            this.pause();
        }
        this.animations = new Set();
        this.finishedAnimations = new Set();
        this.requestId = null;
        this.addTimes = new Map();
        this.state = "inited";
        this.startTime = Date.now();
        this.pauseTime = null;
        // this.tick()
    }

    restart() {
        if (this.state === "playing") {
            this.pause();
        }

        for(let animation of this.finishedAnimations) {
            this.animations.add(animation);
        }
        this.finishedAnimations = new Set();
        this.requestId = null;
        // this.addTimes = new Map();
        this.state = "playing";
        this.startTime = Date.now();
        this.pauseTime = null;
        this.tick()
    }

    add(animation, addTime) {
        this.animations.add(animation);
        if(this.state === "playing" && this.requestId === null) {
            this.tick()
        }
        if (this.state === "playing") {
            this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime)
        } else {
            this.addTimes.set(animation, addTime !== void 0 ? addTime : 0)
        }
    }
}
export class Animation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.template = template;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction;
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