import * as React from "react"

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <span
          className={`${
            checked ? 'bg-red-600' : 'bg-gray-200'
          } inline-block h-6 w-11 rounded-full transition-colors`}
        />
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform`}
        />
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
