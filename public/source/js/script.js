document.addEventListener("DOMContentLoaded", function(event) {
    var peer_id;
    var username;
    var conn;
/* Creating a peer  to generate a token*/
    var peer = new Peer({
        host: "localhost",
        port: 9000,
        path: '/peerjs',
        config: {
            'iceServers': [
                { url: 'stun:stun1.l.google.com:19302' },
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                }
            ]
        }
    });

    // For Connect
    // Once the initialization succeeds:
    // Enter the ID that allows other user to connect to your session.
    peer.on('open', function () {
        document.getElementById("peeridlabel").innerHTML = peer.id;
    });

    // When someone connects to your session:
    peer.on('connection', function (connection) {
        conn = connection;
        peer_id = connection.peer;

        // Use the handleMessage to callback when a message comes in
        conn.on('data', handleMessage);
        document.getElementById("peer_id").className += " hidden";
        document.getElementById("peer_id").value = peer_id;


        document.getElementById("connected_peer").innerHTML = connection.metadata.username;
    });

    peer.on('error', function(err){
        alert("An error ocurred with peer: " + err);
        console.error(err);
    });

    /**
     * Handle the on receive call event
     */
    peer.on('call', function (call) {
        var acceptsCall = confirm("Incoming video call request, do you want to accept it ?");

        if(acceptsCall){
            // Answer the call with own video/audio stream
            call.answer(window.localStream);

            // Receive data
            call.on('stream', function (stream) {

                window.peer_stream = stream;

                onReceiveStream(stream, 'peer-camera');
            });

            // Handle when the call finishes
            call.on('close', function(){
                alert("The videocall has finished");
            });

            // use call.close() to finish a call
        }else{
            console.log("Call denied !");
        }
    });



    /**
     * Starts the request of the camera and microphone
     */
    function requestLocalVideo(callbacks) {
       // For handling the different browsers
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Request audio and video
        navigator.getUserMedia({ audio: true, video: true }, callbacks.success , callbacks.error);

    }

    /**
     * Handle the audio and video stream to the desired video element
     */
    function onReceiveStream(stream, element_id) {
        // Retrieve the video element according to the desired
        var video = document.getElementById(element_id);
        // Set the given stream as the video source
      //  video.src = window.URL.createObjectURL(stream);
            video.srcObject=stream;
        // Store a global reference of the stream
        window.peer_stream = stream;
    }

    /**
     * Appends the received and sent message to the listview
     */
    function handleMessage(data) {
        var orientation = "text-left";

        // If the message is yours, set text to right !
        if(data.from == username){
            orientation = "text-right"
        }

        var messageHTML =  '<a href="javascript:void(0);" class="list-group-item' + orientation + '">';
                messageHTML += '<h4 class="list-group-item-heading">'+ data.from +'</h4>';
                messageHTML += '<p class="list-group-item-text">'+ data.text +'</p>';
            messageHTML += '</a>';

        document.getElementById("messages").innerHTML += messageHTML;
    }

    /**
     * Handle the send message button
     */
    document.getElementById("send-message").addEventListener("click", function(){

        var text = document.getElementById("message").value;

        var data = {
            from: username,
            text: text
        };

        conn.send(data);

        handleMessage(data);

        document.getElementById("message").value = "";
    }, false);

    /**
     *  Request a videocall the other user
     */
    document.getElementById("call").addEventListener("click", function(){
        console.log('Calling to ' + peer_id);
        console.log(peer);

        var call = peer.call(peer_id, window.localStream);

        call.on('stream', function (stream) {
            window.peer_stream = stream;
            onReceiveStream(stream, 'peer-camera');
        });
    }, false);

    /**
     * On click the connect button, initialize connect with peer
     */
    document.getElementById("connect-to-peer-btn").addEventListener("click", function(){
        username = document.getElementById("name").value;
        peer_id = document.getElementById("peer_id").value;

        if (peer_id) {
            conn = peer.connect(peer_id, {
                metadata: {
                    'username': username
                }
            });

            conn.on('data', handleMessage);
        }else{
            alert(" Please provide a peer id to connect with !");
            return false;
        }

        document.getElementById("chat").className = "";
        document.getElementById("connection-form").className += " hidden";
    }, false);

    requestLocalVideo({
        success: function(stream){
            window.localStream = stream;
            onReceiveStream(stream, 'my-camera');

                        },
        error: function(err){
            alert("Cannot get access to your camera and video !");
            console.error(err);
        }
    });
}, false);
