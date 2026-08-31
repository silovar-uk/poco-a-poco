export function createLessonSession(lesson,personal=''){
  return {
    lesson,
    step:0,
    confidence:2,
    personal,
    startedAt:new Date().toISOString(),
    revealed:false,
    selected:null,
    speakHidden:false,
    personalError:false
  };
}

export const LESSON_STEPS=['scene','meaning','chunk','retrieve','speak','change','personalize','reuse','done'];
