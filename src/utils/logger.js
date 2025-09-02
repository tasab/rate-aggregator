export const LOG_SUCCESS = 'LOG_SUCCESS';
export const LOG_ERROR = 'LOG_ERROR';
export const LOG_INFO = 'LOG_INFO';

const getLogType = (type) => {
  switch (type) {
    case LOG_SUCCESS:
      return '✅ - SUCCESS';
    case LOG_ERROR:
      return '❌ - ERROR';
    case LOG_INFO:
      return 'ℹ️ - INFO';
    default:
      return '';
  }
};

export const logger = (error, msg, type = '') => {
  const typeIcon = getLogType(type);
  if (error) {
    console.log(`${typeIcon} ${msg}`, error);
  } else {
    console.log(`${typeIcon} ${msg}`);
  }
};
