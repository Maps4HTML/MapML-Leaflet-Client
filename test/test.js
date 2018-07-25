const http = require("http");
const jsdom = require("jsdom"),
      { JSDOM } = jsdom;
const fs = require('fs'),
    path = require('path');

http.createServer(function (request, response) {

  const { headers, method, url } = request;
  var filePath = path.join(__dirname, 'time_input_test/tiles_with_time.mapml');
  const today = new Date();
  const future = new Date();
  const farfuture = new Date();
  future.setDate(today.getDate()+5);
  farfuture.setDate(today.getDate()+10);
  if (url === "/tiles") {
    const tilemapml = fs.readFileSync(filePath, {encoding: 'utf-8'});
    const dom = new JSDOM(tilemapml,{contentType: "text/xml"});
    
    dom.window.document.querySelector("select[name=time] > *:nth-child(1)").setAttribute('value',today.toISOString());
    dom.window.document.querySelector("select[name=time] > *:nth-child(1)").textContent =today.toISOString();
    dom.window.document.querySelector("select[name=time] > *:nth-child(2)").setAttribute('value',future.toISOString());
    dom.window.document.querySelector("select[name=time] > *:nth-child(2)").textContent =future.toISOString() ;
    dom.window.document.querySelector("select[name=time] > *:nth-child(3)").setAttribute('value',farfuture.toISOString());
    dom.window.document.querySelector("select[name=time] > *:nth-child(3)").textContent =farfuture.toISOString();
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.writeHead(200, {'Content-Type': 'text/mapml'});
    response.end(toMapMLString(dom.window.document.firstChild));
  } else if (url === "/images") {
    filePath = path.join(__dirname, 'time_input_test/images_with_time.mapml');
    const imagemapml = fs.readFileSync(filePath, {encoding: 'utf-8'});
    const dom = new JSDOM(imagemapml,{contentType: "text/xml"});
    
    dom.window.document.querySelector("input[name=utc]").setAttribute('min',today.toISOString());
    dom.window.document.querySelector("input[name=utc]").setAttribute('max',future.toISOString());
    dom.window.document.querySelector("input[name=utc]").setAttribute('value',today.toISOString());
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.writeHead(200, {'Content-Type': 'text/mapml'});
    response.end(toMapMLString(dom.window.document.firstChild));
  } else {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('Not found');
  }
  function toMapMLString(node) {
    let nodeString = "";
    if (node.nodeType === 1) {
      const children = node.childNodes;
      nodeString += "<" + node.nodeName + (node.attributes ? (" " + toAttributeString(node.attributes)) : "") + (children.length > 0 ? ">" : "/>");
      for (let i=0;i<children.length;i++) {
        nodeString += toMapMLString(children[i]);
      }
      nodeString += (children.length > 0 ? "</" + node.nodeName + ">" : "");
    } else if (node.nodeType === 3 ) {
      nodeString += node.nodeValue.replace(/&/g,'&amp;');
    }
    return nodeString;
    function toAttributeString(attributes) {
      let attString = "";
       for(let i = attributes.length - 1; i >= 0; i--) {
         attString += attributes[i].name + "=\"" + attributes[i].value.replace(/&/g,'&amp;') + "\" ";
       }
       return attString;
    }
  }
  
}).listen(8080);

// Console will print the message
console.log('Server running at http://127.0.0.1:8080/');