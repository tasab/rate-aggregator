export const getServerTime = (req, res) => {
  try {
    const now = new Date();
    const timezone = 'Europe/Kiev';

    // Get time in Europe/Kiev timezone using formatToParts for reliability
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const hour = parts.find((p) => p.type === 'hour').value;
    const minute = parts.find((p) => p.type === 'minute').value;
    const second = parts.find((p) => p.type === 'second').value;
    const currentTime = `${hour}:${minute}:${second}`;

    return res.json({
      timestamp: now.getTime(),
      iso: now.toISOString(),
      date: now.toLocaleDateString('en-US', { timeZone: timezone }),
      time: currentTime, // HH:MM:SS format in Europe/Kiev timezone
      timezone: timezone,
      utcOffset: now.getTimezoneOffset(), // This will still show client's offset
      serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localDateTime: now.toLocaleString('en-US', { timeZone: timezone }),
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message,
    });
  }
};
