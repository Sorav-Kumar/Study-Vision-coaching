module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/study_vision',
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: process.env.PORT || 5000,
  FILE_STORAGE_URL: process.env.FILE_STORAGE_URL || 'uploads',
  FILE_STORAGE_KEY: process.env.FILE_STORAGE_KEY || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
