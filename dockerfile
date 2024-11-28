# Etapa 1: Usar uma imagem base do Node.js
FROM node:18 

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o arquivo package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar as dependências
RUN npm install --legacy-peer-deps

# Copiar o restante dos arquivos do projeto
COPY . .

# Construir o projeto Next.js, desabilitando o linting temporariamente

# Etapa 2: Usar uma imagem menor para a execução

# Definir o diretório de trabalho
WORKDIR /app

# Copiar as dependências e arquivos necessários da etapa de build

# Expor a porta padrão do Next.js
EXPOSE 3000

# Definir o comando para iniciar a aplicação Next.js
CMD ["npm", "run", "dev"]
