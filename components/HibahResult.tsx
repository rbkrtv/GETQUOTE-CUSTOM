import React, { useState } from 'react';
import { FormData, QuotationResult, PlanBenefits, BenefitItem } from '../types';
import PlanCard from './PlanCard';

interface HibahResultProps {
    formData: FormData;
    result: QuotationResult;
    benefits: PlanBenefits;
}

const HibahResult: React.FC<HibahResultProps> = ({ formData, result, benefits }) => {
    
    // Independent states for checkboxes for Nova and Chinta cards
    const [novaAddons, setNovaAddons] = useState({ waiver: false, ci: false });
    const [chintaAddons, setChintaAddons] = useState({ waiver: false, ci: false });

    // Handlers
    const handleNovaChange = (type: 'waiver' | 'ci') => {
        if (type === 'waiver') setNovaAddons({ waiver: !novaAddons.waiver, ci: false }); // Mutually exclusive in UI logic provided
        if (type === 'ci') setNovaAddons({ waiver: false, ci: !novaAddons.ci });
    };

    const handleChintaChange = (type: 'waiver' | 'ci') => {
        if (type === 'waiver') setChintaAddons({ waiver: !chintaAddons.waiver, ci: false });
        if (type === 'ci') setChintaAddons({ waiver: false, ci: !chintaAddons.ci });
    };

    const getNovaPrice = () => {
        if (novaAddons.ci && result.hibah?.novaCI) return result.hibah.novaCI;
        if (novaAddons.waiver && result.hibah?.novaWaiver) return result.hibah.novaWaiver;
        return result.hibah?.nova || null;
    };

    const getChintaPrice = () => {
        if (chintaAddons.ci && result.hibah?.chintaCI) return result.hibah.chintaCI;
        if (chintaAddons.waiver && result.hibah?.chintaWaiver) return result.hibah.chintaWaiver;
        return result.hibah?.chinta || null;
    };

    // Helper to map API icons/text to our local SVG keys
    const mapToSvgIcons = (items: BenefitItem[]): BenefitItem[] => {
        if (!items) return [];
        return items.map(item => {
            const lowerText = (item.text + ' ' + (item.value || '')).toLowerCase();
            let iconKey = item.icon;

            if (lowerText.includes('kematian') || lowerText.includes('lumpuh') || lowerText.includes('death')) iconKey = 'hibah';
            else if (lowerText.includes('khairat') || lowerText.includes('funeral')) iconKey = 'khairat';
            else if (lowerText.includes('tunai') || lowerText.includes('cash') || lowerText.includes('value') || lowerText.includes('saving')) iconKey = 'saving';
            else if (lowerText.includes('waiver')) iconKey = 'waiver';
            else if (lowerText.includes('kritikal') || lowerText.includes('critical') || lowerText.includes('cancer')) iconKey = 'kanser';
            else if (lowerText.includes('coverage') || lowerText.includes('tempoh') || lowerText.includes('sehingga') || lowerText.includes('expiry')) iconKey = 'coverage';
            else if (lowerText.includes('harga') || lowerText.includes('price') || lowerText.includes('fee')) iconKey = 'tag';
            else if (lowerText.includes('hospital') || lowerText.includes('bilik')) iconKey = 'bilik';
            else if (lowerText.includes('limit') || lowerText.includes('had')) iconKey = 'tahunan';

            return { ...item, icon: iconKey };
        });
    };

    const getNovaBenefits = () => {
        let items: BenefitItem[] = [];
        if (novaAddons.ci) items = benefits.novaCI || benefits.nova || [];
        else if (novaAddons.waiver) items = benefits.novaWaiver || benefits.nova || [];
        else items = benefits.nova || [];
        return mapToSvgIcons(items);
    };

    const getChintaBenefits = () => {
        let items: BenefitItem[] = [];
        if (chintaAddons.ci) items = benefits.chintaCI || benefits.chinta || [];
        else if (chintaAddons.waiver) items = benefits.chintaWaiver || benefits.chinta || [];
        else items = benefits.chinta || [];
        return mapToSvgIcons(items);
    };

    const sendWhatsapp = (plan: string, price: number | null) => {
        if (!price) return;
        const phone = (window as any).AGENT_WHATSAPP || "60173225153";
        const message = `Salam, saya berminat dengan Pakej Takaful - GETQUOTE.\n\n` +
            `Berikut adalah butiran saya:\n` +
            `*Nama:* ${formData.name}\n` +
            `*Umur Seterusnya:* ${result.nextBirthdayAge} Tahun\n` +
            `*Nombor Telefon:* ${formData.phone}\n` +
            `*Pekerjaan:* ${formData.occupation}\n` +
            `*Jantina:* ${formData.gender}\n` +
            `*Status Merokok:* ${formData.smoker}\n\n` +
            `*Pakej Pilihan:* ${plan}\n` +
            `*Caruman Bulanan:* RM${price.toFixed(2)}\n\n` +
            `Boleh bantu saya untuk langkah seterusnya? Terima kasih.`;
        
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const sendEvoWhatsapp = () => {
         const phone = (window as any).AGENT_WHATSAPP || "60173225153";
         const message = `Salam, saya berminat dengan Pakej Takaful - GETQUOTE.\n\n` +
            `Berikut adalah butiran saya:\n` +
            `*Nama:* ${formData.name}\n` +
            `*Umur Seterusnya:* ${result.nextBirthdayAge} Tahun\n` +
            `*Nombor Telefon:* ${formData.phone}\n` +
            `*Pekerjaan:* ${formData.occupation}\n` +
            `*Jantina:* ${formData.gender}\n` +
            `*Status Merokok:* ${formData.smoker}\n\n` +
            `*Pakej Pilihan:* Hibah Evo 50\n` +
            `*Caruman Bulanan:* RM50.00\n\n` +
            `*Manfaat Pelan:*\n` + 
            `- Kematian/Lumpuh: RM${result.hibah?.evo50.toLocaleString()}\n` +
            `- Nilai Tunai (Surrender Value)\n- Khairat Kematian: RM2,000\n` +
            `- Coverage: Sehingga Umur 80\n- Harga: Tetap\n\n` +
            `Boleh bantu saya untuk langkah seterusnya? Terima kasih.`;
            
         window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const evoBenefitsList = [
        { icon: 'hibah', text: 'Kematian/Lumpuh:', value: `RM${result.hibah?.evo50.toLocaleString() || 0}` },
        { icon: 'saving', text: 'Nilai Tunai', value: '(Surrender Value)' },
        { icon: 'khairat', text: 'Khairat Kematian:', value: 'RM2,000' },
        { icon: 'coverage', text: 'Coverage:', value: 'Sehingga Umur 80' },
        { icon: 'tag', text: 'Harga:', value: 'Tetap' }
    ];

    return (
        <section className="w-full max-w-7xl mx-auto mt-16 mb-20 animate-fade-in-up">
            <div className="text-center mb-12">
                <h2 className="font-poppins text-4xl md:text-5xl tracking-wide font-bold text-white drop-shadow-md">
                    Pakej Hibah Takaful
                </h2>
                <p className="text-white text-lg mt-2 opacity-90">
                    Nama: <span className="font-bold">{formData.name}</span> | Umur Seterusnya: <span className="font-bold">{result.nextBirthdayAge}</span> Tahun
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {/* NOVA */}
                <PlanCard 
                    title={`Hibah Nova${novaAddons.waiver ? ' (Waiver)' : novaAddons.ci ? ' (CI + Waiver)' : ''}`}
                    monthlyPrice={getNovaPrice()}
                    benefits={getNovaBenefits()}
                    onSelect={() => sendWhatsapp(`Hibah Nova${novaAddons.waiver ? ' (Waiver)' : novaAddons.ci ? ' (CI + Waiver)' : ''}`, getNovaPrice())}
                >
                    <div className="space-y-3 mb-6">
                        <label className={`flex items-center p-3 rounded-lg border ${!result.hibah?.novaWaiver ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-blue-50 border-blue-200 cursor-pointer'}`}>
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                checked={novaAddons.waiver}
                                onChange={() => handleNovaChange('waiver')}
                                disabled={!result.hibah?.novaWaiver}
                            />
                            <span className="ml-3 text-sm font-semibold text-gray-700">Add-on Waiver</span>
                        </label>
                         <label className={`flex items-center p-3 rounded-lg border ${!result.hibah?.novaCI ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-red-50 border-red-200 cursor-pointer'}`}>
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                                checked={novaAddons.ci}
                                onChange={() => handleNovaChange('ci')}
                                disabled={!result.hibah?.novaCI}
                            />
                            <span className="ml-3 text-sm font-semibold text-gray-700">Add-on CI + Waiver</span>
                        </label>
                    </div>
                </PlanCard>

                 {/* CHINTA */}
                 <PlanCard 
                    title={`Hibah Chinta${chintaAddons.waiver ? ' (Waiver)' : chintaAddons.ci ? ' (CI + Waiver)' : ''}`}
                    monthlyPrice={getChintaPrice()}
                    benefits={getChintaBenefits()}
                    onSelect={() => sendWhatsapp(`Hibah Chinta${chintaAddons.waiver ? ' (Waiver)' : chintaAddons.ci ? ' (CI + Waiver)' : ''}`, getChintaPrice())}
                >
                    <div className="space-y-3 mb-6">
                        <label className={`flex items-center p-3 rounded-lg border ${!result.hibah?.chintaWaiver ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-blue-50 border-blue-200 cursor-pointer'}`}>
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                checked={chintaAddons.waiver}
                                onChange={() => handleChintaChange('waiver')}
                                disabled={!result.hibah?.chintaWaiver}
                            />
                            <span className="ml-3 text-sm font-semibold text-gray-700">Add-on Waiver</span>
                        </label>
                         <label className={`flex items-center p-3 rounded-lg border ${!result.hibah?.chintaCI ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-red-50 border-red-200 cursor-pointer'}`}>
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                                checked={chintaAddons.ci}
                                onChange={() => handleChintaChange('ci')}
                                disabled={!result.hibah?.chintaCI}
                            />
                            <span className="ml-3 text-sm font-semibold text-gray-700">Add-on CI + Waiver</span>
                        </label>
                    </div>
                </PlanCard>

                {/* INSPIRASI */}
                <PlanCard 
                    title="Hibah Inspirasi"
                    monthlyPrice={result.hibah?.inspirasi || null}
                    benefits={mapToSvgIcons(benefits.inspirasi || [])}
                    onSelect={() => sendWhatsapp('Hibah Inspirasi', result.hibah?.inspirasi || null)}
                />

                {/* EVO 50 - Always shown if hibah selected in original code, usually as a budget option */}
                 <PlanCard 
                    title="Hibah Evo 50"
                    monthlyPrice={50.00}
                    benefits={evoBenefitsList}
                    onSelect={sendEvoWhatsapp}
                />
            </div>
        </section>
    );
};

export default HibahResult;