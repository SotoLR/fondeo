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

for i in range(20):
	pw = choice(words)+str(randint(100,999))
	hasher = sha256()
	hasher.update(bytes(pw, 'utf-8'))
	print(f"INSERT INTO usuarios (saldo, secret) VALUES ({round(random()*1000, 2)}, '{hasher.hexdigest()}'); -- {pw}")


for i in range(10):
	print(f"INSERT INTO oportunidades (total) VALUES ({round(random()*1000)});")