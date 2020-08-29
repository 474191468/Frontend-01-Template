var page = require('webpage').create();
page.open('https://baidu.com/', function(status) {
    console.log("Status: " + status);
    if (status === "success") {
        // var body = page.evaluate(function () {
        //   var toString = function (pad, element) {
        //     var children = element.childNodes;
        //     var childrenString = '';
        //     for (var i = 0; i < children.length; i++) {
        //       childrenString += toString(" " + pad, children[i] + "\n");
        //     }
        //     var name;
        //     if (element.nodeType === Node.TEXT_NODE) {
        //       name = "#text" + JSON.stringify(element.textContent);
        //     }
        //     if (element.nodeType === Node.ELEMENT_NODE) {
        //       name = element.tagName
        //     }
        //     return pad + element.tagName + (children.length ? "\n" + childrenString : "");
        //   }
        //   return toString("", document.body);
        // });
        console.log('Page body is ' + document.body.children);
    }
    phantom.exit();
});