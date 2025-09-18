export const getServerTime = (req, res) => {
  try {
    const now = new Date();

    return res.json({
      timestamp: now.getTime(),
      iso: now.toISOString(),
      date: now.toDateString(),
      time: now.toTimeString().slice(0, 8), // HH:MM:SS format
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      utcOffset: now.getTimezoneOffset(),
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message,
    });
  }
};
