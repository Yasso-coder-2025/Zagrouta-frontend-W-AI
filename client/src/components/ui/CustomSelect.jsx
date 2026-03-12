import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function CustomSelect({ value, onChange, options, placeholder, className = "", defaultValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || (options.length > 0 ? (typeof options[0] === 'object' ? options[0].value : options[0]) : ""));
  const dropdownRef = useRef(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => typeof opt === 'object' ? opt.value === currentValue : opt === currentValue);
  const displayLabel = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center outline-none transition ${className}`}
      >
        <span className="truncate">{displayLabel || "اختر..."}</span>
        <ChevronDown size={20} className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#8c71af]' : 'text-gray-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <ul className="max-h-60 overflow-y-auto">
            {options.map((opt, index) => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              const isSelected = currentValue === optValue;
              
              return (
                <li key={index} className="border-b border-gray-50 last:border-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isControlled) setInternalValue(optValue);
                      if (onChange) onChange({ target: { value: optValue } });
                      setIsOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 font-bold transition flex items-center justify-between ${isSelected ? 'bg-gradient-to-br from-blue-50 to-pink-50 text-[#8c71af]' : 'text-gray-600 hover:bg-gray-50 hover-text-gradient-primary'}`}
                  >
                    {optLabel}
                    {isSelected && <span className="text-[#8c71af]">✔</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
