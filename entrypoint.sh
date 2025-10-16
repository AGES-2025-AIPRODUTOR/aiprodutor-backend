#!/bin/sh

# Verifica se a variável DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo "Erro: A variável de ambiente DATABASE_URL não está definida."
  exit 1
fi

echo "Esperando o banco de dados ficar pronto..."

# Usa o comando 'pg_isready' com a URL completa do banco de dados.
# Isso funciona tanto para 'postgres:5432' (local) quanto para o endpoint do RDS (AWS).
until pg_isready -d "$DATABASE_URL"; do
  echo "Banco de dados indisponível - aguardando..."
  sleep 1
done

echo "Banco de dados pronto para aceitar conexões!"

# Continue com os comandos originais
echo "Rodando as migrações do banco de dados..."
npx prisma migrate deploy

echo "Iniciando a aplicação..."
exec "$@"