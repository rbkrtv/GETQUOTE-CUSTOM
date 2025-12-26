import React, { useState, useEffect } from 'react';
import { AgentConfig, PricingData, FormData, QuotationResult, PlanBenefits } from './types';
import { fetchAgentConfig, fetchPricingData, fetchBenefits, submitLead } from './services/api';
import { getAgentIdFromPath, calculateNextBirthdayAge, getHibahPremium } from './services/utils';
import AgentProfile from './components/AgentProfile';
import QuotationForm from './components/QuotationForm';
import MedicalResult from './components/MedicalResult';
import HibahResult from './components/HibahResult';

function App() {
    // Data State
    const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
    const [pricingData, setPricingData] = useState<PricingData | null>(null);
    const [benefits, setBenefits] = useState<PlanBenefits>({});
    
    // UI State
    const [isLoadingAgent, setIsLoadingAgent] = useState(true);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<FormData>({
        planType: '',
        name: '',
        dob: '',
        phone: '',
        occupation: '',
        gender: '',
        smoker: ''
    });

    // Result State
    const [result, setResult] = useState<QuotationResult | null>(null);

    useEffect(() => {
        const init = async () => {
            const agentId = getAgentIdFromPath();
            try {
                // Parallel fetch config and benefits
                const [config, ben] = await Promise.all([
                    fetchAgentConfig(agentId),
                    fetchBenefits()
                ]);
                
                setAgentConfig(config);
                setBenefits(ben);
                
                // Set global WhatsApp for external use if needed by legacy scripts, 
                // though we handle it in React now.
                (window as any).AGENT_WHATSAPP = config.whatsapp;

                // Set colors
                if (config.primaryColor) {
                    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
                } else {
                    document.documentElement.style.setProperty('--primary-color', '#1e3a8a'); // Default blue
                }
                if (config.secondaryColor) {
                    document.documentElement.style.setProperty('--secondary-color', config.secondaryColor);
                } else {
                    document.documentElement.style.setProperty('--secondary-color', '#3b82f6'); 
                }

                // Fetch Pricing immediately after config
                if (config.hargaUrl) {
                    const priceData = await fetchPricingData(config.hargaUrl, agentId);
                    setPricingData(priceData);
                }

            } catch (err) {
                console.error(err);
                setError("Failed to load agent data. Please refresh.");
            } finally {
                setIsLoadingAgent(false);
            }
        };

        init();
    }, []);

    const calculateQuotation = async () => {
        setFormError(null);
        setResult(null);

        // Validation
        if (!formData.planType || !formData.name || !formData.dob || !formData.phone || !formData.gender || !formData.smoker || !formData.occupation) {
            setFormError("Sila lengkapkan semua butiran di dalam borang.");
            return;
        }

        const nextBirthdayAge = calculateNextBirthdayAge(formData.dob);
        if (nextBirthdayAge < 1 || nextBirthdayAge > 70) {
            setFormError("Maaf, sebut harga hanya tersedia untuk umur yang sah.");
            return;
        }

        if (!pricingData) {
            // Pricing not loaded yet
            setIsCalculating(true);
            try {
                 // Retry mechanism could be here, but usually it loads fast
                 if (agentConfig?.hargaUrl) {
                     const priceData = await fetchPricingData(agentConfig.hargaUrl, getAgentIdFromPath());
                     setPricingData(priceData);
                 } else {
                     throw new Error("Data harga tidak dijumpai.");
                 }
            } catch (e) {
                setFormError("Gagal memuatkan data harga. Sila cuba sebentar lagi.");
                setIsCalculating(false);
                return;
            }
            setIsCalculating(false);
        }

        setIsCalculating(true);

        // Simulate calculation delay for UX
        setTimeout(() => {
            const age = nextBirthdayAge;
            const { gender, smoker, planType } = formData;
            
            const newResult: QuotationResult = { nextBirthdayAge: age };

            if (planType === 'medical' && pricingData) {
                // Medical Logic
                const p150 = pricingData.medical150.find(i => i.age === age);
                const p200 = pricingData.medical200.find(i => i.age === age);

                if (p150 && p200) {
                    // Logic based on original code
                    let basic150 = null, full150 = null, basic200 = null, full200 = null;

                    if (gender === 'perempuan') {
                        // Original code implies female non-smoker logic applies to females generally for some columns, 
                        // or strict checking.
                        // Assuming simple mapping:
                        if (smoker === 'tidak') {
                             basic150 = p150.p_basic as number;
                             full150 = p150.p_full as number;
                             basic200 = p200.p_basic as number;
                             full200 = p200.p_full as number;
                        } else {
                            // Original code fallback to male logic ?? 
                            // Re-reading original: if gender=perempuan && smoker=tidak -> p_basic. 
                            // Else -> checks smoker logic on l_s vs l_ns. 
                            // This implies female smoker uses Male Smoker rates in the original logic? 
                            // Or the original code was incomplete for Female Smokers.
                            // We will use Male Smoker rates for Female Smokers if that's what the original implied,
                            // OR strictly follow the original `else` block which handles male.
                            basic150 = smoker === 'ya' ? p150.l_s_basic as number : p150.l_ns_basic as number;
                            full150 = smoker === 'ya' ? p150.l_s_full as number : p150.l_ns_full as number;
                            basic200 = smoker === 'ya' ? p200.l_s_basic as number : p200.l_ns_basic as number;
                            full200 = smoker === 'ya' ? p200.l_s_full as number : p200.l_ns_full as number;
                        }
                    } else {
                         // Male
                        basic150 = smoker === 'ya' ? p150.l_s_basic as number : p150.l_ns_basic as number;
                        full150 = smoker === 'ya' ? p150.l_s_full as number : p150.l_ns_full as number;
                        basic200 = smoker === 'ya' ? p200.l_s_basic as number : p200.l_ns_basic as number;
                        full200 = smoker === 'ya' ? p200.l_s_full as number : p200.l_ns_full as number;
                    }

                    newResult.medical = { basic150, full150, basic200, full200 };
                }
            } else if (planType === 'hibah' && pricingData) {
                // Hibah Logic
                const novaAge = age < 25 ? 25 : age;
                const chintaAge = age < 20 ? 20 : age;

                const novaItem = pricingData.hibahNova.find(i => i.age === novaAge);
                const novaWItem = pricingData.hibahNovaWaiver?.find(i => i.age === novaAge);
                const novaCIItem = pricingData.hibahNovaCI?.find(i => i.age === novaAge);

                const chintaItem = pricingData.hibahChinta.find(i => i.age === chintaAge);
                const chintaWItem = pricingData.hibahChintaWaiver?.find(i => i.age === chintaAge);
                const chintaCIItem = pricingData.hibahChintaCI?.find(i => i.age === chintaAge);
                
                const inspirasiItem = pricingData.hibahInspirasi.find(i => i.age === age);
                const evoItem = pricingData.hibahEvo?.find(i => i.age === age);

                // Inspirasi
                let inspirasiPremium: number | null = null;
                if (inspirasiItem) {
                    if (gender === 'perempuan') {
                        inspirasiPremium = (smoker === 'ya' ? inspirasiItem.p_s : inspirasiItem.p_ns) as number;
                    } else {
                        inspirasiPremium = (smoker === 'ya' ? inspirasiItem.l_s : inspirasiItem.l_ns) as number;
                    }
                }

                // Evo 50 Value
                let evo50Value: number = 0;
                if (evoItem) {
                    if (gender === 'perempuan') {
                        evo50Value = evoItem.rm50_p as number;
                    } else {
                        evo50Value = (smoker === 'ya' ? evoItem.rm50_ls : evoItem.rm50_lns) as number;
                    }
                }

                newResult.hibah = {
                    nova: getHibahPremium(novaItem, gender, smoker),
                    novaWaiver: getHibahPremium(novaWItem, gender, smoker),
                    novaCI: getHibahPremium(novaCIItem, gender, smoker),
                    chinta: getHibahPremium(chintaItem, gender, smoker),
                    chintaWaiver: getHibahPremium(chintaWItem, gender, smoker),
                    chintaCI: getHibahPremium(chintaCIItem, gender, smoker),
                    inspirasi: inspirasiPremium,
                    evo50: evo50Value
                };
            }

            setResult(newResult);
            setIsCalculating(false);
            
            // Submit Lead
            if (agentConfig?.leadsUrl) {
                submitLead(agentConfig.leadsUrl, { ...formData, agentId: getAgentIdFromPath() });
            }

            // Scroll to results
            const resultSection = document.getElementById('results-section');
            if(resultSection) resultSection.scrollIntoView({ behavior: 'smooth' });

        }, 800);
    };

    const handleConfigUpdate = (newConfig: AgentConfig) => {
        setAgentConfig(newConfig);
        // Also update the global variable if needed for legacy compatibility during runtime
        (window as any).AGENT_WHATSAPP = newConfig.whatsapp;
    };

    return (
        <div className="min-h-screen bg-[var(--primary-color)] transition-colors duration-500 pb-20">
            {/* Header */}
            <header className="w-full max-w-6xl mx-auto pt-10 pb-6 text-center px-4">
                <h1 className="font-poppins text-4xl sm:text-5xl md:text-7xl text-white tracking-wide font-bold drop-shadow-lg">
                    GET QUOTE
                </h1>
                <p className="text-white text-lg md:text-xl mt-2 opacity-90">
                    Platform Quotation Online
                </p>
            </header>

            {/* Content */}
            {error ? (
                <div className="text-white text-center text-xl mt-10">{error}</div>
            ) : (
                <>
                    <AgentProfile 
                        config={agentConfig} 
                        isLoading={isLoadingAgent} 
                        onUpdate={handleConfigUpdate}
                    />
                    
                    <QuotationForm 
                        formData={formData} 
                        onChange={setFormData} 
                        onSubmit={calculateQuotation}
                        isLoading={isCalculating}
                        error={formError}
                    />

                    <div id="results-section">
                        {result && formData.planType === 'medical' && (
                            <MedicalResult formData={formData} result={result} />
                        )}
                        {result && formData.planType === 'hibah' && (
                            <HibahResult formData={formData} result={result} benefits={benefits} />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default App;