import React from "react";
import { DeleteIcon, Trash2Icon } from "lucide-react";

interface NumericKeypadProps {
  value: string;
  onChange: (newValue: string) => void;
  maxLength?: number;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ value, onChange, maxLength = 6 }) => {
  const handleDigit = (digit: string) => {
    if (value.length < maxLength) {
      onChange(value + digit);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            type="button"
            key={digit}
            disabled={value.length >= maxLength}
            onClick={() => handleDigit(digit)}
            className="bg-zinc-700 text-white py-2 rounded hover:bg-zinc-800 disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={handleBackspace}
          className="bg-red-300 text-red-900 py-2 rounded hover:bg-red-400 flex items-center justify-center"
        >
          <DeleteIcon size={20} />
        </button>
        <button
          type="button"
          disabled={value.length >= maxLength}
          onClick={() => handleDigit("0")}
          className="bg-zinc-700 text-white py-2 rounded hover:bg-zinc-800 disabled:opacity-50"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          className="bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center"
        >
          <Trash2Icon size={20} />
        </button>
      </div>
      <input
        type="text"
        value={"*".repeat(value.length)}
        disabled
        className="mt-2 text-xl font-bold font-mono text-center bg-white border-2 border-zinc-600 shadow-md p-3 w-full text-zinc-800"
      />
    </div>
  );
};

export default NumericKeypad;
