export function createLessonSession(lesson,personal=''){
  return {
    lesson,
    step:0,
    confidence:2,
    personal,
    startedAt:new Date().toISOString(),
    revealed:false,
    recognitionSelected:null,
    interactionSelected:null,
    selected:null,
    speakHidden:false,
    personalError:false,
    transferRevealed:false
  };
}

export const LESSON_STEPS=['scene','partner','chunk','retrieve','speak','interact','personalize','transfer','done'];
