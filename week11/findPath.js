function sleep(t) {
    return new Promise(function(resolve) {
        setTimeout(resolve, t);
    });
}
class Sorted {
    constructor(data, compare) {
        this.data = data.slice();
        this.compare = compare || ((a, b) => a - b);
    }
    take() {
        if (!this.data.length) {
            return;
        }
        let min = this.data[0];
        let minIndex = 0;
        for (let i = 1; i < this.data.length; i++) {
            if (this.compare(this.data[i], min) < 0) {
                min = this.data[i];
                minIndex = i;
            }
        }
        this.data[minIndex] = this.data[this.data.length - 1];
        this.data.pop();
        return min
    }
    insert(v) {
        this.data.push(v);
    }
    get length() {
        return this.data.length;
    }
}

class BinaryHeap {
    constructor(data, compare) {
        this.data = data.slice();
        this.compare = compare || ((a, b) => a - b);
    }
    take() {
        if (!this.data.length) {
            return;
        }
        let min = this.data[0];
        let i = 0;
        //填充空位
        while (i < this.data.length) {
            if (i * 2 + 1 >= this.data.length) {
                break;
            }
            if (i * 2 + 2 >= this.data.length) {
                this.data[i] = this.data[i * 2 + 1];
                i = i * 2 + 1;
                break;
            }
            if (this.compare(this.data[i * 2 + 1], this.data[i * 2 + 2]) < 0) {
                this.data[i] = this.data[i * 2 + 1];
                i = i * 2 + 1;
            } else {
                this.data[i] = this.data[i * 2 + 2];
                i = i * 2 + 2;
            }
        }
        if (i < this.data.length - 1) {
            this.insertAt(i, this.data.pop());
        } else {
            this.data.pop()
        }
        return min;
    }
    insertAt(i, v) {
        this.data[i] = v;
        while (i > 0 && this.compare(v, this.data[Math.floor((i - 1) / 2)]) < 0) {
            this.data[i] = this.data[Math.floor((i - 1) / 2)];
            this.data[Math.floor((i - 1) / 2)] = v;
            i = Math.floor((i - 1) / 2);
        }
    }
    insert(v) {
        this.insertAt(this.data.length, v);
    }
    get length() {
        return this.data.length;
    }
}
// 1 寻找起点的上下左右，然后再寻找其他点的上下左右
// 深度优先搜索。广度优先搜索
// 本次搜索为一层一层的搜索，适合广度优先搜索
async function path(map, start, end) {
    map = Object.create(map);

    function distance([x, y]) {
        return (x - end[0]) ** 2 + (y - end[1]) ** 2;
    }
    // 无脑搜索
    // let queue = [start];

    // 动态计算结果处，向结果处搜索
    // let clloection = new Sorted([start], (a, b) => distance(a) - distance(b));
    // 大顶堆优化性能
    let clloection = new BinaryHeap([start], (a, b) => distance(a) - distance(b));
    container.children[start[0] * 100 + start[1]].style.backgroundColor = "green";
    container.children[end[0] * 100 + end[1]].style.backgroundColor = "red";
    async function insert([x, y], pre) {
        if (map[100 * y + x] !== 0) {
            return;
        }
        if (x < 0 || y < 0 || x >= 100 || y >= 100) {
            return;
        }
        // 存储当前插入节点的上一个来源，方便查出最短路径
        map[100 * y + x] = pre;
        container.children[y * 100 + x].style.backgroundColor = "lightgreen";
        await sleep(1)
        // queue.push([x, y]);
        clloection.insert([x, y])
    }
    // while (queue.length) {
    while (clloection.length) {
        // 两种模拟队列的方式 1. push shift 2. pop unshift
        // 由于入队比较频繁选择push shift
        // let [x, y] = queue.shift();
        let [x, y] = clloection.take();
        if (x === end[0] && y === end[1]) {
            let path = [];
            while (x !== start[0] || y !== start[1]) {
                path.push([x, y]);
                await sleep(5);
                container.children[y * 100 + x].style.backgroundColor = "pink";
                // 找出当前位置的上一个来源，递归查找上上一个。。
                [x, y] = map[y * 100 + x];
            }
            return path;
        }
        // 边界情况 1. 边界处 x,y 小于0 || 大于100 2. 已经被渲染了
        await insert([x - 1, y], [x, y]); // 左
        await insert([x + 1, y], [x, y]); // 右
        await insert([x, y - 1], [x, y]); // 上
        await insert([x, y + 1], [x, y]); // 下
        // 斜线
        await insert([x - 1, y - 1], [x, y]);
        await insert([x + 1, y - 1], [x, y]);
        await insert([x - 1, y + 1], [x, y]);
        await insert([x + 1, y + 1], [x, y]);
    }
    return null;
}