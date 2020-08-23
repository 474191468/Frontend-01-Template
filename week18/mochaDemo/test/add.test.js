const assert = require('assert');
// const add = require("../src/add");
import {add} from "../src/add";
// import assert from "assert";
// const ava = require("ava");

describe("add", function() {
    it('should return -1 when the value is not present', function() {
        assert.equal(add(3, 4), 7)
    });
})

// ava("add", t => {
//     if (add.add(3, 4) === 7) {
//         t.pass()
//     }
// })