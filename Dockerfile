FROM 192.168.6.12:3002/library/nginx:alpine

# 删除默认的 Nginx 静态文件
RUN rm -rf /usr/share/nginx/html/*

# 将自定义 Nginx 配置复制到容器中
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 将构建的静态文件复制到 Nginx 的静态目录
COPY /dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
