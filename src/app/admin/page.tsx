'use client';

import { useQueue } from '@/app/context/QueueContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Users, Building2, ShieldCheck, Activity, Send,
    Settings, CreditCard, ChevronRight, Store, AlertCircle,
    Smartphone, BarChart, Bell, TrendingUp, Globe, PieChart,
    Zap, Lock, ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
    const { bookings, resetAll } = useQueue();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-[#080808] text-slate-300 font-sans p-6 lg:p-14 pb-40">
            {/* EXECUTIVE HEADER */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bank-card !rounded-[2.5rem] flex items-center justify-center bg-gradient-to-tr from-emerald-600/20 to-transparent border-emerald-500/20">
                        <ShieldCheck className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Governance</h1>
                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/20">System Root</span>
                        </div>
                        <p className="text-slate-500 mt-2 font-bold uppercase text-[9px] tracking-[0.4em]">Multi-Tenant SaaS Operations Center</p>
                    </div>
                </div>

                <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/5 shadow-2xl">
                    {['overview', 'portfolio', 'treasury', 'health'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${activeTab === tab ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* GLOBAL PORTFOLIO TILES */}
                <div className="lg:col-span-3 space-y-8">
                    <AdminTile label="Global ARR" value="฿1.24M" sub="+12.4%" icon={<Globe />} color="emerald" />
                    <AdminTile label="Total Tenants" value="24" sub="3 Pipeline" icon={<Store />} color="blue" />
                    <AdminTile label="End-Users" value="1.8k" sub="Active Now" icon={<Users />} color="purple" />

                    <div className="bank-card p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 shadow-none">
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity className="w-3 h-3" /> System Integrity
                        </h3>
                        <div className="space-y-4">
                            <IntegrityRow label="LINE Gateway" status="Stable" />
                            <IntegrityRow label="Payment API" status="Operational" />
                            <IntegrityRow label="Vault Access" status="Locked" />
                        </div>
                    </div>
                </div>

                {/* ANALYTICS & OPS AREA */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                                {/* BROADCAST CENTER (Premium Card) */}
                                <div className="bank-card p-12 relative overflow-hidden group">
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full group-hover:bg-emerald-500/20 transition-all"></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-10">
                                            <div>
                                                <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">Broadcast Distribution</h2>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">System-wide transmission to 24 connected entities</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <Send className="w-6 h-6 text-emerald-500" />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <input
                                                placeholder="Draft your system transmission..."
                                                className="flex-1 bank-card !rounded-2xl bg-white/[0.02] border-white/10 px-8 py-5 text-sm font-bold text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                                            />
                                            <button className="btn-premium px-12 uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/10">
                                                Distribute
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* TENANT PERFORMANCE MATRIX */}
                                <div className="bank-card overflow-hidden">
                                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-3">
                                            <BarChart3 className="w-4 h-4 text-emerald-500" /> High Performance Entities
                                        </h3>
                                        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-500" /> Volume</span>
                                            <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-blue-500" /> Premium</span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-[9px] font-black uppercase text-slate-600 bg-black/20">
                                                    <th className="px-8 py-5">Entity Descriptor</th>
                                                    <th className="px-8 py-5">Asset Type</th>
                                                    <th className="px-8 py-5">Compliance</th>
                                                    <th className="px-8 py-5">Yield (M)</th>
                                                    <th className="px-8 py-5 text-right">Settings</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/[0.02]">
                                                {[
                                                    { name: 'ร้านตัดผม นราธิวาส', type: 'Barber Storefront', status: 'Platinum', yield: 124 },
                                                    { name: 'Narathiwat FC Court', type: 'Recreational Asset', status: 'Gold', yield: 45 },
                                                    { name: 'Smile Dental Clinic', type: 'Healthcare Facility', status: 'Platinum', yield: 218 },
                                                ].map(shop => (
                                                    <tr key={shop.name} className="hover:bg-white/[0.01] transition-colors group">
                                                        <td className="px-8 py-8 font-black text-white text-sm tracking-tight">{shop.name}</td>
                                                        <td className="px-8 py-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{shop.type}</td>
                                                        <td className="px-8 py-8">
                                                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${shop.status === 'Platinum' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-500 border border-blue-500/30'}`}>
                                                                {shop.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-8 font-black text-white">{shop.yield}k</td>
                                                        <td className="px-8 py-8 text-right">
                                                            <button className="p-3 bank-card !rounded-xl group-hover:bg-white/5 active:scale-90 transition-all"><Settings className="w-4 h-4" /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'treasury' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bank-card p-20 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-transparent"></div>
                                <div className="relative z-10 max-w-lg mx-auto">
                                    <div className="w-24 h-24 rounded-[3rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-10">
                                        <CreditCard className="w-10 h-10 text-indigo-400" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Treasury & Settlements</h2>
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-16 leading-loose">Automated liquidity management for subscription plans and tenant dividends.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <TreasuryCard label="Active Trials" value="12" />
                                        <TreasuryCard label="Settled Premium" value="45" highlighted />
                                        <TreasuryCard label="Overdue Liquid" value="2" alert />
                                    </div>

                                    <button className="btn-premium mt-16 w-full flex items-center justify-center gap-3">
                                        <ArrowUpRight className="w-4 h-4" /> Comprehensive Audit
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}

function AdminTile({ label, value, sub, icon, color }: any) {
    const colors: any = {
        emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    }
    return (
        <div className="bank-card p-8 group hover:scale-[1.02] transition-all border border-white/[0.03]">
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-[1.5rem] border ${colors[color]}`}>{icon}</div>
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</h4>
            <div className="text-4xl font-black text-white tracking-tighter mb-4">{value}</div>
            <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                <TrendingUp className="w-3 h-3" /> {sub}
            </div>
        </div>
    );
}

function IntegrityRow({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> {status}
            </span>
        </div>
    );
}

function TreasuryCard({ label, value, highlighted, alert }: any) {
    return (
        <div className={`p-8 bank-card !rounded-[2rem] border transition-all ${highlighted ? 'border-indigo-500/30 bg-indigo-500/5' : alert ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/5 bg-white/[0.02]'}`}>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-3">{label}</p>
            <p className={`text-3xl font-black tracking-tighter ${alert ? 'text-rose-500' : 'text-white'}`}>{value}</p>
        </div>
    );
}
