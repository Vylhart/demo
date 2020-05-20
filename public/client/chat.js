const msgbox = document.getElementById('msgbox')

socket.on('transfer', (data)=>{
    console.log(data);
    let li    = document.createElement('span')
    let span1 = document.createElement('span')
    let span2 = document.createElement('span')
    span1.setAttribute('style','clear: both; display: block; position: relative;')
    span2.setAttribute('style','clear: both; display: block; position: relative;')

    li.appendChild(span1).append(data.message)
    li.appendChild(span2).append("by "+ data.user)    
    msgbox.appendChild(li)

})

$(document).ready(()=>{  
    //alert(document.cookie)  
    $('form#form').on('submit', function(e){
        e.preventDefault();
        data = {'user': document.cookie, 'message': $('#msg').val()}
        socket.emit('transfer', data)
        let li    = document.createElement('span')
        let span1 = document.createElement('span')
        let span2 = document.createElement('span')
        span1.setAttribute('style','clear: both; float: right; display: block; position: relative;')
        span2.setAttribute('style','clear: both; float: right; display: block; position: relative;')

        li.appendChild(span1).append(data.message)
        li.appendChild(span2).append("by "+ data.user)    
        msgbox.appendChild(li)

    })
})
