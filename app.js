var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var server = http.createServer();
server.on('request', doRequest);
server.listen(1337);

function doRequest(req, res) {
  var path = url.parse(req.url);
  switch(path.pathname) {

    case '/':
      fs.readFile('./index.html', 'UTF-8', function(err, data) {
        var result = data.replace(/@@@@@/, '');
        res.setHeader('Content-type', 'text/html');
        res.write(result);
        res.end();
      });
    break;

    case '/form':
      if (req.method == "POST") {
        var reqBody = '';
        req.on('data', function(data) {
          reqBody += data;
        });
        req.on('end', function() {
          var form = qs.parse(reqBody);
          var text = form.text;
          fs.readFile('./index.html', 'UTF-8', function(err, data) {
            var result = data.replace(/@@@@@/, '入力した内容は' + text + 'です。');
            res.setHeader('Content-type', 'text/html');
            res.write(result);
            res.end();
          });
        });
      } else {
        res.setHeader('Content-type', 'text/html');
        res.end("ERROR! CAN'T GET");
      }
    break;

    default:
    res.setHeader('Content-type', 'text/html');
    res.end("ERROR! NOT FOUND");
    break;
  }
}
console.log('Server running at http://127.0.0.1:1337/');
