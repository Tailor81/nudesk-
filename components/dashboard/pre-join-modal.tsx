"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Video, VideoOff, Mic, MicOff } from "lucide-react";
import { Modal, ModalHead, ModalBody, ModalFoot } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface PreJoinModalProps {
  open: boolean;
  onClose: () => void;
  onJoin: (settings: { audioEnabled: boolean; videoEnabled: boolean }) => void;
  title: string;
}

export function PreJoinModal({ open, onClose, onJoin, title }: PreJoinModalProps) {
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (!open) {
      stopStream();
      return;
    }

    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        s.getVideoTracks().forEach((t) => (t.enabled = false));
        s.getAudioTracks().forEach((t) => (t.enabled = false));
        setStream(s);
      })
      .catch(() => {
        /* permissions denied — continue without preview */
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = videoEnabled));
    }
  }, [videoEnabled, stream]);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = audioEnabled));
    }
  }, [audioEnabled, stream]);

  const handleClose = () => {
    stopStream();
    onClose();
  };

  const handleJoin = () => {
    stopStream();
    onJoin({ audioEnabled, videoEnabled });
  };

  return (
    <Modal open={open} onClose={handleClose} size="sm">
      <ModalHead
        title="Join Live Class"
        subtitle={title}
        onClose={handleClose}
      />
      <ModalBody>
        {/* Video preview */}
        <div className="bg-neutral-900 rounded-2xl aspect-video flex items-center justify-center mb-5 overflow-hidden relative">
          {videoEnabled && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <div className="text-center text-neutral-400">
              <VideoOff className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">Camera off</div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              audioEnabled
                ? "bg-primary text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {audioEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setVideoEnabled(!videoEnabled)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              videoEnabled
                ? "bg-primary text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {videoEnabled ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </button>
        </div>

        <label className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-[10px] cursor-pointer">
          <input
            type="checkbox"
            checked={!audioEnabled}
            onChange={(e) => setAudioEnabled(!e.target.checked)}
            className="accent-primary"
          />
          <span className="text-sm">Join muted (recommended)</span>
        </label>
      </ModalBody>
      <ModalFoot>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleJoin}>
          <Video className="w-4 h-4" />
          Enter Classroom
        </Button>
      </ModalFoot>
    </Modal>
  );
}
