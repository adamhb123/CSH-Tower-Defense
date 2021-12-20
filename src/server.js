const express = require('express')
const app = express()
const port = 6969
// Setup static content serving middleware
app.use(express.static('static'))
const HTMLDIR = __dirname + '/static' + '/html/'
// Routes
app.get('/', (req, res) => {
    res.sendFile(HTMLDIR + 'index.html')
})
// Launch server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

