const express = require('express')
const app     = express()
const PORT        = process.env.PORT || 5000


app
  .use(express.urlencoded({extended: true}))
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
      res.send("Hello")
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
