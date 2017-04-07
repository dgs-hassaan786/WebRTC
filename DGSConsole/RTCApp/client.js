//var peerConn = new RTCPeerConnection();
//peerConn.onaddstream = function (evt) {
//    var videoElem = document.createElement("video");
//    document.appendChild(videoElem);
//    videoElem.src = URL.createObjectURL(evt.stream);
//};
//navigator.getUserMedia({ video: true }, function (stream) {
//    videoElem.src = URL.createObjectURL(stream);
//    peerConn.addStream(stream);

//    peerConn.createOffer(function (offer) {
//        peerConn.setLocalDescription(new RTCSessionDescription(offer), function () {
//            // send the offer to a server to be forwarded to the other peer
//        }, error);
//    }, error);
//});
//navigator.getUserMedia({ video: true }, function (stream) {
//    videoElem.src = URL.createObjectURL(stream);
//    peerConn.addStream(stream);

//    peerConn.setRemoteDescription(new RTCSessionDescription(offer), function () {
//        peerConn.createAnswer(function (answer) {
//            peerConn.setLocalDescription(new RTCSessionDescription(answer), function () {
//                // send the answer to a server to be forwarded back to the caller
//            }, error);
//        }, error);
//    }, error);
//});
//var peerConnCfg = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }] },
//    peerConn = new RTCPeerConnection(peerConnCfg),
//    signalingChannel = new WebSocket('ws://my-websocket-server:port/');

//peerConn.onicecandidate = function (evt) {
//    // send any ice candidates to the other peer, i.e., evt.candidate
//    signalingChannel.send(JSON.stringify({ "candidate": evt.candidate }));
//};

//signalingChannel.onmessage = function (evt) {
//    var signal = JSON.parse(evt.data);
//    if (signal.sdp)
//        peerConn.setRemoteDescription(new RTCSessionDescription(signal.sdp));
//    else if (signal.candidate)
//        peerConn.addIceCandidate(new RTCIceCandidate(signal.candidate));
//};
//var stream;
//function hasUserMedia() {
//    //checks if browser supports webRTC
//    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
//    return !!navigator.getUserMedia;
//}
//if (hasUserMedia()) {
//    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
//        || navigator.mozGetUserMedia || navigator.msGetUserMedia;
//    //get both video and audio streams from user's camera
//    navigator.getUserMedia({ video: true, audio: true }, function (s) {
//        stream = s;
//        var video = document.querySelector('video');
//        //insert stream into the video bag
//        video.src = window.URL.createObjectURL(stream);
//    }, function (err) { });
//}
//else {
//    alert("Error. WebRTC is not supported by the browser");
//}
//btnGetAudioTracks.addEventListener('click', function () {
//    console.log("getAudioTracks");
//    console.log(stream.getAudioTracks())//returns list of the audio MediaStreamTrack
//});
//btnGetTrackById.addEventListener('click', function () {
//    console.log("getTrackById");//return the track having the id exists and if multiple streams of same exist return first one
//    console.log(stream.getTrackById(stream.getAudioTracks()[0].id));
//});
//btnGetTracks.addEventListener('click', function () {
//    console.log("getTracks");
//    console.log(stream.getTracks())
//});
//btnGetVideoTracks.addEventListener('click', function () {
//    console.log("getVideoTracks");
//    console.log(stream.getVideoTracks())
//});
//btnRemoveAudioTracks.addEventListener('click', function () {
//    console.log("removeAudioTrack");
//    stream.removeTrack(stream.getAudioTracks()[0]);
//});
//btnRemoveVideoTracks.addEventListener('click', function () {
//    console.log("removeVideoTrack");
//    stream.removeTrack(stream.getVideoTracks()[0]);
//});

//var connection = new WebSocket('ws://172.24.32.7:8172');
//var name = "";
//var loginInput = document.querySelector('#loginInput');
//var loginButton = document.querySelector('#loginBtn');
//var otherUserNameInput = document.querySelector('#otherUsernameInput');
//var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn');
//var msgInput = document.querySelector('#msgInput');
//var sendMsgButton = document.querySelector('#sendMsgBtn');
//var connectedUser, myConnection, dataChannel;
//loginButton.addEventListener("click", function (event) {
//    name = loginInput.value;
//    if (name.length > 0) {
//        send({
//            type: 'login',
//            name: name
//        })
//    }
//})
//connection.onmessage = function (message) {
//    var data = JSON.parse(message.data);
//    switch (data.type) {
//        case 'login':
//            onLogin(data.success);
//            break;
//        case 'offer':
//            onOffer(data.offer, data.name);
//            break;
//        case 'answer':
//            onAnswer(data.answer);
//            break;
//        case 'candidate':
//            onCandidate(data.candidate);
//            break;
//        default:
//            break;
//    }
//};

//function onLogin(success) {
//    if (success === false) {
//       alert('try login from a different user');
//    }
//    else {
//        var configuration = {
//            "iceServers": [{ "url": "stun:stun.1.google.com:19302" }]
//        };
//        myConnection = new webkitRTCPeerConnection(configuration, {
//            //optional: [{ RtpDataChannels: true }]
//        });

//        console.log("RTCPeerConnection object was created");
//        console.log(myConnection);
//        //Below event is sent when a RTCIceCandidate object is added to the script
//        myConnection.onicecandidate = function (event) {
//            if (event.type == "candidate") {
//                send({
//                    type: candidate,
//                    candidate: event.candidate
//                })
//            }
//        };
//        openDataChannel();
//    }
//}
//connection.onopen = function () { console.log('connected'); }
//connection.onerror = function (err) { console.log('error occurred', err); }
//function send(message) {
//    if (connectedUser) { message.name = connectedUser; }
//    connection.send(JSON.stringify(message));
//}
//connectToOtherUsernameBtn.addEventListener("click", function (event) {
//    var otherUserName = otherUserNameInput.value;
//    connectedUser = otherUserName;
//    if (otherUserName.length > 0) {
//        myConnection.createOffer(function (offer) { console.log(); send({ type: 'offer', offer: offer }); myConnection.setLocalDescription(offer); }, function (error) { alert('An error has occurred'); })
//    }
//});
//function onOffer(offer,name) {
//    connectedUser = name;
//    myConnection.setRemoteDescription(new RTCSessionDescription(offer));
//    myConnection.createAnswer(function(answer){console.log();send({type:'answer',answer:answer});myConnection.setLocalDescription(answer);},function(error){alert('An error has occurred');})
//}
//function onAnswer(answer) { myConnection.setRemoteDescription(new RTCSessionDescription(answer)); }
//function onCandidate(candidate) { myConnection.addIceCandidate(new RTCIceCandidate(candidate)); }

//function openDataChannel() {
//    var dataChannelOptions = { reliable: true };
//    dataChannel = myConnection.createDataChannel("myDataChannel", dataChannelOptions);
//    dataChannel.onopen = function (event) {
//        var readyState = dataChannel.readyState;
//        if(readyState=="open"){console.log('Channel is' +readyState)}

//    }
//    dataChannel.onerror = function (error) {
//        console.log("Error:", error);
//    };
//    dataChannel.onmessage = function (event) { console.log("Got Message:" + event.data); };
//}
//sendMsgButton.addEventListener("click", function (event) {
//    console.log("send message")
//    var message = msgInput.value;
//    dataChannel.send(message);
//});