export async function GET(req, res) {
  return res.json({
    message: 'Health check successful',
    status: 'OK',
    timestamp: new Date().toISOString()
  })
}