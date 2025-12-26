import { AgentConfig, PricingData, PlanBenefits } from '../types';

const CONFIG_API_URL = "https://script.google.com/macros/s/AKfycbxBgNRcxnJg9DM0jn91REAucFDi3VuWGZ5KaCow7fPypuF80ga3e8fQSfajMW7TsCbr/exec";
const BENEFITS_API_URL = "https://script.google.com/macros/s/AKfycbzMKzsXrGF4dsMyaiYr7xp4jtuNtTxY1joHCssks4e2UZ6ivHjBQS4n5Yt5uc4oWfuzrQ/exec?type=benefits";

export const fetchAgentConfig = async (agentId: string): Promise<AgentConfig> => {
    const cacheKey = `agent_config_${agentId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        try {
            const data = JSON.parse(cached);
            // Refresh in background if needed, but return cache for speed
            // For simplicity, we just return cache here, but in real app we might stale-while-revalidate
            return data;
        } catch (e) {
            console.error("Cache parse error", e);
        }
    }

    const res = await fetch(`${CONFIG_API_URL}?agent=${encodeURIComponent(agentId)}`);
    const data = await res.json();
    
    if (data.error) throw new Error(data.error);
    
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
    if (!url) return;
    try {
        await fetch(url, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } catch (e) {
        console.error("Lead submission failed", e);
    }
};