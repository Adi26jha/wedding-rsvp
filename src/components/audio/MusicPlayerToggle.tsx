"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

/**
 * Ambient Wedding Music Player:
 * Plays gentle instrumental shehnai/sitar chords.
 * Uses Web Audio API synthesis for high quality, zero-external-dependency ambient raag drone,
 * or loads an audio source if available.
 */
export const MusicPlayerToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ oscillators: OscillatorNode[]; gainNode: GainNode } | null>(null);

  const startAmbientDrone = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 3); // Soft, non-intrusive volume
      masterGain.connect(ctx.destination);

      // Frequencies for a meditative Indian Tanpura / Raag Yaman chord (Sa, Pa, High Sa, Ga)
      // Base Sa = C#3 (~138.59 Hz)
      const frequencies = [138.59, 207.65, 277.18, 349.23];
      const oscillators: OscillatorNode[] = [];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const oscGain = ctx.createGain();

        // Warm harmonic tone
        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Add subtle natural detune for shimmer
        osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.25, ctx.currentTime);

        if (panner) {
          panner.pan.setValueAtTime((idx % 2 === 0 ? -1 : 1) * 0.35, ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(panner);
          panner.connect(masterGain);
        } else {
          osc.connect(oscGain);
          oscGain.connect(masterGain);
        }

        osc.start();
        oscillators.push(osc);
      });

      nodesRef.current = { oscillators, gainNode: masterGain };
      setIsPlaying(true);
    } catch (e) {
      console.warn("Web Audio could not be started:", e);
      setIsPlaying(false);
    }
  };

  const stopAmbientDrone = () => {
    if (nodesRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      const gain = nodesRef.current.gainNode;
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      setTimeout(() => {
        nodesRef.current?.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        nodesRef.current = null;
        ctx.close();
        audioContextRef.current = null;
        setIsPlaying(false);
      }, 1200);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopAmbientDrone();
    } else {
      startAmbientDrone();
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      onClick={toggleMusic}
      type="button"
      aria-label={isPlaying ? "Mute ambient music" : "Play ambient music"}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-ivory-50/95 backdrop-blur-md border border-gold-400/70 shadow-glow hover:border-gold-500 hover:shadow-luxe-hover transition-all duration-300 text-maroon-900 text-xs font-sans tracking-wide group cursor-pointer"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5">
            <span className="w-0.5 bg-maroon-700 animate-[bounce_0.8s_infinite_50ms] h-full rounded-full" />
            <span className="w-0.5 bg-gold-600 animate-[bounce_0.8s_infinite_200ms] h-2.5 rounded-full" />
            <span className="w-0.5 bg-maroon-800 animate-[bounce_0.8s_infinite_350ms] h-3.5 rounded-full" />
            <span className="w-0.5 bg-amber-600 animate-[bounce_0.8s_infinite_150ms] h-2 rounded-full" />
          </div>
        ) : (
          <VolumeX className="w-4 h-4 text-charcoal-400 group-hover:text-maroon-700 transition-colors" />
        )}
      </div>

      <span className="font-medium tracking-wide">
        {isPlaying ? "Shehnai & Tanpura: Playing" : "Play Shehnai"}
      </span>

      {isPlaying && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-gold-500 to-amber-500"></span>
        </span>
      )}
    </button>
  );
};
