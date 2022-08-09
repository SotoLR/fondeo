create database prueba;
-- psql prueba;
-- \c prueba;
-- create table prueba.usuarios?

CREATE TABLE usuarios(
	uid serial primary key,
	saldo real NOT NULL CHECK (saldo >=0),
	secret VARCHAR(64) NOT NULL --SHA256 hashes are 64 chars long
);

CREATE TABLE oportunidades(
	uid serial primary key,
	total real NOT NULL,
	restante real NOT NULL CHECK (restante >= 0)
);

--add default to restante??

CREATE TABLE usuario_oportunidad(
	id_usuario serial references usuarios(uid),
	id_oportunidad serial references oportunidades(uid),
	cantidad real
);

-- below this is not done

CREATE TABLE tst(
	uid serial primary key,
	saldo real NOT NULL CHECK (saldo >=0)
);