// Enriches exercise objects with media + metadata from EXERCISE_DB
import { getExerciseMeta } from './exercises.js';

export function enrichExercise(ex) {
  const meta = getExerciseMeta(ex.name);
  if (!meta) return ex;
  return {
    ...ex,
    image: ex.image || meta.image,
    video: ex.video || meta.video,
    thumbnail: ex.thumbnail || meta.thumbnail,
    muscle: ex.muscle || meta.muscle,
    muscleGroups: ex.muscleGroups || meta.muscleGroups,
    difficulty: ex.difficulty || meta.difficulty,
    difficultyLevel: ex.difficultyLevel || meta.difficultyLevel,
    equipment: ex.equipment || meta.equipment,
    caloriesPerMinute: ex.caloriesPerMinute || meta.caloriesPerMinute,
    instructions: ex.instructions || meta.instructions,
    tips: ex.tips || meta.tips,
  };
}

export function enrichWorkout(workout) {
  return {
    ...workout,
    exercises: workout.exercises.map(enrichExercise),
  };
}
