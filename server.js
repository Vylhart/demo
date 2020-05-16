const express     = require('express')
const app         = express()
const path        = require('path')
const PORT        = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient 
const url = 'mongodb+srv://crimson:rust@cluster0-9gafz.mongodb.net/test?retryWrites=true&w=majority' 

app
  .use(express.urlencoded({extended: true}))
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
      res.send("Hello")
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


MongoClient.connect(url, (e, db)=>{
    console.log('Connected')
    db.close()
})