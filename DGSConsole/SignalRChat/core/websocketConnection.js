function SocketHandler(emailAddress, wsIp, anycallback,endCallCallback) {
    var isVideo = false;
    var email = emailAddress;
    var websocketIp = 'ws://173.203.17.7:8172';

    if (typeof wsIp != 'undefined' && wsIp != null && (wsIp.indexOf('110.93') != -1 || wsIp.indexOf('::1') != -1))
        websocketIp = 'ws://172.24.32.7:8172';

    var self = this;
    //our username
    var name, connectedUser, yourConn, stream, localVideo = document.querySelector('#localVideo'), remoteVideo = document.querySelector('#remoteVideo');
    var playButton = document.getElementById("play-pause");
    var pauseplay = document.getElementById("pause-play");
    var muteButton = document.getElementById("mutebtn");
    var unmutebtn = document.getElementById("unmutebtn");
    var fullScreenButton = document.getElementById("full-screen");



    //connecting to our signaling server
    var conn = new WebSocket(websocketIp);//   173.203.17.7:8172  'ws://172.24.32.7:8172'

    conn.onopen = function () {
        console.log("Connected to the signaling server");
        self.allowConnection();
        self.loginUser(email);
    };

    //when we got a message from a signaling server
    conn.onmessage = function (msg) {
        console.log("Got message", msg.data);
        try {
            var data = JSON.parse(msg.data);

            switch (data.type) {
                case "login":
                    handleLogin(data.success);
                    break;
                    //when somebody wants to call us
                case "offer":                    
                    handleOffer(data.offer, data.name, data.callback);
                    break;
                case "videoOffer":
                    handleVideoOffer(data.offer, data.name);
                    break;
                case "answer":
                    handleAnswer(data.answer);
                    break;
                    //when a remote peer sends an ice candidate to us
                case "videoAnswer":
                    handleVideoAnswer(data.answer);
                    break;
                case "candidate":
                    handleCandidate(data.candidate);
                    break;
                case "videoCandidate":
                    handleVideoCandidate(data.candidate);
                    break;
                case "leave":
                    handleLeave();
                    if (typeof endCallCallback == 'function') {
                        endCallCallback();
                    }
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.log('Got error in message: ', e);
        }

    };

    conn.onerror = function (err) {
        console.log("Got error", err);
    };

    //alias for sending JSON encoded messages
    function send(message) {
        //attach the other peer username to our messages
        if (connectedUser) {
            message.name = connectedUser;
        }

        conn.send(JSON.stringify(message));
    };

    self.loginUser = function (name) {
        if (name.length > 0) {
            send({
                type: "login",
                name: name
            });
        }
    }

    self.allowConnection = function () {
        navigator.webkitGetUserMedia({ video: true, audio: true }, function (myStream) {
            console.log('stream successfull');
        }, function (error) {
            console.log(error);
        });

    }

    function handleLogin(success) {
        if (success === false) {
            //alert("Ooops...try a different username");
            console.log('Ooops...try a different username');
        }

        console.log('login successful');
    };


    self.openVideoStream = function openVideoStream(callback) {

        //**********************
        //Starting a peer connection
        //**********************

        var v = true;

        //getting local video stream
        navigator.webkitGetUserMedia({ video: v, audio: true }, function (myStream) {
            stream = myStream;

            //displaying local video stream on the page
            localVideo.src = window.URL.createObjectURL(stream);

            //using Google public stun server
            var configuration = {
                "iceServers": [{
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                }]
            };

            yourConn = new webkitRTCPeerConnection(configuration);

            // setup stream listening
            yourConn.addStream(stream);

            //when a remote user adds stream to the peer connection, we display it
            yourConn.onaddstream = function (e) {
                remoteVideo.src = window.URL.createObjectURL(e.stream);
            };

            // Setup ice handling
            yourConn.onicecandidate = function (event) {
                if (event.candidate) {
                    send({
                        type: "videoCandidate",
                        candidate: event.candidate
                    });
                }
            };

            if (typeof callback == 'function') {
                callback();
            }

        }, function (error) {
            console.log(error);
        });

    }

    self.openAudioStream = function openAudioStream(callback,video) {

        //**********************
        //Starting a peer connection
        //**********************

        isVideo = video ? video : false;

        //getting local video stream
        navigator.webkitGetUserMedia({ video: isVideo, audio: true }, function (myStream) {
            stream = myStream;

            //displaying local video stream on the page
            localVideo.src = window.URL.createObjectURL(stream);

            //using Google public stun server
            var configuration = {
                "iceServers": [{
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                }]
            };

            yourConn = new webkitRTCPeerConnection(configuration);

            // setup stream listening
            yourConn.addStream(stream);

            //when a remote user adds stream to the peer connection, we display it
            yourConn.onaddstream = function (e) {
                remoteVideo.src = window.URL.createObjectURL(e.stream);
            };

            // Setup ice handling
            yourConn.onicecandidate = function (event) {
                if (event.candidate) {
                    send({
                        type: "candidate",
                        candidate: event.candidate
                    });
                }
            };

            if (typeof callback == 'function') {
                callback();
            }

        }, function (error) {
            console.log(error);
        });

    }

    self.connectOtherParty = function (to) {

        if (yourConn == null) {
            self.openAudioStream(function () {

                connectedUser = to;
                // create an offer
                yourConn.createOffer(function (offer) {
                    send({
                        type: "offer",
                        offer: offer,
                        callback : isVideo
                    });

                    yourConn.setLocalDescription(offer);
                }, function (error) {
                    alert("Error when creating an offer");
                });

            });
        } else {

            connectedUser = to;
            // create an offer
            yourConn.createOffer(function (offer) {
                send({
                    type: "offer",
                    offer: offer,
                    callback: isVideo
                });

                yourConn.setLocalDescription(offer);
            }, function (error) {
                alert("Error when creating an offer");
            });
        }
    }

    self.connectOtherVideoParty = function (to) {


        if (yourConn == null) {

            self.openVideoStream(function () {

                connectedUser = to;
                // create an offer
                yourConn.createOffer(function (offer) {
                    send({
                        type: "videoOffer",
                        offer: offer
                    });

                    yourConn.setLocalDescription(offer);
                }, function (error) {
                    alert("Error when creating an offer");
                });

            });            
        } else {
            connectedUser = to;
            // create an offer
            yourConn.createOffer(function (offer) {
                send({
                    type: "videoOffer",
                    offer: offer
                });

                yourConn.setLocalDescription(offer);
            }, function (error) {
                alert("Error when creating an offer");
            });
        }
    }


    //when somebody sends us an offer
    function handleOffer(offer, name,video) {

        if (yourConn == null) {
            self.openAudioStream(function () {
                connectedUser = name;
                yourConn.setRemoteDescription(new RTCSessionDescription(offer));

                //create an answer to an offer
                yourConn.createAnswer(function (answer) {
                    yourConn.setLocalDescription(answer);

                    send({
                        type: "answer",
                        answer: answer
                    });

                }, function (error) {
                    alert("Error when creating an answer");
                });

                if (video) {
                    anycallback(video);
                }

            }, video);
        } else {
            connectedUser = name;
            yourConn.setRemoteDescription(new RTCSessionDescription(offer));

            //create an answer to an offer
            yourConn.createAnswer(function (answer) {
                yourConn.setLocalDescription(answer);

                send({
                    type: "answer",
                    answer: answer
                });



            }, function (error) {
                alert("Error when creating an answer");
            });
        }

    };

    //when somebody sends us an offer
    function handleVideoOffer(offer, name) {

        if (yourConn == null) {
            self.openVideoStream(function () {
                connectedUser = name;
                yourConn.setRemoteDescription(new RTCSessionDescription(offer));

                //create an answer to an offer
                yourConn.createAnswer(function (answer) {
                    yourConn.setLocalDescription(answer);

                    send({
                        type: "videoAnswer",
                        answer: answer
                    });

                }, function (error) {
                    alert("Error when creating an answer");
                });
            });
        } else {
            connectedUser = name;
            yourConn.setRemoteDescription(new RTCSessionDescription(offer));

            //create an answer to an offer
            yourConn.createAnswer(function (answer) {
                yourConn.setLocalDescription(answer);

                send({
                    type: "videoAnswer",
                    answer: answer
                });

            }, function (error) {
                alert("Error when creating an answer");
            });
        }

    };

    //when we got an answer from a remote user
    function handleAnswer(answer) {
        if (yourConn == null) {
            self.openAudioStream(function () {
                yourConn.setRemoteDescription(new RTCSessionDescription(answer));
            });
        } else {
            yourConn.setRemoteDescription(new RTCSessionDescription(answer));
        }

    };

    //when we got an answer from a remote user
    function handleVideoAnswer(answer) {
        if (yourConn == null) {
            self.openVideoStream(function () {
                yourConn.setRemoteDescription(new RTCSessionDescription(answer));
            });
        } else {
            yourConn.setRemoteDescription(new RTCSessionDescription(answer));
        }
    };

    //when we got an ice candidate from a remote user
    function handleCandidate(candidate) {
        if (yourConn == null) {
            self.openAudioStream(function () {
                yourConn.addIceCandidate(new RTCIceCandidate(candidate));
            });
        } else {
            yourConn.addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    //when we got an ice candidate from a remote user
    function handleVideoCandidate(candidate) {
        if (yourConn == null) {
            self.openVideoStream(function () {
                yourConn.addIceCandidate(new RTCIceCandidate(candidate));
            });
        } else {
            yourConn.addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    self.endCall = function () {
        send({
            type: "leave"
        });
        handleLeave();
    }

    function handleLeave() {
        try {

            connectedUser = null;
            remoteVideo.src = null;
            //stream.getVideoTracks()[0].enabled = false;

            stream.getTracks().forEach(function (track) {                
                track.stop();
            });

            yourConn.getTracks().forEach(function (track) {               
                track.stop();
            });
            yourConn.close();
            yourConn.onicecandidate = null;
            yourConn.onaddstream = null;

            isVideo = false;

        } catch (e) {
            console.log(e);
        }
        
    }


    self.muteUnmuteCall = function () {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled
    }

    self.pauseResumeVideo = function () {        
        stream.getTracks()[1].enabled = !stream.getTracks()[1].enabled;
    }

    function eventlistners() {               

        $(document).ready(function () {
            mutebtn.addEventListener("click", function () {
                self.muteUnmuteCall()
            });

            unmutebtn.addEventListener("click", function () {
                self.muteUnmuteCall();
            });

            playButton.addEventListener("click", function () {
                self.pauseResumeVideo();
            });
            pauseplay.addEventListener("click", function () {
                self.pauseResumeVideo();
            });
        });
       
    }

    eventlistners();
    return self;
}