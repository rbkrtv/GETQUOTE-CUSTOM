export interface AgentConfig {
    name: string;
    agency: string;
    company: string;
    photo: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    whatsapp: string;
    primaryColor?: string;
    secondaryColor?: string;
    hargaUrl: string;
    leadsUrl: string;
    error?: string;
}

export interface PricingItem {
    age: number;
    // Allow dynamic access for various pricing column names (e.g., l_s, p_basic, etc.)
    [key: string]: number | string;
}

export interface PricingData {
    medical150: PricingItem[];
    medical200: PricingItem[];
    hibahNova: PricingItem[];
    hibahNovaWaiver: PricingItem[];
    hibahNovaCI: PricingItem[];
    hibahChinta: PricingItem[];
    hibahChintaWaiver: PricingItem[];
    hibahChintaCI: PricingItem[];
    hibahInspirasi: PricingItem[];
    hibahEvo: PricingItem[];
    _ts?: number;
    _source?: string;
}

export interface BenefitItem {
    icon: string;
    text: string;
    value?: string;
}

export interface PlanBenefits {
    nova?: BenefitItem[];
    chinta?: BenefitItem[];
    inspirasi?: BenefitItem[];
    [key: string]: BenefitItem[] | undefined;
}

export interface FormData {
    planType: 'medical' | 'hibah' | '';
    name: string;
    dob: string;
    phone: string;
    occupation: string;
    gender: 'lelaki' | 'perempuan' | '';
    smoker: 'ya' | 'tidak' | '';
}

export interface Lead {
    timestamp?: string;
    date?: string;
    name: string;
    phone: string;
    planType: string;
    status?: string;
    [key: string]: any;
}

export interface QuotationResult {
    nextBirthdayAge: number;
    medical?: {
        basic150: number | null;
        full150: number | null;
        basic200: number | null;
        full200: number | null;
    };
    hibah?: {
        nova: number | null;
        novaWaiver: number | null;
        novaCI: number | null;
        chinta: number | null;
        chintaWaiver: number | null;
        chintaCI: number | null;
        inspirasi: number | null;
        evo50: number;
    };
}