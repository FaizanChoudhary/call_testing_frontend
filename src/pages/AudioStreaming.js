import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./styles.css";

const socket = io.connect("https://c40a-182-185-255-136.ngrok-free.app:3333"); // Replace with your server URL

function AudioStreaming() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  const startStreaming = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log("Audio stream:", audioStream);
      setStream(audioStream);
      console.log("Tracks:", audioStream.getTracks());

      socket.emit("media", audioStream);

      const peerConnection = new RTCPeerConnection();
      audioStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, audioStream);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate);
        }
      };

      // Set up peer connection and other handlers as needed

      setIsStreaming(true);
    } catch (error) {
      console.error("Error starting streaming:", error);
    }
  };

  const stopStreaming = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setIsStreaming(false);
    }
  };

  const toggleMute = () => {
    if (stream) {
      setIsMuted(!isMuted);
      stream.getAudioTracks()[0].enabled = !isMuted;
    }
  };

  return (
    <div className="controls">
      <button
        className={`button ${isStreaming ? "disabled" : ""}`}
        onClick={startStreaming}
        disabled={isStreaming}
      >
        {isStreaming ? "Streaming..." : "Start Streaming"}
      </button>
      <button
        className={`button ${!isStreaming ? "disabled" : ""}`}
        onClick={toggleMute}
        disabled={!isStreaming}
      >
        {isMuted ? "Unmute Mic" : "Mute Mic"}
      </button>
      <button
        className={`button ${!isStreaming ? "disabled" : ""}`}
        onClick={stopStreaming}
        disabled={!isStreaming}
      >
        Stop Streaming
      </button>
      <p className="audioStatus">
        {isStreaming ? "Audio Status: Active" : "Audio Status: Inactive"}
      </p>
    </div>
  );
}

export default AudioStreaming;
