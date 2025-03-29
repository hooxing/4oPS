# 使用多阶段构建
# 前端构建阶段
FROM node:18-alpine AS frontend-builder
WORKDIR /app
# 复制依赖相关文件
COPY package*.json ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
RUN npm install
# 复制源代码
COPY src ./src
COPY index.html ./
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
EXPOSE 3001

# 启动命令
CMD ["node", "server/server.js"]