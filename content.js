var backendURL = "http://localhost:8081"
var backendURL2 = "http://localhost:8082"

function blockElement(e, fill){
    e.innerHTML = fill;
}

function containsKW(keywords, string) {
    //returns true if a keyword in keywords array is in string
    string = string.replace(/[^A-Za-z]/g, '');
    string = string.toUpperCase();
    for (var i = 0; i < keywords.length; ++i) {
        var curKW = keywords[i].toUpperCase();
        curKW = curKW.replace(/[^A-Za-z]/g, '');
        //to dvoje removamo, keywordi so lahko preprocessani v upperstring, brez ostalih simbolov
        if (string.includes(curKW)) {
            return true;
        }
    }
    return false;
}

function getTextNodes(doc) {
    //returns all text nodes, doc= document.body for start
    var returnAr = [];
    var children = doc.childNodes;
    for (var i = 0; i < children.length; ++i) {
        if (children[i].hasChildNodes() && children[i].tagName != 'script') {
            returnAr = returnAr.concat(getTextNodes(children[i]));
        }
        if (children[i].nodeType == 3) {
            returnAr.push(children[i]);
        }
    }
    return returnAr;
}

function processTextNodes(keywords, doc) {
    //returns array of text nodes to be cenzured
    var textNodes = getTextNodes(doc);
    var ar = [];
    for (var i = 0; i < textNodes.length; ++i) {
        if (containsKW(keywords, textNodes[i].textContent)) {
            ar.push(textNodes[i]);
        }
    }
    return ar; //now decide how to cenzure this array (possibly get parent)
}

function recBlock(e, content, fill){
    var nodes = e.childNodes;
    for(var i=0;i<nodes.length;++i){
        var cnode = nodes[i];
        if(cnode.nodeType == 3){
            for(var j=0;j<content.length;++j){
                if(cnode.data.replace(/[^0-9a-z]/gi, '').toLowerCase().includes(content[j].replace(/[^0-9a-z]/gi, '').toLowerCase())){
                    blockElement(e, fill);
                }
            }
        }
        if(cnode.nodeType == 1){
            for(var j=0;j<content.length;++j){
                var text1 = cnode.innerText.replace(/[^0-9a-z]/gi, '').toLowerCase();
                var text2 = cnode.textContent.replace(/[^0-9a-z]/gi, '').toLowerCase();
                var string = content[j].replace(/[^0-9a-z]/gi, '').toLowerCase();
                if(text1.includes(string) || text2.includes(string)){
                    recBlock(cnode, content, fill);
                }
            }
        }
    }
}

function blockContent(content, fill){
   recBlock(document.body, content, fill)
}

function makeQuery(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", backendURL2 + "/ai/api/block");
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var content = JSON.parse(xhr.responseText);
          blockContent(content.map(e => e["block"]), "BLOCKEDBYAI");
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
}

function executeContentBlocker(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", backendURL + "/provider/api/getBlockContent");
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var content = JSON.parse(xhr.responseText);
          blockContent(content.map(e => e["related_term"]), "BLOCKEDBLOCKEDBLOCKED");
          makeQuery();
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
}



window.onload = function() {
	executeContentBlocker();
}