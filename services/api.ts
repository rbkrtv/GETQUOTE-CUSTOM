import { AgentConfig, PricingData, PlanBenefits, Lead } from '../types';

const CONFIG_API_URL = "https://script.google.com/macros/s/AKfycbxBgNRcxnJg9DM0jn91REAucFDi3VuWGZ5KaCow7fPypuF80ga3e8fQSfajMW7TsCbr/exec";
const BENEFITS_API_URL = "https://script.google.com/macros/s/AKfycbzMKzsXrGF4dsMyaiYr7xp4jtuNtTxY1joHCssks4e2UZ6ivHjBQS4n5Yt5uc4oWfuzrQ/exec?type=benefits";
const DEFAULT_LEADS_URL = "https://script.google.com/macros/s/AKfycbw-fIKINGorPdwB3NA1Z8fUHlRJgr8xstiPKnRUo74OzT_l5Fk6t4bitORVmbD2yuW5/exec";

export const fetchAgentConfig = async (agentId: string): Promise<AgentConfig> => {
    const cacheKey = `agent_config_${agentId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        try {
            const data = JSON.parse(cached);
            // Apply default leads URL if missing even in cache
            if (!data.leadsUrl) {
                data.leadsUrl = DEFAULT_LEADS_URL;
            }
            return data;
        } catch (e) {
            console.error("Cache parse error", e);
        }
    }

    const res = await fetch(`${CONFIG_API_URL}?agent=${encodeURIComponent(agentId)}`);
    const data = await res.json();
    
    if (data.error) throw new Error(data.error);
    
    // Auto-fix: Inject default leads URL if not present in config
    if (!data.leadsUrl) {
        data.leadsUrl = DEFAULT_LEADS_URL;
    }
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
};

export const fetchPricingData = async (url: string, agentId: string): Promise<PricingData> => {
    const cacheKey = `pricing_data_${agentId}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        try {
            const data = JSON.parse(cached);
            const ageMs = Date.now() - (data._ts || 0);
            if (ageMs < 5 * 60 * 1000) { // 5 minutes cache
                return data;
            }
        } catch (e) {
            console.error("Pricing cache invalid", e);
        }
    }

    const res = await fetch(url);
    const data = await res.json();
    data._ts = Date.now();
    data._source = "Network";
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
};

export const fetchBenefits = async (): Promise<PlanBenefits> => {
    const cacheKey = "benefits_data_v1";
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            return parsed.hibah || {};
        } catch (e) { console.error(e); }
    }

    const res = await fetch(BENEFITS_API_URL);
    const data = await res.json();
    
    if (data && data.hibah) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data.hibah;
    }
    return {};
};

export const submitLead = async (url: string, data: any) => {
    // Use default if url is empty
    const targetUrl = url || DEFAULT_LEADS_URL;
    try {
        await fetch(targetUrl, {
            method: "POST",
            mode: "no-cors",
            // Change to text/plain to avoid CORS Preflight (OPTIONS) which GAS doesn't handle natively
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(data),
        });
    } catch (e) {
        // Silently fail to avoid console noise on network issues
    }
};

export const fetchLeads = async (url: string): Promise<Lead[]> => {
    const targetUrl = url || DEFAULT_LEADS_URL;
    
    try {
        // Use cache: 'no-store' instead of query param to avoid modifying the URL structure
        const res = await fetch(targetUrl, { 
            redirect: 'follow',
            cache: 'no-store'
        });
        
        if (!res.ok) {
            if (res.status === 404) {
                 throw new Error("Database URL not found (404). Check script deployment.");
            }
            throw new Error(`HTTP Error: ${res.status}`);
        }

        const text = await res.text();
        
        // Handle empty or whitespace-only response
        if (!text || !text.trim()) return [];

        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            // Check if content is HTML (likely an error page or login page)
            if (text.trim().startsWith('<')) {
                throw new Error("URL returned HTML instead of JSON. Check script permissions (Everyone) and URL ending (/exec).");
            }
            throw new Error("Invalid Data Format.");
        }

        // Handle case where script returns null (valid JSON but not array)
        if (json === null) return [];

        // Handle standard Google Script responses which might be an array or object with data array
        if (Array.isArray(json)) return json;
        if (json.data && Array.isArray(json.data)) return json.data;
        
        // If object but not matching expected structure
        return [];
    } catch (e: any) {
        // Suppress console.error for common fetch errors to avoid noise
        const msg = e.message || '';
        if (msg === 'Failed to fetch' || msg.includes('NetworkError') || msg.includes('Network request failed')) {
             throw new Error("Connection Failed. Check URL permissions (Access: Anyone) or CORS.");
        }
        throw e;
    }
};