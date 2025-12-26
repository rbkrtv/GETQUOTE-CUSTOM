import React from 'react';
import { BenefitItem } from '../types';
import { ICONS, BENEFIT_ICONS } from '../constants';

interface PlanCardProps {
    title: string;
    monthlyPrice: number | null | string;
    benefits: BenefitItem[];
    onSelect: () => void;
    children?: React.ReactNode;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, monthlyPrice, benefits, onSelect, children }) => {
    
    const isDisabled = monthlyPrice === null || monthlyPrice === 0;

    return (
        <div className="w-[92%] sm:w-[20rem] md:w-[22rem] lg:w-[24rem] mx-auto bg-white border border-gray-200 rounded-xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <h4 className="font-poppins text-2xl md:text-3xl font-semibold mb-2 text-[var(--primary-color)]">
                {title}
            </h4>
            
            <p className="text-gray-500 text-sm">Caruman Bulanan:</p>
            <p className="font-poppins text-5xl font-bold mb-6 text-[var(--primary-color)]">
                RM{typeof monthlyPrice === 'number' ? monthlyPrice.toFixed(2) : '0.00'}
            </p>

            {/* Custom Inputs like Checkboxes passed as children */}
            {children}

            <div className="space-y-4 flex-grow mb-6">
                {benefits.map((b, idx) => {
                    // Check if strikethrough logic applies (optional check based on benefit props, 
                    // but simple rendering for now)
                    return (
                        <div key={idx} className="flex items-center gap-3 text-gray-600">
                            <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-[var(--secondary-color)]">
                                {BENEFIT_ICONS[b.icon] || ICONS.check}
                            </div>
                            <div className="text-sm">
                                {b.text} <strong className="text-[var(--primary-color)]">{b.value}</strong>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button 
                onClick={onSelect}
                disabled={isDisabled}
                className="w-full mt-auto bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                Whatsapp Agent
            </button>
        </div>
    );
};

export default PlanCard;