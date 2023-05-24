import { useId } from 'react';
import { TbSelector } from 'react-icons/tb';

export const Select: React.FC<{
  label?: string;
  options: {
    value: string;
    label: string;
  }[];
  value: string | string[] | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ label, options, value, onChange }) => {
  const id = useId();

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={id} className="w-fit font-medium">
          {label}
        </label>
      )}

      <div className="relative flex items-center rounded border border-neutral-300 bg-white text-sm text-neutral-800">
        <select
          className="h-10 w-full appearance-none bg-transparent pl-3 pr-8"
          id={id}
          value={value}
          onChange={onChange}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <TbSelector size={16} className="pointer-events-none absolute right-3" />
      </div>
    </div>
  );
};
