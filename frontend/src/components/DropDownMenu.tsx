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

    const handleSelect = (value: string) => {
        onSelect?.(value);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {label}
            </button>
            {isOpen && (
                <div className="absolute right-0 z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="py-1">
                        {options.map((option) =>
                            option.href ? (
                                <a
                                    key={option.value}
                                    href={option.href}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {option.label}
                                </a>
                        ) : (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
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