# 图片风格转换应用

![应用截图](应用截图URL) <!-- 建议添加实际截图 -->

使用逆向GPT-4o API完成图片风格转换，支持多种预设风格和自定义提示词。

## 功能特点

✅ **多种风格选择** - 内置多种预设风格，一键转换  
✅ **自定义提示词** - 支持自由输入风格描述  
✅ **简洁界面** - 直观易用的用户界面  
✅ **实时反馈** - 显示处理进度和状态  
✅ **安全限制** - 图片大小限制(最大5MB)和请求频率控制  

## 快速部署

### 🐳 Docker部署 (推荐)

```bash
# 1. 克隆项目
git clone https://github.com/hooxing/4oPS.git
cd 4oPS

# 2. 配置环境变量
cp .env.example .env
# 编辑.env文件设置您的API密钥

# 3. 构建并运行
docker build -t 4ops .
docker run -p 3000:3000 --env-file .env 4ops
```

### 手动部署

```bash
# 1. 克隆项目并安装依赖
git clone https://github.com/hooxing/4oPS.git
cd 4oPS
npm install

# 2. 构建前端
npm run build

# 3. 启动应用
npm start
```

启动后访问: http://localhost:3000

### 环境配置

在项目根目录创建 `.env` 文件，参考 `.env.example` 进行配置：

```
# API配置
API_KEY=your_api_key_here
API_ENDPOINT=your_api_endpoint_here
API_MODEL=your_api_model_here

# 服务器配置
PORT=3000
NODE_ENV=production

# 请求限制配置
RATE_LIMIT_WINDOW_MS=86400000  # 24小时
RATE_LIMIT_MAX_REQUESTS=5      # 每个时间窗口内的最大请求数
```

## 使用指南

1. **上传图片** - 点击或拖放图片到上传区域
2. **选择风格** - 从预设风格中选择或输入自定义提示词
3. **开始转换** - 点击转换按钮
4. **下载结果** - 处理完成后保存转换后的图片

## 添加新风格

在 `src/App.tsx` 中编辑 `predefinedStyles` 数组:

```typescript
{
  id: 'unique-style-id',    // 唯一ID
  name: '风格名称',         // 显示名称
  prompt: '风格转换提示词', // AI处理用提示词
  description: '风格描述'   // 用户可见描述
}
```

### 示例风格

```typescript
{
  id: 'watercolor',
  name: '水彩风格',
  prompt: '转换为水彩画效果，保留笔触质感',
  description: '模拟传统水彩画的透明质感'
}
```