// Full exercise library with media + metadata
export const EXERCISE_DB = {
  pushup: {
    id: 'pushup', name: 'Push-Up',
    image: '/exercises/pushup.svg', video: '/videos/pushup.svg', thumbnail: '/thumbnails/pushup_thumb.svg',
    muscle: 'Chest · Triceps · Shoulders', muscleGroups: ['chest','triceps','shoulders'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 7,
    instructions: ['Start in high plank position', 'Lower chest to floor, elbows at 45°', 'Push back up explosively', 'Keep core tight throughout'],
    tips: 'Keep your body in a straight line from head to heels.',
  },
  squat: {
    id: 'squat', name: 'Squat',
    image: '/exercises/squat.svg', video: '/videos/squat.svg', thumbnail: '/thumbnails/squat_thumb.svg',
    muscle: 'Quads · Glutes · Hamstrings', muscleGroups: ['quads','glutes','hamstrings'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 8,
    instructions: ['Stand feet shoulder-width apart', 'Push hips back and bend knees', 'Lower until thighs are parallel', 'Drive through heels to stand'],
    tips: 'Keep your chest up and knees tracking over toes.',
  },
  burpee: {
    id: 'burpee', name: 'Burpee',
    image: '/exercises/burpee.svg', video: '/videos/burpee.svg', thumbnail: '/thumbnails/burpee_thumb.svg',
    muscle: 'Full Body · Cardio', muscleGroups: ['chest','legs','core','cardio'],
    difficulty: 'Intermediate', difficultyLevel: 2,
    equipment: 'None', caloriesPerMinute: 12,
    instructions: ['Start standing, drop hands to floor', 'Jump feet back to plank', 'Do a push-up (optional)', 'Jump feet to hands', 'Explode up with jump'],
    tips: 'Pace yourself — burpees are a full-body cardio blast.',
  },
  plank: {
    id: 'plank', name: 'Plank Hold',
    image: '/exercises/plank.svg', video: '/videos/plank.svg', thumbnail: '/thumbnails/plank_thumb.svg',
    muscle: 'Core · Shoulders · Back', muscleGroups: ['core','shoulders','back'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 5,
    instructions: ['Forearms on floor, elbows under shoulders', 'Body forms straight line', 'Engage core, squeeze glutes', 'Hold without sagging'],
    tips: 'Breathe steadily. Quality beats duration.',
  },
  lunge: {
    id: 'lunge', name: 'Reverse Lunge',
    image: '/exercises/lunge.svg', video: '/videos/lunge.svg', thumbnail: '/thumbnails/lunge_thumb.svg',
    muscle: 'Quads · Glutes · Balance', muscleGroups: ['quads','glutes','balance'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 7,
    instructions: ['Stand tall, feet together', 'Step one foot back', 'Lower back knee near floor', 'Return and alternate legs'],
    tips: 'Keep front knee above ankle, torso upright.',
  },
  jumpingjack: {
    id: 'jumpingjack', name: 'Jumping Jacks',
    image: '/exercises/jumpingjack.svg', video: '/videos/jumpingjack.svg', thumbnail: '/thumbnails/jumpingjack_thumb.svg',
    muscle: 'Full Body · Cardio', muscleGroups: ['legs','shoulders','cardio'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 9,
    instructions: ['Stand with feet together, arms at sides', 'Jump feet wide, raise arms overhead', 'Jump back to start position', 'Repeat continuously'],
    tips: 'Land softly to reduce joint impact.',
  },
  mountainclimber: {
    id: 'mountainclimber', name: 'Mountain Climbers',
    image: '/exercises/mountainclimber.svg', video: '/videos/mountainclimber.svg', thumbnail: '/thumbnails/mountainclimber_thumb.svg',
    muscle: 'Core · Shoulders · Cardio', muscleGroups: ['core','shoulders','cardio'],
    difficulty: 'Intermediate', difficultyLevel: 2,
    equipment: 'None', caloriesPerMinute: 11,
    instructions: ['Start in high plank position', 'Drive one knee to chest rapidly', 'Switch legs in running motion', 'Keep hips level and core tight'],
    tips: 'The faster you go, the bigger the cardio hit.',
  },
  highknee: {
    id: 'highknee', name: 'High Knees',
    image: '/exercises/highknee.svg', video: '/videos/highknee.svg', thumbnail: '/thumbnails/highknee_thumb.svg',
    muscle: 'Hip Flexors · Cardio', muscleGroups: ['hipflexors','core','cardio'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 10,
    instructions: ['Run in place with high knee drive', 'Drive knees to hip height', 'Pump arms in opposition', 'Maintain upright posture'],
    tips: 'Drive your arms to increase intensity and speed.',
  },
  crunch: {
    id: 'crunch', name: 'Crunches',
    image: '/exercises/crunch.svg', video: '/videos/crunch.svg', thumbnail: '/thumbnails/crunch_thumb.svg',
    muscle: 'Upper Abs', muscleGroups: ['abs','core'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 5,
    instructions: ['Lie on back, knees bent', 'Hands behind head lightly', 'Curl upper body toward knees', 'Lower with control'],
    tips: 'Do not pull on neck. Exhale on the way up.',
  },
  deadlift: {
    id: 'deadlift', name: 'Deadlift',
    image: '/exercises/deadlift.svg', video: '/videos/deadlift.svg', thumbnail: '/thumbnails/deadlift_thumb.svg',
    muscle: 'Posterior Chain · Back', muscleGroups: ['hamstrings','glutes','back','traps'],
    difficulty: 'Intermediate', difficultyLevel: 2,
    equipment: 'Barbell', caloriesPerMinute: 9,
    instructions: ['Bar over mid-foot, hip-width stance', 'Hinge at hips, grab bar shoulder-width', 'Chest up, brace core tight', 'Drive hips forward to stand'],
    tips: 'Keep the bar close to your body the entire lift.',
  },
  benchpress: {
    id: 'benchpress', name: 'Bench Press',
    image: '/exercises/benchpress.svg', video: '/videos/benchpress.svg', thumbnail: '/thumbnails/benchpress_thumb.svg',
    muscle: 'Chest · Triceps · Delts', muscleGroups: ['chest','triceps','shoulders'],
    difficulty: 'Intermediate', difficultyLevel: 2,
    equipment: 'Barbell + Bench', caloriesPerMinute: 8,
    instructions: ['Lie on bench, eyes under bar', 'Grip slightly wider than shoulders', 'Lower bar to lower chest', 'Press up and slightly back'],
    tips: 'Retract shoulder blades and arch slightly for safety.',
  },
  overheadpress: {
    id: 'overheadpress', name: 'Overhead Press',
    image: '/exercises/overheadpress.svg', video: '/videos/overheadpress.svg', thumbnail: '/thumbnails/overheadpress_thumb.svg',
    muscle: 'Shoulders · Triceps · Core', muscleGroups: ['shoulders','triceps','core'],
    difficulty: 'Intermediate', difficultyLevel: 2,
    equipment: 'Barbell', caloriesPerMinute: 8,
    instructions: ['Bar at collarbone, grip shoulder-width', 'Brace core and glutes', 'Press bar straight up overhead', 'Lower with control to start'],
    tips: 'Do not flare elbows excessively. Keep neutral spine.',
  },
  pullup: {
    id: 'pullup', name: 'Pull-Up',
    image: '/exercises/pullup.svg', video: '/videos/pullup.svg', thumbnail: '/thumbnails/pullup_thumb.svg',
    muscle: 'Back · Biceps · Core', muscleGroups: ['back','biceps','core'],
    difficulty: 'Intermediate', difficultyLevel: 2,
    equipment: 'Pull-Up Bar', caloriesPerMinute: 9,
    instructions: ['Hang from bar, palms facing away', 'Engage lats, pull elbows to ribs', 'Chin clears the bar', 'Lower fully with control'],
    tips: 'Initiate with your lats, not just your arms.',
  },
  dip: {
    id: 'dip', name: 'Dips',
    image: '/exercises/dip.svg', video: '/videos/dip.svg', thumbnail: '/thumbnails/dip_thumb.svg',
    muscle: 'Triceps · Chest · Shoulders', muscleGroups: ['triceps','chest','shoulders'],
    difficulty: 'Intermediate', difficultyLevel: 2,
    equipment: 'Parallel Bars', caloriesPerMinute: 8,
    instructions: ['Support body on bars, arms straight', 'Lean forward slightly for chest', 'Lower until arms at 90°', 'Push back to full extension'],
    tips: 'Lean forward for chest focus, stay upright for triceps.',
  },
  kettlebell: {
    id: 'kettlebell', name: 'Kettlebell Swing',
    image: '/exercises/kettlebell.svg', video: '/videos/kettlebell.svg', thumbnail: '/thumbnails/kettlebell_thumb.svg',
    muscle: 'Glutes · Hamstrings · Core', muscleGroups: ['glutes','hamstrings','core','cardio'],
    difficulty: 'Intermediate', difficultyLevel: 2,
    equipment: 'Kettlebell', caloriesPerMinute: 12,
    instructions: ['Hinge at hips, swing bell between legs', 'Explode hips forward powerfully', 'Swing to chest height', 'Hinge back and repeat'],
    tips: 'Power comes from hips, not arms. Snap those hips.',
  },
  boxjump: {
    id: 'boxjump', name: 'Box Jumps',
    image: '/exercises/boxjump.svg', video: '/videos/boxjump.svg', thumbnail: '/thumbnails/boxjump_thumb.svg',
    muscle: 'Legs · Explosive Power', muscleGroups: ['quads','glutes','calves','power'],
    difficulty: 'Intermediate', difficultyLevel: 2,
    equipment: 'Box / Platform', caloriesPerMinute: 11,
    instructions: ['Stand arm-length from box', 'Swing arms, dip into quarter squat', 'Explode up and forward', 'Land softly on box, step down'],
    tips: 'Land with bent knees to absorb impact safely.',
  },
  thruster: {
    id: 'thruster', name: 'Thruster',
    image: '/exercises/thruster.svg', video: '/videos/thruster.svg', thumbnail: '/thumbnails/thruster_thumb.svg',
    muscle: 'Full Body · Power', muscleGroups: ['quads','shoulders','core','power'],
    difficulty: 'Advanced', difficultyLevel: 3,
    equipment: 'Barbell / Dumbbells', caloriesPerMinute: 14,
    instructions: ['Hold bar at shoulders in front squat position', 'Squat to full depth', 'Drive up from bottom', 'Use momentum to press overhead'],
    tips: 'The squat and press must be one fluid movement.',
  },
  jumprope: {
    id: 'jumprope', name: 'Jump Rope',
    image: '/exercises/jumprope.svg', video: '/videos/jumprope.svg', thumbnail: '/thumbnails/jumprope_thumb.svg',
    muscle: 'Calves · Cardio · Coordination', muscleGroups: ['calves','cardio','coordination'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'Jump Rope', caloriesPerMinute: 12,
    instructions: ['Hold handles at hip height', 'Jump 1-2 inches off ground', 'Rotate rope with wrists', 'Land on balls of feet'],
    tips: 'Keep elbows close to ribs, use wrist rotation not arms.',
  },
  shadowbox: {
    id: 'shadowbox', name: 'Shadow Boxing',
    image: '/exercises/shadowbox.svg', video: '/videos/shadowbox.svg', thumbnail: '/thumbnails/shadowbox_thumb.svg',
    muscle: 'Shoulders · Core · Cardio', muscleGroups: ['shoulders','core','cardio'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 10,
    instructions: ['Assume fighting stance', 'Throw jabs, crosses, hooks, uppercuts', 'Move your feet constantly', 'Breathe on each punch'],
    tips: 'Visualize an opponent. Stay light on your feet.',
  },
  downdog: {
    id: 'downdog', name: 'Downward Dog',
    image: '/exercises/downdog.svg', video: '/videos/downdog.svg', thumbnail: '/thumbnails/downdog_thumb.svg',
    muscle: 'Hamstrings · Calves · Back', muscleGroups: ['hamstrings','calves','back','flexibility'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'Yoga Mat', caloriesPerMinute: 3,
    instructions: ['Start on hands and knees', 'Lift hips up and back', 'Form inverted V-shape', 'Press heels toward floor'],
    tips: 'Bend knees slightly if hamstrings are tight.',
  },
  legraise: {
    id: 'legraise', name: 'Leg Raises',
    image: '/exercises/legraise.svg', video: '/videos/legraise.svg', thumbnail: '/thumbnails/legraise_thumb.svg',
    muscle: 'Lower Abs · Hip Flexors', muscleGroups: ['abs','hipflexors','core'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 5,
    instructions: ['Lie flat, legs straight', 'Raise legs to 90°', 'Lower with control', 'Do not let heels touch floor'],
    tips: 'Press lower back into floor throughout.',
  },
  russiantwist: {
    id: 'russiantwist', name: 'Russian Twist',
    image: '/exercises/russiantwist.svg', video: '/videos/russiantwist.svg', thumbnail: '/thumbnails/russiantwist_thumb.svg',
    muscle: 'Obliques · Core', muscleGroups: ['obliques','core'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None / Weight', caloriesPerMinute: 5,
    instructions: ['Sit with knees bent, lean back 45°', 'Lift feet off floor (harder)', 'Twist torso side to side', 'Touch floor beside each hip'],
    tips: 'Hold a weight to increase difficulty.',
  },
  walkingwarmup: {
    id: 'walkingwarmup', name: 'Warm-Up Walk',
    image: '/exercises/walkingwarmup.svg', video: '/videos/walkingwarmup.svg', thumbnail: '/thumbnails/walkingwarmup_thumb.svg',
    muscle: 'Full Body · Prep', muscleGroups: ['cardio'],
    difficulty: 'Beginner', difficultyLevel: 1,
    equipment: 'None', caloriesPerMinute: 4,
    instructions: ['Walk at easy pace', 'Gradually increase speed', 'Swing arms naturally', 'Focus on breathing'],
    tips: 'Use this time to mentally prepare for the workout.',
  },
  sprint: {
    id: 'sprint', name: 'Sprint',
    image: '/exercises/sprint.svg', video: '/videos/sprint.svg', thumbnail: '/thumbnails/sprint_thumb.svg',
    muscle: 'Legs · Cardio · Power', muscleGroups: ['quads','hamstrings','cardio','power'],
    difficulty: 'Advanced', difficultyLevel: 3,
    equipment: 'None', caloriesPerMinute: 16,
    instructions: ['Drive off back foot explosively', 'Pump arms powerfully', 'Lift knees high', 'Lean forward slightly'],
    tips: 'Breathe rhythmically. Give maximum effort.',
  },
};

// Map exercise name → key for lookup
export const EXERCISE_NAME_MAP = Object.fromEntries(
  Object.entries(EXERCISE_DB).map(([k, v]) => [v.name.toLowerCase(), k])
);

export function getExerciseMeta(name) {
  if (!name) return null;
  const key = name.toLowerCase().replace(/[^a-z]/g, '');
  // direct key
  if (EXERCISE_DB[key]) return EXERCISE_DB[key];
  // partial match
  const match = Object.keys(EXERCISE_DB).find(k => k.includes(key) || key.includes(k));
  return match ? EXERCISE_DB[match] : null;
}

export const MUSCLE_GROUPS = [
  'all','chest','back','shoulders','biceps','triceps','core','abs','quads','hamstrings','glutes','calves','cardio','flexibility'
];

export const DIFFICULTY_LEVELS = [
  { id: 'all', label: 'All Levels', color: '#94A3B8' },
  { id: 'Beginner', label: 'Beginner', color: '#34D399' },
  { id: 'Intermediate', label: 'Intermediate', color: '#F59E0B' },
  { id: 'Advanced', label: 'Advanced', color: '#EF4444' },
];
