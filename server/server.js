import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { TaskStatus, createTask, updateTask, getTask } from './taskManager.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // 5 requests per windowMs
  message: { error: '已达到每日免费使用限额' }
});

app.use(cors());
app.use(express.json());

// Apply rate limiting to image processing endpoint
app.use('/api/process-image', limiter);

// Image processing endpoint
app.post('/api/process-image', upload.single('image'), async (req, res) => {
  const taskId = createTask();
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片' });
    }

    const { style, customPrompt } = req.body;
    if (!style && !customPrompt) {
      return res.status(400).json({ error: '请选择风格或输入自定义提示词' });
    }

    // Convert image to base64
    const imageBase64 = req.file.buffer.toString('base64');

    // Get API configuration from environment variables
    const apiKey = process.env.API_KEY;
    const apiEndpoint = process.env.API_ENDPOINT;

    // Prepare request payload
    const payload = {
      model: 'gpt-4o-all',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: style || customPrompt || 'Transform this image'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    };

    // Set request headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    // Send initial response with taskId to indicate processing started
    res.json({
      success: true,
      message: '图片正在处理中，请稍候...',
      status: 'processing',
      taskId: taskId
    });

    // Process image in background
    (async () => {
      try {
        // Log API request details
        console.log('API Request:', {
          endpoint: apiEndpoint,
          payload: payload
        });

        // Make API request
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });

        console.log('API Response Status:', response.status);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response Data:', result);
        
        // Process the API response and extract the generated image
        const processedImage = result.data?.image || result.image;
        
        if (!processedImage) {
          console.error('API Response Missing Image Data:', result);
          throw new Error('No image data in API response');
        }

        // Update task status with the processed image
        updateTask(taskId, {
          status: TaskStatus.COMPLETED,
          resultImage: processedImage
        });

      } catch (error) {
        console.error('API request error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
        updateTask(taskId, {
          status: TaskStatus.FAILED,
          error: '图片处理失败，请稍后重试'
        });
      }
    })();

    return;

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: '�