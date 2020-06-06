//const socket = require('./socket-io')
const socket = io.connect(location.origin)
var localVideo  = document.querySelector('#local')
var remoteVideo = document.querySelector('#remote')
var button      = document.querySelector('#get-access')
var callButton  = document.querySelector('#call')


var peerConnection
var uuid
var localStream
const peerConnectionConfig = {
  'iceServers': [
    {'urls': 'stun:stun.stunprotocol.org:3478'},
    {'urls': 'stun:stun.l.google.com:19302'},
  ]
}
button.addEventListener('click', init)
callButton.addEventListener('click', ()=>{start(true)})

uuid = createUUID()

socket.on('data', (data)=>{
  console.log('got msg');
  gotMessageFromServer(data)
})

function init() {
  try{
    var constraints = {
      video: true,
      audio: true,
    };
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
       const videoTracks = stream.getVideoTracks()
       const track       = videoTracks[0]
       alert(`Getting video from: ${track.label}`)
       localStream = (stream)
       localVideo.srcObject = stream
       //console.log(typeof((localStream)));
       
    }).catch(errorHandler)
  }
  catch(e){
    alert("Try https instead of http.")
  }
  
}

function start(isCaller) {
  peerConnection = new RTCPeerConnection(peerConnectionConfig);
  peerConnection.onicecandidate = gotIceCandidate;
  peerConnection.ontrack = gotRemoteStream;
  console.log(localStream);
  
  peerConnection.addStream(localStream);

  if(isCaller) {
    peerConnection.createOffer().then(createdDescription).catch(errorHandler);
  }
}

function gotMessageFromServer(message) {
  if(!peerConnection) start(false);
  console.log(message)
  
  
  var signal = JSON.parse(message);
  // Ignore messages from ourself
  if(signal.uuid == uuid) return;

  if(signal.sdp) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
      // Only create answers in response to offers
      if(signal.sdp.type == 'offer') {
        peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
      }
    }).catch(errorHandler);
  } else if(signal.ice) {
    peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
  }
}

function gotIceCandidate(event) {
  if(event.candidate != null) {
    console.log('gotIce');
    socket.emit('data', JSON.stringify({'ice': event.candidate, 'uuid': uuid}))
  }
}

function createdDescription(description) {
  console.log('got description');
  peerConnection.setLocalDescription(description).then(function() {
    socket.emit('data',JSON.stringify({'sdp': peerConnection.localDescription, 'uuid': uuid}));
  }).catch(errorHandler);
}

function gotRemoteStream(event) {
  console.log('got remote stream');
  remoteVideo.srcObject = event.streams[0];
}

function createUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function errorHandler(error) {
  //alert(error)
  console.log(error);
}