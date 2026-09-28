import toast from "react-hot-toast";
import { Copy, Wand2 } from "lucide-react";

import Button from "@/components/common/Button";
import FormField, { inputClass } from "@/components/common/FormField";
import { generatePassword } from "@/utils/password";

// A visible password box with "Generate" and "Copy", so the admin can give it to the user
export default function TempPasswordField({ value, onChange, error, id = "password", label = "Temporary password" }) {
  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Password copied");
    } catch {
      toast.error("Could not copy. Select the text and copy it manually.");
    }
  };

  return (
    <FormField
      label={label}
      htmlFor={id}
      required
      error={error}
      hint="At least 8 characters. The user must change it at their first login."
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          className={`${inputClass} font-mono`}
        />
        <div className="flex gap-2">
          <Button variant="secondary" icon={Wand2} onClick={() => onChange(generatePassword())}>
            Generate
          </Button>
          <Button variant="secondary" icon={Copy} onClick={handleCopy} aria-label="Copy password" />
        </div>
      </div>
    </FormField>
  );
}