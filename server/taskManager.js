// 用于管理和存储任务状态的简单内存存储
const tasks = new Map();

const TaskStatus = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const createTask = () => {
  const taskId = Date.now().toString();
  const task = {
    status: TaskStatus.PROCESSING,
    resultImage: null,
    error: null,
    createdAt: new Date()
  };
  tasks.set(taskId, task);
  console.log('Task Created:', { taskId, task });
  return taskId;
};

const updateTask = (taskId, update) => {
  if (!tasks.has(taskId)) {
    console.error('Task Update Failed: Task not found', { taskId, update });
    throw new Error('Task not found');
  }
  const oldTask = tasks.get(taskId);
  const newTask = { ...oldTask, ...update };
  tasks.set(taskId, newTask);
  console.log('Task Updated:', {
    taskId,
    oldStatus: oldTask.status,
    newStatus: newTask.status,
    update
  });
  return newTask;
};

const getTask = (taskId) => {
  if (!tasks.has(taskId)) {
    throw new Error('Task not found');
  }
  return tasks.get(taskId);
};

// 清理超过1小时的任务
setInterval(()