import React, { useEffect, useState } from 'react';
import { fetchLeads } from '../services/api';
import { ICONS } from '../constants';
import { Lead } from '../types';

interface LeadsModalProps {
    leadsUrl: string;
    onClose: () => void;
    onUpdateUrl: (url: string) => void;
}

const LeadsModal: React.FC<LeadsModalProps> = ({ leadsUrl, onClose, onUpdateUrl }) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tempUrl, setTempUrl] = useState(leadsUrl);

    // Sync tempUrl when prop changes
    useEffect(() => {
        setTempUrl(leadsUrl);
    }, [leadsUrl]);

    const loadLeads = async (urlOverride?: string) => {
        const urlToUse = urlOverride || leadsUrl;
        
        if (!urlToUse) {
            setError("Tiada database URL ditetapkan.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await fetchLeads(urlToUse);
            // Sort by latest first if timestamp exists
            const sorted = data.sort((a, b) => {
                const da = a.timestamp || a.date ? new Date(a.timestamp || a.date || '') : new Date(0);
                const db = b.timestamp || b.date ? new Date(b.timestamp || b.date || '') : new Date(0);
                return db.getTime() - da.getTime();
            });
            setLeads(sorted);
        } catch (e: any) {
            setError(e.message || "Gagal memuatkan data. Pastikan URL database sah dan boleh diakses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeads();
    }, []); 
    // Remove leadsUrl dependency here to prevent double fetch on mount + useEffect sync
    // We manually trigger loadLeads when we update URL

    const handleUpdateAndRetry = () => {
        onUpdateUrl(tempUrl);
        // Small delay to allow prop propagation or just use tempUrl immediately
        setTimeout(() => loadLeads(tempUrl), 100);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="text-[var(--primary-color)]">
                            {ICONS.database}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Senarai Prospek (Leads)</h3>
                            <p className="text-xs text-gray-500 truncate max-w-md">{leadsUrl || 'No URL Configured'}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => loadLeads()} 
                            className="p-2 text-[var(--primary-color)] hover:bg-blue-50 rounded-full transition-colors"
                            title="Refresh"
                        >
                            {ICONS.refresh}
                        </button>
                        <button 
                            onClick={onClose} 
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            {ICONS.close}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="animate-spin h-8 w-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full mb-4"></div>
                            <p className="text-gray-500">Memuatkan data...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center min-h-[16rem] text-center p-8">
                             <div className="bg-red-50 p-4 rounded-full text-red-500 mb-4">
                                {ICONS.cross}
                            </div>
                            <p className="text-red-600 font-semibold mb-2">{error}</p>
                            <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
                                Sila semak semula URL Database anda.
                            </p>
                            
                            {/* URL Editor */}
                            <div className="w-full max-w-lg bg-white p-4 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold text-gray-700 mb-2 text-left">Update Database URL</label>
                                <div className="flex gap-2 flex-col sm:flex-row">
                                    <input 
                                        type="text" 
                                        value={tempUrl}
                                        onChange={(e) => setTempUrl(e.target.value)}
                                        placeholder="https://script.google.com/..."
                                        className="flex-1 border rounded px-3 py-2 text-xs focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                                    />
                                    <button 
                                        onClick={handleUpdateAndRetry}
                                        className="bg-[var(--primary-color)] text-white px-4 py-2 rounded text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                                    >
                                        Update & Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                             <div className="opacity-50 mb-2 scale-150">{ICONS.database}</div>
                            <p>Tiada rekod dijumpai.</p>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-gray-600 text-sm uppercase tracking-wider sticky top-0 border-b-2 border-gray-100 shadow-sm">
                                        <th className="p-4 font-semibold">Tarikh</th>
                                        <th className="p-4 font-semibold">Nama</th>
                                        <th className="p-4 font-semibold">No. Telefon</th>
                                        <th className="p-4 font-semibold">Plan</th>
                                        <th className="p-4 font-semibold">Info Tambahan</th>
                                        <th className="p-4 font-semibold">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {leads.map((lead, idx) => {
                                        // Safety check for phone to avoid .replace crash if number
                                        const phoneStr = String(lead.phone || '');
                                        
                                        return (
                                        <tr key={idx} className="hover:bg-blue-50 transition-colors text-sm">
                                            <td className="p-4 text-gray-500 whitespace-nowrap">
                                                {lead.timestamp ? new Date(lead.timestamp).toLocaleDateString('ms-MY') : 
                                                 lead.date ? lead.date : '-'}
                                                <div className="text-xs opacity-70">
                                                     {lead.timestamp ? new Date(lead.timestamp).toLocaleTimeString('ms-MY', {hour: '2-digit', minute:'2-digit'}) : ''}
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-gray-900">{lead.name}</td>
                                            <td className="p-4 text-gray-600 font-mono">{phoneStr}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    lead.planType === 'medical' ? 'bg-blue-100 text-blue-700' :
                                                    lead.planType === 'hibah' ? 'bg-purple-100 text-purple-700' : 
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {(lead.planType || 'Unknown').toUpperCase()}
                                                </span>
                                            </td>
                                             <td className="p-4 text-gray-500">
                                                <div className="text-xs">
                                                    <div>{lead.occupation}</div>
                                                    <div>{lead.age || lead.dob}</div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <a 
                                                    href={`https://wa.me/${phoneStr.replace(/\D/g,'')}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                                    title="WhatsApp"
                                                >
                                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 464 488"><path fill="currentColor" d="M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228z"/></svg>
                                                </a>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadsModal;