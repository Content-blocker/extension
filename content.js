var backendURL = "http://localhost:8081"
var backendURL2 = "http://localhost:8082"

function blockElement(e, fill){
    e.innerHTML = fill;
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