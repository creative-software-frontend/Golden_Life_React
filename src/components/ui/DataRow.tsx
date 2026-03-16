import React from 'react';

interface DataRowProps {
    label: string;
    // ReactNode allows strings, numbers, undefined, null, and JSX elements!
    value?: React.ReactNode; 
    // Added this so TypeScript knows isLast is a valid, optional boolean prop
    isLast?: boolean;        
}

export default function DataRow({ label, value, isLast = false }: DataRowProps) {
    return (
        // I added a conditional border bottom using the isLast prop
        <div className={`flex flex-col mb-4 ${!isLast ? 'border-b border-gray-100 pb-4' : ''}`}>
            <span className="text-sm text-gray-500 mb-1">{label}</span>
            <span className="text-base text-gray-800 font-medium">
                {/* Fallback to a dash '-' if the value is missing/undefined */}
                {value || '-'}
            </span>
        </div>
    );
}