/* PeerJS simplifies WebRTC peer-to-peer data, video, and audio calls.
   PeerJS wraps the browser's WebRTC implementation to provide a complete, configurable,
   and easy-to-use peer-to-peer connection API. Equipped with nothing but an ID, a peer can create
   a P2P data or media stream connection to a remote peer.
   */

var fs = require('fs');  // for file transfer
var PeerServer = require('peer').PeerServer;

var server = PeerServer({
    port: 9000,
    path: '/peerjs',
    ssl: {
       key: fs.readFileSync('./../certificates/key.pem', 'utf8'),
       cert: fs.readFileSync('./../certificates/cert.pem', 'utf8')
     }
});