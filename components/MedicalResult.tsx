import React from 'react';
import { FormData, QuotationResult } from '../types';
import PlanCard from './PlanCard';

interface MedicalResultProps {
    formData: FormData;
    result: QuotationResult;
}

const MedicalResult: React.FC<MedicalResultProps> = ({ formData, result }) => {
    
    const sendWhatsapp = (planName: string, price: number | null) => {
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
            `*Pakej Pilihan:* ${planName}\n` +
            `*Caruman Bulanan:* RM${price.toFixed(2)}\n\n` +
            `Boleh bantu saya untuk langkah seterusnya? Terima kasih.`;
        
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const getMedicalBenefits = (roomRate: number, annualLimit: string) => [
        { icon: 'hibah', text: "Hibah Kematian/Lumpuh:", value: "RM15,000" },
        { icon: 'bilik', text: "Bilik Hospital:", value: `RM${roomRate} / hari` },
        { icon: 'tahunan', text: "Had Tahunan:", value: annualLimit },
        { icon: 'seumur', text: "Had Seumur Hidup:", value: "Tiada Had" },
        { icon: 'kanser', text: "Rawatan Kanser & Dialisis", value: "(Outpatient)" },
        { icon: 'klinik', text: "Rawatan Klinik 12 Penyakit", value: "(Outpatient)" },
        { icon: 'saving', text: "Nilai Tunai", value: "(Surrender Value)" },
        { icon: 'deductible', text: "Deductible:", value: "RM500" }
    ];

    const getFullBenefits = () => [
         { icon: 'waiver', text: "Waiver Sakit Kritikal", value: "" },
         { icon: 'elaun', text: "Elaun Wad Swasta:", value: "RM100 / hari" }
    ];

    return (
        <section className="w-full max-w-7xl mx-auto mt-16 mb-20 animate-fade-in-up">
             <div className="text-center mb-12">
                <h2 className="font-poppins text-4xl md:text-5xl tracking-wide font-bold text-white drop-shadow-md">
                    Pakej Medical Card
                </h2>
                <p className="text-white text-lg mt-2 opacity-90">
                    Nama: <span className="font-bold">{formData.name}</span> | Umur: <span className="font-bold">{result.nextBirthdayAge}</span> Tahun
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                <PlanCard 
                    title="Plan Basic Evolusi 150"
                    monthlyPrice={result.medical?.basic150 || null}
                    benefits={getMedicalBenefits(150, 'RM1.5 Juta')}
                    onSelect={() => sendWhatsapp('Plan Basic Evolusi 150', result.medical?.basic150 || null)}
                />
                <PlanCard 
                    title="Plan Premium Evolusi 150"
                    monthlyPrice={result.medical?.full150 || null}
                    benefits={[...getMedicalBenefits(150, 'RM1.5 Juta'), ...getFullBenefits()]}
                    onSelect={() => sendWhatsapp('Plan Premium Evolusi 150', result.medical?.full150 || null)}
                />
                 <PlanCard 
                    title="Plan Basic Evolusi 200"
                    monthlyPrice={result.medical?.basic200 || null}
                    benefits={getMedicalBenefits(200, 'RM2.0 Juta')}
                    onSelect={() => sendWhatsapp('Plan Basic Evolusi 200', result.medical?.basic200 || null)}
                />
                <PlanCard 
                    title="Plan Premium Evolusi 200"
                    monthlyPrice={result.medical?.full200 || null}
                    benefits={[...getMedicalBenefits(200, 'RM2.0 Juta'), ...getFullBenefits()]}
                    onSelect={() => sendWhatsapp('Plan Premium Evolusi 200', result.medical?.full200 || null)}
                />
            </div>
        </section>
    );
};

export default MedicalResult;