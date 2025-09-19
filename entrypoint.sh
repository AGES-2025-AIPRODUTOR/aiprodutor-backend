#!/bin/sh

# O script irá esperar até que o banco de dados esteja pronto para aceitar conexões.

# Adicione esta seção para esperar o PostgreSQL
echo "Esperando o PostgreSQL iniciar..."
while ! pg_isready -h postgres -p 5432 -U devuser; do
  sleep 1
done
echo "PostgreSQL iniciado com sucesso!"


# Continue com os comandos originais
echo "Rodando as migrações do banco de dados..."
npx prisma migrate deploy

echo "Iniciando a aplicação..."
exec "$@"