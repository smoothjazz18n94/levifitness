export default function EquipmentTag({ equipment }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ background: 'rgba(255,255,255,0.06)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }}>
      🏋 {equipment || 'None'}
    </span>
  );
}
