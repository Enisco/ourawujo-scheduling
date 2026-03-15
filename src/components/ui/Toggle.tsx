'use client';
interface Props { checked: boolean; onChange: (v: boolean) => void; }
export function Toggle({ checked, onChange }: Props) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="toggle-track">
        <div className="toggle-thumb" />
      </div>
    </label>
  );
}
