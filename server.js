const http = require('http');
// const url = require('url');
// const { Pool, Client } = require('pg');
const { Pool } = require('pg');

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'fondeo',
	port: 5432
});

const registrarInversion = async (usuario, oportunidad, inversion) => {
	const client = await pool.connect();
	let status = {};
	try{
		await client.query('BEGIN');

		const query_update_usuario = 'UPDATE usuarios SET saldo = saldo - $2 WHERE uid = $1';
		const query_update_oportunidad = 'UPDATE oportunidades set restante = restante - $2 where uid = $1';
		const query_insert_relacion = 'INSERT INTO usuario_oportunidad (id_usuario, id_oportunidad, cantidad) VALUES ($1, $2, $3)';

		await client.query(query_update_usuario, [usuario, inversion]);
		await client.query(query_update_oportunidad, [oportunidad, inversion]);
		await client.query(query_insert_relacion, [usuario, oportunidad, inversion]);

		await client.query('COMMIT');
		//http_status, status_code, status_detail
		status = {http_status: 201, status_code: 'OK', status_detail: 'Inversion agregada correctamente'};
	}catch(e){
		console.log(`ERROR AL REGISTRAR INVERSION: ID usario: ${usuario} | ID oportunidad: ${oportunidad} | inversion: ${inversion} `);
		console.log(e);
		switch(e.table){
			case 'usuarios':
				//handle 
				if(e.constraint && e.constraint == 'usuarios_saldo_check'){
					// console.log('Not enough money')
					status = {http_status: 400, status_code: 'E10', status_detail: 'El  usuario no tiene suficiente saldo para invertir en esta oportunidad'};
				}else{
					// console.log('unknown error modifying usuario')
					status = {http_status: 500, status_code: 'E11', status_detail: 'Error desconocido al modificar el saldo del usuario'};
				}
			break;
			case 'oportunidades':
				if(e.constraint && e.constraint == 'oportunidades_restante_check'){
					// console.log('overfunded')
					status = {http_status: 400, status_code: 'E20', status_detail: 'La oportunidad elegida requiere menos fondos de los que el usuario quiere invertir'};
				}else{
					console.log('unkown error modifying oportunidad')
					status = {http_status: 500, status_code: 'E21', status_detail: 'Error desconocido al modificar datos de la oportunidad'};
				}
				//handle
			break;
			case 'usuario_oportunidad':
				//handle insert failure
				// console.log('error inserting relation')
				status = {http_status: 500, status_code: 'E30', status_detail: 'Error al registrar la inversión'};
			break;
			default:
				//handle all other errors
				console.log('unkown query error')
				status = {http_status: 500, status_code: 'E90', status_detail: 'Error desconocido'};
			break;
		}
		await client.query('ROLLBACK');
	}finally{
		client.release();
		return status;
	}
}

http.createServer((request, response) => {
	const { headers, method, url } = request;

	request.on('error', (err)=>{
		console.log(err);
		response.statusCode = 400;
		response.end();
	});

	if(method === 'POST'){
		let body = []
		switch(url){
			case '/invertir':
				request.on('data', (chunk) => {
					body.push(chunk);
				}).on('end', async () => {

					body = Buffer.concat(body).toString();

					response.on('error', (err) => {
						console.error(err);
					});

					// console.log(body);

					const params = JSON.parse(body);

					const {http_status, status_code, status_detail} = await registrarInversion(params.usuario, params.oportunidad, params.cantidad);

					response.writeHead(http_status, {
						'Content-Type': 'application/json'
					});

					response.end(JSON.stringify({
						"codigo" : status_code,
						"detalle" : status_detail
					}));
				});
			break;
			case '/login':
				response.statusCode = 501;
				response.end();
			break;
			case '/renovar':
				response.statusCode = 501;
				response.end();
			break;
			default:
				response.statusCode = 404;
				response.end();
			break;
		}
	}else{
		response.statusCode = 405;
		response.end();
	}
}).listen(8080);
