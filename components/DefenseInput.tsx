"use client";

interface DefenseInputProps {
  defense: string;
  onDefenseChange: (defense: string) => void;
}

export default function DefenseInput({
  defense,
  onDefenseChange,
}: DefenseInputProps) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-200">
        Defend Yourself (optional)
      </label>
      <textarea
        value={defense}
        onChange={(e) => onDefenseChange(e.target.value)}
        placeholder="Type your excuse here... (Warning: the AI will roast you harder)"
        className="w-full resize-none rounded-xl border border-slate-500/70 bg-slate-950/65 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-900/50"
        rows={3}
      />
      <p className="mt-1 text-xs text-slate-400">
        Your defense is sent with your image to shape the roast.
      </p>
    </div>
  );
}
