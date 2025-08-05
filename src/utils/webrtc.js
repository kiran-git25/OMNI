export class WebRTCManager {
  constructor(chatId) {
    this.chatId = chatId;
    this.peerConnection = null;
    this.dataChannel = null;
    this.localStream = null;
    this.remoteStream = null;
  }

  async initialize(initiator = false) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    });

    if (initiator) {
      this.dataChannel = this.peerConnection.createDataChannel(this.chatId);
      this.setupDataChannel();
    } else {
      this.peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.setupDataChannel();
      };
    }

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.storeCandidate(event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
    };

    return this.peerConnection;
  }

  setupDataChannel() {
    this.dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Handle incoming messages
      window.dispatchEvent(new CustomEvent('webrtc-message', { detail: message }));
    };

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };
  }

  async startCall(stream) {
    this.localStream = stream;
    stream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, stream);
    });

    if (this.dataChannel) {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.storeOffer(offer);
    }
  }

  async answerCall(stream) {
    this.localStream = stream;
    stream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, stream);
    });

    const offer = this.getStoredOffer();
    if (offer) {
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.storeAnswer(answer);
    }
  }

  // ... (other methods for candidate exchange, cleanup, etc.)
}
