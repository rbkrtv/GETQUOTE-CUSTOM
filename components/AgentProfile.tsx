import React, { useState, useEffect } from 'react';
import { AgentConfig } from '../types';
import { ICONS } from '../constants';

interface AgentProfileProps {
    config: AgentConfig | null;
    isLoading: boolean;
    onUpdate: (config: AgentConfig) => void;
}

const AgentProfile: React.FC<AgentProfileProps> = ({ config, isLoading, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editConfig, setEditConfig] = useState<AgentConfig | null>(null);

    useEffect(() => {
        if (config) {
            setEditConfig(config);
        }
    }, [config]);

    const handleSave = () => {
        if (editConfig) {
            onUpdate(editConfig);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditConfig(config);
        setIsEditing(false);
    };

    const handleChange = (field: keyof AgentConfig, value: string) => {
        if (editConfig) {
            setEditConfig({ ...editConfig, [field]: value });
        }
    };

    if (isLoading || !config) {
        return (
            <div className="w-[92%] max-w-xl mx-auto bg-white rounded-xl p-10 shadow-lg relative overflow-hidden flex flex-col items-center">
                <div className="w-32 h-8 mb-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-[120px] h-[120px] rounded-full mb-4 bg-gray-200 animate-pulse"></div>
                <div className="w-48 h-6 mb-2 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-32 h-4 mb-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (isEditing && editConfig) {
        return (
            <section className="w-[92%] max-w-xl mx-auto bg-white rounded-xl p-6 sm:p-8 shadow-2xl mt-8 border-2 border-[var(--primary-color)] relative animate-fade-in text-left">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
                    <div className="flex gap-2">
                        <button onClick={handleCancel} className="p-2 text-gray-500 hover:text-red-500 transition-colors" title="Cancel">
                            {ICONS.close}
                        </button>
                        <button onClick={handleSave} className="p-2 text-[var(--primary-color)] hover:text-green-600 transition-colors" title="Save">
                            {ICONS.save}
                        </button>
                    </div>
                </div>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Agency Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                            value={editConfig.agency}
                            onChange={(e) => handleChange('agency', e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Agent Name</label>
                             <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                                value={editConfig.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>
                         <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Company (e.g. GETB)</label>
                             <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                                value={editConfig.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Photo URL</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-sm"
                            value={editConfig.photo}
                            onChange={(e) => handleChange('photo', e.target.value)}
                        />
                    </div>

                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Number</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                            value={editConfig.whatsapp}
                            onChange={(e) => handleChange('whatsapp', e.target.value)}
                        />
                    </div>

                    <div className="pt-2 border-t mt-2">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Social Media Links</label>
                        <div className="space-y-3">
                             <div className="flex items-center gap-2">
                                <label className="w-20 text-xs text-gray-500">Facebook</label>
                                <input 
                                    type="text" 
                                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-sm"
                                    value={editConfig.facebook || ''}
                                    placeholder="https://facebook.com/..."
                                    onChange={(e) => handleChange('facebook', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-20 text-xs text-gray-500">Instagram</label>
                                <input 
                                    type="text" 
                                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-sm"
                                    value={editConfig.instagram || ''}
                                    placeholder="https://instagram.com/..."
                                    onChange={(e) => handleChange('instagram', e.target.value)}
                                />
                            </div>
                             <div className="flex items-center gap-2">
                                <label className="w-20 text-xs text-gray-500">TikTok</label>
                                <input 
                                    type="text" 
                                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-sm"
                                    value={editConfig.tiktok || ''}
                                    placeholder="https://tiktok.com/..."
                                    onChange={(e) => handleChange('tiktok', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t mt-4">
                         <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Appearance & System</h4>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Primary Color</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={editConfig.primaryColor || '#1e3a8a'}
                                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                                        className="h-10 w-12 p-1 border rounded cursor-pointer"
                                    />
                                    <input 
                                        type="text" 
                                        value={editConfig.primaryColor || ''}
                                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-md text-sm uppercase font-mono"
                                        placeholder="#1E3A8A"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="text-xs text-gray-500 mb-1 block">Secondary Color</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={editConfig.secondaryColor || '#3b82f6'}
                                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                        className="h-10 w-12 p-1 border rounded cursor-pointer"
                                    />
                                    <input 
                                        type="text" 
                                        value={editConfig.secondaryColor || ''}
                                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-md text-sm uppercase font-mono"
                                        placeholder="#3B82F6"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Leads Database URL (Web App URL)</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-xs font-mono text-gray-600"
                                value={editConfig.leadsUrl || ''}
                                onChange={(e) => handleChange('leadsUrl', e.target.value)}
                                placeholder="https://script.google.com/macros/s/..."
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Google Apps Script Web App URL for lead submission.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-[92%] max-w-xl mx-auto bg-white rounded-xl p-8 sm:p-10 shadow-xl mt-8 text-center border border-gray-100 transition-all duration-300 hover:shadow-2xl relative group">
            
            {/* Edit Button */}
            <button 
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                title="Edit Profile"
            >
                {ICONS.pencil}
            </button>

            <h3 className="font-poppins text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
                {config.agency || "Takaful Agency"}
            </h3>
            
            <img 
                src={config.photo || `https://picsum.photos/120/120`} 
                alt={config.name}
                className="w-[120px] h-[120px] rounded-full object-cover border-4 border-[var(--primary-color)] mx-auto mb-4 shadow-md"
                onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/120/120";
                }}
            />
            
            <p className="font-poppins text-xl font-semibold text-gray-900 mb-1">{config.name}</p>
            <p className="text-gray-500 mb-6 font-medium">{config.company}</p>
            
            <div className="flex justify-center gap-4">
                {config.facebook && (
                    <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white hover:opacity-90 transition-transform hover:-translate-y-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                )}
                {config.instagram && (
                    <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white hover:opacity-90 transition-transform hover:-translate-y-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C8.74 0 8.333.015 7.053.072C5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053C.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.885 5.885 0 0 0 1.384 2.126A5.868 5.868 0 0 0 4.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.148-.262a5.898 5.898 0 0 0 2.126-1.384a5.86 5.86 0 0 0 1.384-2.126c.296-.765.499-1.636.558-2.913c.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.89 5.89 0 0 0-1.384-2.126A5.847 5.847 0 0 0 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071c1.17.055 1.805.249 2.227.415c.562.217.96.477 1.382.896c.419.42.679.819.896 1.381c.164.422.36 1.057.413 2.227c.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 0 1-.899 1.382a3.744 3.744 0 0 1-1.38.896c-.42.164-1.065.36-2.235.413c-1.274.057-1.649.07-4.859.07c-3.211 0-3.586-.015-4.859-.074c-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 0 1-1.379-.899a3.644 3.644 0 0 1-.9-1.38c-.165-.42-.359-1.065-.42-2.235c-.045-1.26-.061-1.649-.061-4.844c0-3.196.016-3.586.61-4.861c.061-1.17.255-1.814.42-2.234c.21-.57.479-.96.9-1.381c.419-.419.81-.689 1.379-.898c.42-.166 1.051-.361 2.221-.421c1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324a6.162 6.162 0 1 0 0-12.324z"/></svg>
                    </a>
                )}
                {config.tiktok && (
                    <a href={config.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white hover:opacity-90 transition-transform hover:-translate-y-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12.438 2.017C13.53 2 14.613 2.008 15.696 2c.067 1.275.525 2.575 1.459 3.475c.933.925 2.25 1.35 3.533 1.492v3.358c-1.2-.042-2.408-.292-3.5-.808c-.475-.217-.917-.492-1.35-.775c-.008 2.433.008 4.866-.017 7.291a6.36 6.36 0 0 1-1.125 3.283c-1.091 1.6-2.983 2.642-4.924 2.675c-1.192.067-2.384-.258-3.4-.858c-1.684-.992-2.867-2.808-3.042-4.758a16 16 0 0 1-.008-1.242c.15-1.583.933-3.1 2.15-4.133c1.383-1.2 3.316-1.775 5.125-1.433c.016 1.233-.034 2.466-.034 3.7c-.825-.267-1.791-.192-2.516.308a2.9 2.9 0 0 0-1.134 1.458c-.175.425-.125.892-.116 1.342c.2 1.366 1.516 2.516 2.916 2.392c.934-.009 1.825-.55 2.309-1.342c.158-.275.333-.559.341-.884c.084-1.491.05-2.975.059-4.466c.008-3.358-.009-6.708.016-10.058"/></svg>
                    </a>
                )}
                {config.whatsapp && (
                    <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white hover:opacity-90 transition-transform hover:-translate-y-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 464 488"><path fill="currentColor" d="M462 228q0 93-66 159t-160 66q-56 0-109-28L2 464l40-120q-32-54-32-116q0-93 66-158.5T236 4t160 65.5T462 228zM236 39q-79 0-134.5 55.5T46 228q0 62 36 111l-24 70l74-23q49 31 104 31q79 0 134.5-55.5T426 228T370.5 94.5T236 39zm114 241q-1-1-10-7q-3-1-19-8.5t-19-8.5q-9-3-13 2q-1 3-4.5 7.5t-7.5 9t-5 5.5q-4 6-12 1q-34-17-45-27q-7-7-13.5-15t-12-15t-5.5-8q-3-7 3-11q4-6 8-10l6-9q2-5-1-10q-4-13-17-41q-3-9-12-9h-11q-9 0-15 7q-19 19-19 45q0 24 22 57l2 3q2 3 4.5 6.5t7 9t9 10.5t10.5 11.5t13 12.5t14.5 11.5t16.5 10t18 8.5q16 6 27.5 10t18 5t9.5 1t7-1t5-1q9-1 21.5-9t15.5-17q8-21 3-26z"/></svg>
                    </a>
                )}
            </div>
        </section>
    );
};

export default AgentProfile;