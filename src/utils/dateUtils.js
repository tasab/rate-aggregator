export const getCurrentUkraineTime = () => {
  const now = new Date();
  const ukraineTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Kiev',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  return ukraineTime;
};

export const isWithinWorkingHours = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return true;
  }

  const currentTime = getCurrentUkraineTime();

  const current = currentTime.replace(/:/g, '');
  const start = startTime.replace(/:/g, '');
  const end = endTime.replace(/:/g, '');

  if (start > end) {
    return current >= start || current <= end;
  } else {
    return current >= start && current <= end;
  }
};
