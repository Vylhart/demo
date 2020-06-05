const path        = require('path')
const PORT        = process.env.PORT || 5000
const express     = require('express')
const app         = express()
const http        = require('http')
const server      = http.Server(app)
const socket      = require('socket.io')(server)
const mongoClient = require('mongodb').MongoClient 
const url = 'mongodb+srv://crimson:rust@cluster0-9gafz.mongodb.net/test?retryWrites=true&w=majority' 

app
  .use(express.urlencoded({extended: true}))
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
      res.render('pages/main')
    })
  .post('/chat', (req, res) =>{
        name = req.body.user
        res.render('pages/chat')      
    })

socket.on('connection', (soc)=>{
    soc
        .join('room')
        .on('reload', (name)=>{
            soc.nsp.to('room').emit('user-joined', name, socket.engine.clientsCount)
        })
        .on('transfer', (data)=>{
            console.log(data);
            soc.broadcast.emit('transfer', data)
        }) 
        .on('data', (data)=>{
            soc.to('room').emit('data', data)
        })
        .on('disconnect', ()=>{
            soc.to('room').emit('userjoined', soc.id, socket.engine.clientsCount)
        })


    soc.emit("user-joinedd", soc.id, socket.engine.clientsCount, Object.keys(socket.clients));

	soc.on('signal', (toId, message) => {
		soc.to(toId).emit('signal', soc.id, message);
  	});

    soc.on("message", function(data){
		soc.emit("broadcast-message", soc.id, data);
    })

	soc.on('disconnect', function() {
		soc.emit("user-left", soc.id);
	})

})


mongoClient.connect(url, {useUnifiedTopology: true}, (e, db)=>{
    console.log('Connected to Database')
    db.close()
})

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))
