export default function MuscleTag({ muscle, color = '#A855F7' }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}
    >
      💪 {muscle}
    </span>
  );
}
