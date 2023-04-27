import { useId } from 'react';

export const Textarea: React.FC<{
  required?: boolean;
  label?: string;
  placeholder?: string;
  rows: number;
  value: string | undefined;
  error?: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ required, label, placeholder, rows, value, error, maxLength, onChange }) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="w-fit font-medium">
          {label}
        </label>
      )}

      <textarea
        required={required}
        className="w-full resize-none rounded border border-neutral-300 px-3 py-2 text-black"
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />

      {error && <p className="mb-0 text-xs text-red-500">{error}</p>}
    </div>
  );
};
