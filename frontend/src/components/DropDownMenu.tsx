import React, { useState, useRef, useEffect } from 'react';

type DropdownProps = {
    label: string;
    options: Option[];
    onSelect?: (option: string) => void;
}

type Option = {
    label: string;
    value: string;
    href?: string;
}

const DropdownDownMenu: React.FC<DropdownProps> = ({ label, options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
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

    const handleSelect = (option: Option) => {
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
                className="inline-flex justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                {displayText}
            </button>
            {isOpen && (
                <div className="absolute right-0 z-10 w-full mt-2 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-2">
                        {options.map((option) =>
                            option.href ? (
                                <a
                                    key={option.value}
                                    href={option.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    {option.label}
                                </a>
                        ) : (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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