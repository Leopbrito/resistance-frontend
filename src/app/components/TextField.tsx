import { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export function TextField({ id, label, ...inputProps }: TextFieldProps) {
  return (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className="block font-body text-neutral-light text-sm tracking-wide uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        className="w-full px-5 py-4 bg-surface border-2 border-neutral rounded-lg
          text-white font-body placeholder-neutral
          focus:border-resistance focus:outline-none focus:shadow-[0_0_20px_rgba(0,217,255,0.3)]
          transition-all duration-300"
        {...inputProps}
      />
    </div>
  );
}
