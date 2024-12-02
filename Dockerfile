FROM feresdeli/bankist-app:v5.0

COPY src/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]