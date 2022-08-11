from random import choice, random, randint
from hashlib import sha256

words = [
	"dog",
	"cat",
	"crow",
	"cow",
	"owl",
	"tiger",
	"lion",
	"horse"
]

colors = [
	"red",
	"blue",
	"black",
	"green",
	"white",
	"gray",
	"yellow",
	"pink"
]

for i in range(20):
	pw = choice(words)+str(randint(100,1000))
	hasher = sha256()
	hasher.update(bytes(pw, 'utf-8'))
	print(f"INSERT INTO usuarios (saldo, nombre_usuario, secret) VALUES ({round(random()*1000, 2)}, '{choice(colors)}_{choice(words)}{randint(0,99)}', '{hasher.hexdigest()}'); -- {pw}")


for i in range(10):
	amount = round(random()*1000)
	print(f"INSERT INTO oportunidades (total, restante) VALUES ({amount}, {amount});")