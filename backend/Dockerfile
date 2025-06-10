# Use Node.js 18 LTS
FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache postgresql-client

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e yarn.lock
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile --production=false

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 10000

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Comando padrão
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["yarn", "start"] 