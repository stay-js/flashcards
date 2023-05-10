import type { Ref } from 'react';
import { useId, forwardRef } from 'react';

export const Textarea: React.FC<{
  required?: boolean;
  label?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  defaultValue?: string;
}> = forwardRef(
  ({ required, label, placeholder, rows, maxLength, defaultValue, ...props }, ref) => {
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
          maxLength={maxLength}
          defaultValue={defaultValue}
          ref={ref as Ref<HTMLTextAreaElement>}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
