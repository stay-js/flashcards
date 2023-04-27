import { useId } from 'react';

export const TextInput: React.FC<{
  required?: boolean;
  label?: string;
  placeholder?: string;
  value: string | string[] | undefined;
  error?: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ required, label, placeholder, value, error, maxLength, onChange }) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="w-fit font-medium">
          {label}
        </label>
      )}

      <input
        required={required}
        className="h-10 w-full rounded border border-neutral-300 px-3 text-black"
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
      />

      {error && <p className="mb-0 text-xs text-red-500">{error}</p>}
    </div>
  );
};
