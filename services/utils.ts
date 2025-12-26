import { PricingItem } from '../types';

export const calculateNextBirthdayAge = (dob: string): number => {
    let birthDate: Date;
    if (dob.includes('/')) {
        const parts = dob.split('/');
        // Assuming DD/MM/YYYY
        birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
        // Fallback for YYYY-MM-DD if input type is date
        birthDate = new Date(dob);
    }
    
    const today = new Date();
    if (isNaN(birthDate.getTime())) return 0;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // Check if birthday has happened this year, if not subtract 1
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age + 1; // Next birthday age
};

export const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "N/A";
    return value.toFixed(2);
};

export const getHibahPremium = (item: PricingItem | undefined, gender: string, smoker: string): number | null => {
    if (!item) return null;
    
    let val: number | string | undefined;

    if (gender === 'perempuan') {
        if (smoker === 'tidak') {
            val = item.p || item['p waiver'] || item.P || item['P Waiver'] || item.p_waiver || item.P_Waiver;
        } else {
            // Usually female smoker logic mimics female non-smoker in some structures, or has p_s
            // Based on original code logic:
             val = item.p || item['p waiver'] || item.P || item['P Waiver'] || item.p_waiver || item.P_Waiver;
        }
    } else {
        // Male
        if (smoker === 'ya') {
            val = item.l_s || item['l_s waiver'] || item.L_S || item['L_S Waiver'] || item.l_s_waiver || item.L_S_Waiver;
        } else {
            val = item.l_ns || item['l_ns waiver'] || item.L_NS || item['L_NS Waiver'] || item.l_ns_waiver || item.L_NS_Waiver;
        }
    }
    
    return typeof val === 'number' ? val : null;
};

export const getAgentIdFromPath = (): string => {
    const hostname = window.location.hostname;
    // Localhost or preview domains default to demo agent
    if (hostname.includes('googleusercontent') || hostname.includes('localhost') || hostname === '') {
        return 'bj';
    }

    const path = window.location.pathname; 
    const parts = path.split('/').filter(Boolean);
    if (!parts.length) return 'bj';
    
    const candidate = parts[parts.length - 1].toLowerCase();
    if (candidate.includes('index.html') || candidate.includes('preview')) return 'bj';
    
    return candidate;
};

export const formatDob = (value: string): string => {
    let input = value.replace(/\D/g, '');
    if (input.length > 8) input = input.substring(0, 8);
    
    if (input.length > 4) {
        return input.substring(0, 2) + '/' + input.substring(2, 4) + '/' + input.substring(4);
    } else if (input.length > 2) {
        return input.substring(0, 2) + '/' + input.substring(2);
    }
    return input;
};