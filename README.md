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
git clone [your-repository-url]
cd image-style-transfer

# 2. 配置环境变量
cp .env.example .env
# 编辑.env文件设置您的API密钥

# 3. 构建并运行
docker build -t image-style-transfer .
docker run -p 3000:3000 -p 8080:8080 --env-file .env image-style-transfer
```

### 手动部署

```bash
# 前端依赖
npm install

# 后端依赖
cd server && npm install

# 构建前端
npm run build

# 启动服务
node server/server.js
```

访问应用: http://localhost:3000

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

## 提示词编写技巧

### 预设风格提示词
- 简洁明确，突出关键特征
- 中英文均可，建议使用AI易理解的表述

### 自定义提示词
- 描述具体视觉效果：`"油画风格，厚重笔触"`
- 组合多个特征：`"赛博朋克风格，霓虹色调"`
- 避免模糊描述

### 优质提示词示例
1. `"复古胶片风格，添加颗粒感"`
2. `"极简主义，黑白高对比度"`
3. `"动漫风格，明亮色彩"`

## 注意事项

⚠️ **重要限制**  
- 图片大小 ≤5MB  
- 默认24小时内限制5次转换  
- 确保`.env`配置正确  

📝 **风格添加建议**  
- 保持ID唯一性  
- 测试实际效果  
- 提供清晰的用户描述  

## 技术支持

遇到问题？请提交Issue或联系：support@example.com

## 许可证

MIT License © 2023