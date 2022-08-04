use prueba;

CREATE TABLE usuarios(
	uid serial primary key,
	saldo real,
	secret_hash VARCHAR(64)
);

CREATE TABLE oportunidades(
	uid serial primary key,
	total real
);

CREATE TABLE usuario_oportunidad(
	id_usuario serial references usuarios(uid),
	id_oportunidad serial references oportunidades(uid),
	cantidad real
);

INSERT INTO usuarios VALUES ();
