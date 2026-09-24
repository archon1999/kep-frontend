import { useGameAudio } from './useGameAudio';

/** World keeps its existing start-button and mute-button API. */
export const useWorldMusic = (active: boolean) => {
  const { muted, startFromGesture, toggleMuted, playCue } = useGameAudio('keppy-world', active);
  return { muted, startFromGesture, toggleMuted, playCue };
};
