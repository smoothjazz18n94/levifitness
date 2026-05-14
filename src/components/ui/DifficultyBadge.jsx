export default function DifficultyBadge({ difficulty, small }) {
  const map = { Beginner: '#34D399', Intermediate: '#F59E0B', Advanced: '#EF4444' };
  const color = map[difficulty] || '#94A3B8';
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ${small ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'}`}
      style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
    >
      {difficulty || 'All Levels'}
    </span>
  );
}
