// mocha 不能使用 export 语法
// 目前的export是配合nyc 使用的
// 利用了@istanbuljs/nyc-config-babel 插件
export function add(a, b) {
    return a + b;
}

// module.exports.add = add;