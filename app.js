(function () {
    let url = new URL(location.href);
    if (!url.pathname.endsWith(".java")) {
        // only works for java content right now.
        return;
    }
    injectCSS();
    injectWindow();
})();

function injectWindow() {
    let pageNode = document.getElementById("page");
    createItems().then(frame =>
        pageNode.appendChild(frame)
    );
}

function injectCSS() {
    let cssNode = document.createElement("link");
    cssNode.rel = "stylesheet";
    cssNode.type = "text/css";
    cssNode.href = browser.runtime.getURL("app.css");
    document.head.appendChild(cssNode);
}

async function createItems() {
    let frame = document.createElement("ul");
    let callback = function (items) {
        items.forEach(function (item) {
            frame.append(item);
        });
    };
    let content = document.getElementById("content");
    createClassItemsAsync(content).then(callback);
    createMethodItemsAsync(content).then(callback);
    frame.className = "ext_frame";
    return frame
}


async function createMethodItemsAsync(content) {
    let methods = document.getElementsByClassName("xmt");
    let clsList = [];
    for (var i = 0; i < methods.length; i = i + 2) {
        let method = methods[i];
        let node = document.createElement("li");
        node.className = "ext_item_mt ext_item";
        node.innerHTML +=
            "<span>" +
            method.name + "()" + parseMethodReturnType(method) +
            "</span>";
        clsList.push(node);
        node.onclick = function () {
            content.scrollTop = method.offsetTop;
        };
    }
    return clsList;
}


function parseMethodReturnType(methodNameNode) {
    const accessSet = new Set(["public", "private", "protected"]);

    var node = methodNameNode;
    var returnType = "";
    var access = "";

    while (node.className !== ("l") && node.className !== ("hl")) {
        // traverse from end until reach a line number node
        node = node.previousElementSibling
    }
    node = node.nextElementSibling;
    while (node != methodNameNode) {
        if (returnType === ""
            && node.innerHTML !== "abstract"
            && node.innerHTML !== "static"
            && !accessSet.has(node.innerHTML)) {
            returnType = node.innerHTML;
        }
        if (access === "" && accessSet.has(node.innerHTML)) {
            access = node.innerHTML;
        }
        node = node.nextElementSibling;
    }
    return returnType === "" ? "" : ":" + returnType;
}

async function createClassItemsAsync(content) {
    let clsses = document.getElementsByClassName("xc");
    let clsList = [];
    for (var i = 0; i < clsses.length; i = i + 2) {
        let elem = clsses[i];
        let node = document.createElement("li");
        node.className = "ext_item_cls ext_item";
        node.innerHTML +=
            "<span>" +
            elem.name +
            "</span>";
        clsList.push(node);
        node.onclick = function () {
            content.scrollTop = elem.offsetTop;
        };
    }
    return clsList;
}

