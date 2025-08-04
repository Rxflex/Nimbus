export async function GET(req, res) {
  console.log('Test route accessed');
  res.json({
    message: 'This is a test route',
    method: req.method,
    headers: req.headers
  })
}