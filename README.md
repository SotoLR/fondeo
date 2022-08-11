# Prueba para FD

## Requerimientos

- [Node Package Manager](https://www.npmjs.com/)
	- Versión para Windows 6.14.15
- [Node.js](https://nodejs.org/en/)
	- Versión para Windows 14.18.1
	- La única dependencia que se usa es el módulo _pg_. Se puede instalar con el siguiente comando

		`npm install pg`
- [PostgreSQL](https://www.postgresql.org/download/)
	- Versión 10.21

### Requerimientos opcionales

- Python 3.7+
	- Su único uso es generar datos de prueba para ingresar en la base de datos. Como alternativa, se puede usar el script _insert_data.sql_.

## Primer arranque de la base de datos

1. Asegurarse de tener los requerimientos instalados
	- Para esta prueba, en la base de datos se usaron el nombre de usuario 'postgres' y la contraseña 'fondeo'. Esto se refleja en la función _getDBClient_ del archivo _server.js_
2. Inicializar la base de datos y correr el script _create_db.sql_
3. Ingresar datos de prueba en la base de datos
	1. Si se desean generar datos nuevos para ingresar, proseguir al paso 3.2. Si se desean usar los mismos datos con los que se hicieron pruebas, saltar al paso 3.3.
	2. Correr el script _generate_db_data.py_. Como el script imprime directo al a consola, se sugiere correrlo de la siguiente manera:
		
		`python gerenerate_db_data.py > insert_data.sql`
		- Esto generará un script SQL para insertar 20 usuarios y 10 oportunidades. 
    	- Cada oportunidad tendrá una meta de inversión de entre $1 y $1000.
    	- Cada usuario tendrá un presupuesto de entre $100 y $1000
    3. Correr el script _insert_data.sql_ (o el que se haya creado con el script de Python)
    	- El comentario al final de cada sentencia de inserción de usuario es la contraseña antes de que se ejecute el hash
    	- El algoritmo hash usado para esconder la contraseña es sha256

## Uso

1. Correr el servidor de NodeJS con el siguiente comando

	`node server.js`

2. Hacer peticiones a los endpoints disponibles en el puerto local 8080

### Peticiones disponibles:
#### /invertir
##### Tipo: POST
##### Cuerpo 
```JSON
{
    "usuario": 1,
    "oportunidad": 3,
    "cantidad": 1000
}
```
Evidentemente, se deben remplazar los valores de cada campo con los valores deseados para la operación.
- El valor del campo 'usuario' es el ID del usuario que desea invertir en una oportunidad.
- El valor del campo 'oportunidad' es el ID de la oportunidad en la que desea invertir.
- El valor del campo 'cantidad' es la cantidad que el usuario desea invertir en la oportunidad.
- Todos los campos esperan valores tipo numérico, con los primeros dos siendo un número completo y el último siendo un número flotante.
##### Respuesta esperada
```JSON
{
    "codigo": "",
    "detalle": ""
}
```
##### Interpretación

La respuesta esperada contiene 2 campos: el código y el detalle.

De momento, existen 7 códigos de estatus que puede presentar este endpoint. Este código es diferente al estatus de la petición HTTP.
| Código | Significado |
| --- | --- |
| OK  | Operación exitosa |
| E10 | El usuario no tiene suficientes fondos para la inversión indicada |
| E11 | Por un error desconocido, no se pudo modificar el saldo del usuario |
| E20 | La oportunidad indicada necesita menos dinero para alcanzar su meta de inversión de lo que el usuario desea invertir |
| E31 | Hubo un error interno al guardar el registro de relación entre usuario y oportunidad |
| E91 | Hubo un error interno |

El primer número de error indica en qué parte de la operación falló.

1. Modificando la tabla de usuarios
2. Modificando la tabla de oportunidades
3. Modificando la tabla de relación entre usuarios y oportunidades

El 9 se usa para errores internos generales.

El segundo número del código determina el origen del error. Los errores que terminan con un número mayor a cero son errores internos del servidor. Los que terminan con un número cero son por error de la petición.

El detalle simplemente es un mensaje explicando el error.