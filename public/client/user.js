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

socket.on('userjoined', (name)=>{
    console.log('here');
    
    var li = document.createElement('li')
    li.id = name
    userlist.appendChild(li).append(name)
})
socket.on('userdisconnected', (name)=>{
    console.log(name);
    
    var li = document.getElementById(name)
    li.parentNode.removeChild(li)
})