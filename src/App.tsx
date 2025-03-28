import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface StyleOption {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

const predefinedStyles: StyleOption[] = [
  {
    id: 'old-photo',
    name: '老照片修复',
    prompt: '给老照片上色并修复',
    description: '将泛黄的老照片恢复成清晰的彩色照片'
  },
  {
    id: 'ghibli',
    name: '吉卜力风格',
    prompt: '将照片转换成吉卜力动画风格',
    description: '将照片转换成宫崎骏动画风格的艺术作品'
  },
  {
    id: 'cartoon',
    name: '卡通头像',
    prompt: 'generate a drawing based on the style above for this portrait',
    description: '将照片转换成可爱的卡通头像'
  }
];

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
      }
    },
    onDropRejected: () => {
      toast.error('请上传5MB以内的图片文件（JPG/PNG格式）');
    }
  });

  const handleStyleSelect = (style: StyleOption) => {
    setSelectedStyle(style);
    setCustomPrompt('');
  };

  const handleSubmit = async () => {
    setError(null);
    if (!selectedFile) {
      toast.error('请先上传图片');
      return;
    }

    if (!selectedStyle && !customPrompt) {
      toast.error('请选择风格或输入自定义提示词');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      if (selectedStyle) {
        formData.append('style', selectedStyle.prompt);
      } else if (customPrompt) {
        formData.append('customPrompt', customPrompt);
      }

      setProcessingStatus('正在上传图片...');
      const response = await fetch('http://localhost:3001/api/process-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '处理失败');
      }

      if (!data.taskId) {
        throw new Error('服务器未返回任务ID');
      }

      setProcessingStatus('图片正在处理中，预计需要1-5分钟...');
      // 轮询检查处理状态
      const checkStatus = async () => {
        try {
          if (!data.taskId) {
            throw new Error('无效的任务ID');
          }
          const statusResponse = await fetch(`http://localhost:3001/api/process-status/${data.taskId}`);
          setProcessingStatus('图片正在处理中，预计需要5-10分钟...');
          if (!statusResponse.ok) {
            throw new Error('状态检查失败');
          }
          const statusData = await statusResponse.json();
          
          if (statusData.status === 'completed' && statusData.resultImage) {
            setProcessedImageUrl(statusData.resultImage);
            setProcessingStatus('');
            toast.success('图片处理成功！');
            return;
          } else if (statusData.status === 'failed') {
            throw new Error(statusData.error || '处理失败');
          }
          
          // 继续轮询
          setTimeout(checkStatus, 15000); // 每15秒检查一次
        } catch (error) {
          console.error('Status check error:', error);
          throw error;
        }
      };
      
      await checkStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '处理失败，请稍后重试';
      console.error('Error:', error);
      toast.error(errorMessage);
      setProcessingStatus('');
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">AI图片风格转换</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧：图片上传区域 */}
          <div className="space-y-6">
            <div {...getRootProps()} className="card cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors duration-200">
              <input {...getInputProps()} />
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {isDragActive ? '将图片拖放到这里' : '点击或拖放图片到这里上传'}
                </p>
                <p className="text-xs text-gray-500 mt-1">支持 JPG/PNG 格式，最大5MB</p>
              </div>
            </div>

            {previewUrl && (
              <div className="card">
                <img src={previewUrl} alt="预览" className="w-full h-auto rounded-lg" />
              </div>
            )}
          </div>

          {/* 右侧：风格选择和操作区域 */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">选择风格</h2>
              <div className="space-y-4">
                {predefinedStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleStyleSelect(style)}
                    className={`w-full text-left p-3 rounded-lg border ${selectedStyle?.id === style.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}
                  >
                    <div className="font-medium">{style.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">自定义提示词</h2>
              <textarea
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  if (e.target.value) {
                    setSelectedStyle(null);
                  }
                }}
                placeholder="输入自定义提示词来描述你想要的效果..."
                className="input-field h-24"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isProcessing || (!selectedFile) || (!selectedStyle && !customPrompt)}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? '处理中...' : '开始转换'}
            </button>

            {processedImageUrl && (
              <div className="card mt-4">
                <h2 className="text-lg font-semibold mb-4">处理结果</h2>
                <img src={processedImageUrl} alt="处理结果" className="w-full h-auto rounded-lg mb-4" />
                <a
                  href={processedImageUrl}
                  download="processed-image.png"
                  className="btn-secondary w-full text-center"
                >
                  下载图片
                </a>
              </div>
            )}

            {processingStatus && (
              <div className="text-center text-sm text-primary-600 mt-4">
                <p>{processingStatus}</p>
              </div>
            )}

            {error && (
              <div className="card mt-4 bg-red-50 border-red-200">
                <div className="flex items-center space-x-3 text-red-700 mb-3">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  <h3 className="font-medium">处理失败</h3>
                </div>
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    handleSubmit();
                  }}
                  className="btn-secondary w-full bg-red-100 hover:bg-red-200 text-red-700"
                >
                  重试
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>免费用户每天可处理5张图片</p>
              <p>升级会员获得更多配额</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;