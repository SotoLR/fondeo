create database prueba;
-- psql prueba;

CREATE TABLE usuarios(
	uid serial primary key,
	saldo real NOT NULL,
	secret VARCHAR(64) NOT NULL --SHA256 hashes are 64 chars long
);

CREATE TABLE oportunidades(
	uid serial primary key,
	total real NOT NULL
);

CREATE TABLE usuario_oportunidad(
	id_usuario serial references usuarios(uid),
	id_oportunidad serial references oportunidades(uid),
	cantidad real
);

-- below this is not done