export async function GET(req, res) {
  return res.json({
    message: 'This is a test route',
    method: req.method,
    headers: req.headers
  })
}