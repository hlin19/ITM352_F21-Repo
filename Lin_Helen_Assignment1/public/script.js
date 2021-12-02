//create xmlhttprequest
var xmlhttp = new XMLHttpRequest();
var url = "Boba_Product.json";
//check status
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var product = JSON.parse(this.responseText);

    console.log(product);
  }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();
