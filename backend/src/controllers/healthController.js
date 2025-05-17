export const health = async (req, res) => {
  return  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: "Healthy",
  });
};