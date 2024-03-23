# 指定基础镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用的所有文件
COPY . .

# 暴露容器内应用监听的端口号
EXPOSE 3000

# 定义容器启动时执行的命令
CMD ["node", "app.js"]


