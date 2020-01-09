var backendURL = "http://localhost:8081"


function loadContent(){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", backendURL + "/provider/api", false ); // false for synchronous request
  xmlHttp.send( null );
  document.getElementById("content").innerHTML = xmlHttp.responseText;
}

async function asyncLoadContent() {
  var wrapped = function(){
    return new Promise(resolve => {
      loadContent();
    });
  }
  const result = await wrapped();
}

document.addEventListener('DOMContentLoaded', function () {
  asyncLoadContent();
});
