const userlist = document.getElementById('userlist')
const counter  = document.getElementById('count')

function onstart(){
    socket.emit('reload', document.cookie)
}
onstart()

socket.on('user-joined', (id, count)=>{
    console.log(count,id);
    
    counter.innerHTML = 'Online :' +count
    var li = document.createElement('li')
    userlist.appendChild(li).append(id)
    
})
console.log('nope');
