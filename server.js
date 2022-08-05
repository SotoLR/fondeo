const http = require('http');

http.createServer((request, response) => {
  const { headers, method, url } = request;

  if(method === 'POST'){
    let body = []
    switch(url){
      case '/invertir':
        request.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {

          response.on('error', (err) => {
            console.error(err);
          });

          console.log(body);

          body = Buffer.concat(body).toString();

          const params = JSON.parse(body);

          response.writeHead(201, {
            'Content-Type': 'application/json'
          });

          const responseBody = {
            headers,
            body,
            params
          }

          response.end(body);
        });
      break;
      case '/login':
      break;
      case '/renovar':
      break;
      default:
        response.statusCode = 404;
        response.end();
      break;
    }
  }else if(method === 'GET'){
    switch(url){
      case '/test':
      break;
      default:
        response.statusCode = 404;
        response.end();
      break;
    }
  }else{
    response.statusCode = 404;
    response.end();
  }
}).listen(8080);

/*
response.setHeader('Content-Type', 'application/json');
response.statusCode(404);

OR

response.writeHead(200, {
  'Content-Type': 'application/json',
  'X-Powered-By': 'bacon'
});

response.write({
	status: 'OK',
	details: 'Everything was done correctly'
})

*/