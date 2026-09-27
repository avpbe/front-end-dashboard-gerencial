# Usa o servidor web Nginx em sua versão leve Alpine
FROM nginx:alpine

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todos os arquivos estáticos do frontend (HTML, CSS, JS, ícones)
COPY . /usr/share/nginx/html

# Expõe a porta HTTP padrão
EXPOSE 80

# Inicia o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]