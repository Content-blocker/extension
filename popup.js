var backendURL = "http://localhost:8081"

function addBlockContent(){
    document.getElementById("sub_status").innerHTML = "Working on it.";

    var entity = document.getElementById("entity").value;
    var relatedterm = document.getElementById("relatedterm").value;

    if(entity.length < 2 || relatedterm.length < 2){
        document.getElementById("sub_status").innerHTML = "Entity and related term must each be 2 characters or more.";
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", backendURL + "/provider/api/addBlockContent?entity=" + entity + "&relatedterm=" + relatedterm);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var content = JSON.parse(xhr.responseText);
          document.getElementById("sub_status").innerHTML = content["STATUS"];
        } else {
          document.getElementById("sub_status").innerHTML = "Error:" + xhr.statusText;
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      document.getElementById("sub_status").innerHTML = "Error:" + xhr.statusText;
      console.error(xhr.statusText);
    };
    xhr.send(null);
}

function loadBlockContent(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", backendURL + "/provider/api/getBlockContent");
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var content = JSON.parse(xhr.responseText);
          var html = "";
          for(var i=0;i<content.length; ++i){
            html += "<p>" + content[i]["entry_id"] + " -- " + content[i]["entity"] + " : " + content[i]["related_term"] + "<p>"
          }
          document.getElementById("content").innerHTML = html;
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

function afterLoad(){
    loadBlockContent();

    document.getElementById("submit").addEventListener("click", function () {
      addBlockContent();
    });
}

document.addEventListener('DOMContentLoaded', function () {
  afterLoad();
});


