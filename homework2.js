import express from 'express'

const app = express()

app.get('/timestamp', (req, res) => {
  res.json({ timestamp: new Date().toISOString() })
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})