$(document).ready(function () {
    //Variables
    var appHub = $.connection.appHub;
    var iceServers = [{ url: 'stun:74.125.142.127:19302' }];
    var connection = new RTCPeerConnection({ iceServers: iceServers });

    //Helpers
    function error() {
        console.log("something went wrong");
    }

    function setLocalVideo(stream) {
        var localVideo = $("#local").get(0);
        stream = s;
        var video = document.querySelector('#local');
        //insert stream into the video bag
        video.src = window.URL.createObjectURL(stream);
    }

    function sendOffer(offer) {
        appHub.server.send(JSON.stringify(offer));
    }

    function initiate() {
        //Create and send offer
        connection.createOffer(function (offer) {
            connection.setLocalDescription(new RTCSessionDescription(offer), sendOffer(offer), error);
        }, error);
    }

    function answer() {
        connection.createAnswer(function (answer) {
            connection.setLocalDescription(new RTCSessionDescription(answer), sendOffer(answer), error);
        }, error);
    }

    function getMedia() {
        navigator.getUserMedia({ video: true, audio: true }, function (stream) {
            //Add stream and set up local video
            connection.addStream(stream);
            setLocalVideo(stream);
            $("#call").click(initiate);
        }, error);
    }
    $("#getMedia").on('click', function () {
        getMedia();
    });
  
    //Events

    connection.onaddstream = function (obj) {
        var vid = document.createElement("video");
        vid.id = new Date().getMilliseconds();
        $("#videos").append(vid);
        vid.src = window.URL.createObjectURL(stream);
       // attachMediaStream(vid, obj.stream);
        vid.muted = true;
        vid.play();
    }

    connection.onicecandidate = function (e) {
        if (e.candidate == null) { return }
        console.log(e.candidate);
        appHub.server.send(JSON.stringify(e));
    }

    appHub.client.receive = function (context) {
        var obj = JSON.parse(context);
        if (obj.sdp && obj.type === "offer") {
            connection.setRemoteDescription(new RTCSessionDescription(obj), answer, error);
        }
        else if (obj.sdp && obj.type === "answer") {
            connection.setRemoteDescription(new RTCSessionDescription(obj), function () { }, error);
        }
        else if (obj.candidate) {
            connection.addIceCandidate(new RTCIceCandidate(obj.candidate));
        }
    }

    //Init
    $.connection.hub.start().done(function () {
        console.log("Hub has started")
      //  $("#connect").click(connect);
    });

});