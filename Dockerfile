# 使用多阶段构建
# 前端构建阶段
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 后端构建阶段
FROM node:18-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server ./

# 最终阶段
FROM node:18-alpine
WORKDIR /app

# 复制前端构建产物
COPY --from=frontend-builder /app/dist ./dist

# 复制后端文件和依赖
COPY --from=backend-builder /app/server ./server

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000
EXPOSE 8080

# 启动命令
CMD ["node", "server/server.js"]