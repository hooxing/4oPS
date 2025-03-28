# 图片风格转换应用

一个基于React和Express的图片风格转换Web应用，支持多种预设风格和自定义提示词，让您轻松将普通图片转换成艺术作品。

## 功能特点

- 支持多种预设风格选择
- 支持自定义提示词
- 简洁直观的用户界面
- 实时处理状态反馈
- 图片上传大小限制（最大5MB）
- 内置请求频率限制保护

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- TailwindCSS
- HeadlessUI
- React Dropzone

### 后端
- Node.js
- Express
- Multer（文件上传）
- Express Rate Limit（请求限制）

## 快速开始

### 使用Docker（推荐）

1. 克隆项目
```bash
git clone [your-repository-url]
cd image-style-transfer
```

2. 创建环境变量文件
```bash
cp .env.example .env
```
编辑.env文件，设置必要的环境变量：
```
API_KEY=your_api_key
API_ENDPOINT=your_api_endpoint
API_MODEL=your_api_model
```

3. 构建并运行Docker容器
```bash
docker build -t image-style-transfer .
docker run -p 3000:3000 -p 8080:8080 --env-file .env image-style-transfer
```

### 手动部署

1. 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
```

2. 构建前端
```bash
npm run build
```

3. 启动服务
```bash
node server/server.js
```

## 使用说明

1. 访问应用（http://localhost:3000）
2. 点击上传区域或拖拽图片到上传区域
3. 选择预设风格或输入自定义提示词
4. 点击"开始转换"按钮
5. 等待处理完成，下载转换后的图片

## 注意事项

- 图片大小限制为5MB
- 每24小时限制处理5张图片（可在配置中调整）
- 确保.env文件中的API密钥和端点配置正确

## 许可证

MIT License