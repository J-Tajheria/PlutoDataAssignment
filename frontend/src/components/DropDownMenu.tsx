import React, { useState, useRef, useEffect } from 'react';
import { DropdownOption } from '../types';

type DropdownProps = {
    label: string;
    options: DropdownOption[];
    onSelect?: (option: string) => void;
}

const DropdownDownMenu: React.FC<DropdownProps> = ({ label, options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => { 
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: DropdownOption) => {
        setSelectedOption(option);
        onSelect?.(option.value);
        setIsOpen(false);
    };

    // Display selected option label or fallback to original label
    const displayText = selectedOption ? selectedOption.label : label;

    return (
        <div ref={dropdownRef} className="relative inline-block text-left w-full">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
            >
                <span className="truncate">{displayText}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 z-10 w-full mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-2">
                        {options.map((option) =>
                            option.href ? (
                                <a
                                    key={option.value}
                                    href={option.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                                >
                                    {option.label}
                                </a>
                        ) : (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                            >
                                {option.label}
                            </button>
                        )
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default DropdownDownMenu;