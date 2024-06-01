import { makeAutoObservable } from "mobx";

class AudioStore {
  audioRefs = {};
  currentTimes = {};
  isPlaying = {};
  durations = {};
  currentlyPlayingId = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAudioRefs = (id, ref) => {
    this.audioRefs[id] = ref;
  };

  setCurrentTimes = (id, time) => {
    this.currentTimes[id] = time;
  };

  setIsPlaying = (id, playing) => {
    this.isPlaying[id] = playing;
  };

  setDurations = (id, duration) => {
    this.durations[id] = duration;
  };

  setCurrentlyPlayingId = (id) => {
    this.currentlyPlayingId = id;
  };
}

export default new AudioStore();