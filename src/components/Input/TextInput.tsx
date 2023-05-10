import type { Ref } from 'react';
import { forwardRef, useId } from 'react';

export const TextInput: React.FC<{
  required?: boolean;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  defaultValue?: string;
}> = forwardRef(({ required, label, placeholder, maxLength, defaultValue, ...props }, ref) => {
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
        maxLength={maxLength}
        defaultValue={defaultValue}
        ref={ref as Ref<HTMLInputElement>}
        {...props}
      />
    </div>
  );
});

TextInput.displayName = 'TextInput';
