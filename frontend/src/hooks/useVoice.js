/**
 * useVoice — abstracts Web Speech API for recording + synthesis
 * Returns { isRecording, transcript, startListening, stopListening, speak, isSupported }
 */

import { useState, useRef, useCallback } from 'react';

export const useVoice = ({ onTranscript } = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      let full = '';
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript;
      }
      setTranscript(full);
      onTranscript?.(full);
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
  }, [isSupported, onTranscript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  /**
   * Text-to-speech — AI reads questions aloud
   */
  const speak = useCallback((text, { rate = 0.9, pitch = 1 } = {}) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    // Prefer a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.name.includes('Google') || v.name.includes('Natural'));
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, []);

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  const resetTranscript = useCallback(() => setTranscript(''), []);

  return { isRecording, transcript, startListening, stopListening, speak, cancelSpeech, resetTranscript, isSupported };
};
