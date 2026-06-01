/**
 * Interview Store — Zustand
 * Manages active interview session state
 */

import { create } from 'zustand';
import { interviewApi } from '../api/interview.api';

export const useInterviewStore = create((set, get) => ({
  // Active session
  currentInterview: null,
  currentQuestionIndex: 0,
  isLoading: false,
  isAiTyping: false,
  isRecording: false,
  transcript: '',

  // Session timer
  elapsedSeconds: 0,
  timerInterval: null,

  startSession: async (mode, title) => {
    set({ isLoading: true });
    try {
      const interview = await interviewApi.start(mode, title);
      set({ currentInterview: interview, currentQuestionIndex: 0, isLoading: false });
      get().startTimer();
      return interview;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  submitAnswer: async (answer) => {
    const { currentInterview, currentQuestionIndex } = get();
    if (!currentInterview) return;

    set({ isAiTyping: true });
    try {
      const { aiResponse, interview } = await interviewApi.submitAnswer(
        currentInterview._id,
        answer,
        currentQuestionIndex
      );
      set({
        currentInterview: interview,
        currentQuestionIndex: currentQuestionIndex + 1,
        isAiTyping: false,
        transcript: '',
      });
      return aiResponse;
    } catch (err) {
      set({ isAiTyping: false });
      throw err;
    }
  },

  completeSession: async (metadata) => {
    const { currentInterview } = get();
    if (!currentInterview) return;
    get().stopTimer();
    const interview = await interviewApi.complete(currentInterview._id, {
      durationSeconds: get().elapsedSeconds,
      ...metadata,
    });
    set({ currentInterview: interview });
    return interview;
  },

  setTranscript: (text) => set({ transcript: text }),
  setRecording: (val) => set({ isRecording: val }),

  startTimer: () => {
    set({ elapsedSeconds: 0 });
    const interval = setInterval(() => {
      set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
    }, 1000);
    set({ timerInterval: interval });
  },

  stopTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    set({ timerInterval: null });
  },

  reset: () => {
    get().stopTimer();
    set({ currentInterview: null, currentQuestionIndex: 0, transcript: '', elapsedSeconds: 0 });
  },
}));
