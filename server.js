const http = require('http');
// const url = require('url');
// const { Pool, Client } = require('pg');
const { Client } = require('pg');

const getDBClient = () => {
	return new Client({
		user: 'postgres',
		host: 'localhost',
		database: 'postgres',
		password: 'fondeo',
		port: 5432
	});
}

http.createServer((request, response) => {
	const { headers, method, url } = request;

	request.on('error', (err)=>{
		console.log(err);
		response.statusCode = 400;
		response.end();
	})

	if(method === 'POST'){
		let body = []
		switch(url){
			case '/invertir':
				// const db_client = getDBClient();
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

					const response_body = {
						headers,
						body,
						params
					}

					response.end(response_body);
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
		// const query_obj = url.parse(url, true).query;
		switch(url){
			case '/test':
				const db_client = getDBClient();
				db_client.connect();
				db_client.query('SELECT count(uid) from usuarios', (err, res) => {
					// console.log(err, res);
					if(err){
						console.log(err.stack);
						response.statusCode = 500;
						response.end();
					}else{
						response.writeHead(200, {
							'Content-Type': 'application/json'
						});
						const response_body = {
							query_data: res.rows
						}
						response.end(JSON.stringify(response_body));
					}
					db_client.end();
				});
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