import React from 'react';
import { FormData } from '../types';
import { ICONS } from '../constants';
import { formatDob } from '../services/utils';

interface QuotationFormProps {
    formData: FormData;
    onChange: (data: FormData) => void;
    onSubmit: () => void;
    isLoading: boolean;
    error: string | null;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ formData, onChange, onSubmit, isLoading, error }) => {
    
    const handleChange = (field: keyof FormData, value: string) => {
        onChange({ ...formData, [field]: value });
    };

    const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = formatDob(e.target.value);
        handleChange('dob', val);
    };

    const IconOption = ({ 
        label, 
        selected, 
        icon, 
        onClick 
    }: { 
        label: string; 
        selected: boolean; 
        icon: React.ReactNode; 
        onClick: () => void; 
    }) => (
        <div 
            onClick={onClick}
            className={`
                flex-1 cursor-pointer p-4 rounded-lg flex items-center justify-center gap-3 shadow-sm border-2 transition-all duration-200
                ${selected 
                    ? 'border-[var(--primary-color)] bg-blue-50 text-[var(--primary-color)]' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
            `}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </div>
    );

    return (
        <main className="mx-auto bg-white rounded-xl shadow-2xl mt-8 w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-6 md:p-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-800">Generate Quotation Anda</h2>
                <p className="text-gray-500 mt-2 text-md">Sila isikan butiran peribadi dan jenis pelan yang diminati.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Plan Selection */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pilihan Pelan</label>
                        <div className="flex gap-4">
                            <IconOption 
                                label="Medical Card" 
                                selected={formData.planType === 'medical'}
                                icon={ICONS.creditCard}
                                onClick={() => handleChange('planType', 'medical')}
                            />
                            <IconOption 
                                label="Hibah Takaful" 
                                selected={formData.planType === 'hibah'}
                                icon={ICONS.handCoins}
                                onClick={() => handleChange('planType', 'hibah')}
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nama Penuh</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all"
                            placeholder="Contoh: Ahmad bin Ali"
                            required
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>

                    {/* DOB */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tarikh Lahir (DD/MM/YYYY)</label>
                        <input 
                            type="text"
                            inputMode="numeric"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all"
                            placeholder="Contoh: 31/01/1990"
                            maxLength={10}
                            required
                            value={formData.dob}
                            onChange={handleDobChange}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombor Telefon</label>
                        <input 
                            type="tel" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all"
                            placeholder="Contoh: 60123456789"
                            required
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>

                    {/* Occupation */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pekerjaan (Class 1/2 sahaja)</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all"
                            placeholder="Contoh: Eksekutif Pemasaran"
                            required
                            value={formData.occupation}
                            onChange={(e) => handleChange('occupation', e.target.value)}
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Jantina</label>
                        <div className="flex gap-4">
                            <IconOption 
                                label="Lelaki" 
                                selected={formData.gender === 'lelaki'}
                                icon={ICONS.mars}
                                onClick={() => handleChange('gender', 'lelaki')}
                            />
                            <IconOption 
                                label="Perempuan" 
                                selected={formData.gender === 'perempuan'}
                                icon={ICONS.venus}
                                onClick={() => handleChange('gender', 'perempuan')}
                            />
                        </div>
                    </div>

                    {/* Smoker */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Status Merokok</label>
                        <div className="flex gap-4">
                            <IconOption 
                                label="Tidak" 
                                selected={formData.smoker === 'tidak'}
                                icon={ICONS.cigaretteOff}
                                onClick={() => handleChange('smoker', 'tidak')}
                            />
                            <IconOption 
                                label="Ya" 
                                selected={formData.smoker === 'ya'}
                                icon={ICONS.cigarette}
                                onClick={() => handleChange('smoker', 'ya')}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-gradient-to-r from-[var(--secondary-color)] to-[var(--primary-color)] text-white font-bold text-xl py-4 px-16 rounded-full transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                SEDANG MEMPROSES...
                            </span>
                        ) : 'KIRAKAN QUOTATION'}
                    </button>
                </div>
            </form>
            
            {error && (
                <div className="mt-6 text-center text-red-600 font-semibold text-lg animate-fade-in">
                    {error}
                </div>
            )}
        </main>
    );
};

export default QuotationForm;