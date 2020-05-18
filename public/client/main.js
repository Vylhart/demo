$(document).ready(()=>{
    console.log('ready');
    $('form#form').on('submit', function(e){
        document.cookie = $('#user').val()
        console.log($('#user').val());
        //alert($('#user').val())
    })
})