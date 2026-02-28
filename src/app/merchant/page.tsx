'use client';

import { useQueue, Booking, Resource, Service } from '@/app/context/QueueContext';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, CheckCircle2, Clock, Settings, RefreshCw, ChevronRight, Bell,
    Calendar, Scissors, Palette, Wind, User, AlertCircle, Ban, Trash2,
    Power, PowerOff, FileText, Check, X, Smartphone, Building2, BarChart3,
    TrendingUp, BarChart
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function MerchantDashboard() {
    const { bookings, resources, services, updateBookingStatus, updatePaymentStatus, toggleResourceAvailability, resetAll } = useQueue();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'cancelled'>('pending');
    const [showReport, setShowReport] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    const currentStatus = (status: Booking['status']) => bookings.filter(b => b.status === status);
    const calling = bookings.find(b => b.status === 'calling');

    const onCall = (id: string) => {
        if (calling) updateBookingStatus(calling.id, 'completed');
        updateBookingStatus(id, 'calling');
    };

    const onComplete = (id: string) => updateBookingStatus(id, 'completed');

    return (
        <main className="min-h-screen bg-[#080808] text-slate-300 font-sans p-6 lg:p-12 pb-32">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bank-card !rounded-2xl flex items-center justify-center bg-emerald-500/10 border-emerald-500/20">
                            <Building2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter">Business Console</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Merchant ID: MN-09265</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowReport(true)}
                            className="bank-card !rounded-2xl px-6 py-4 flex items-center gap-3 hover:bg-white/[0.02]"
                        >
                            <FileText className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">End Day Report</span>
                        </button>
                        <button className="bank-card !rounded-2xl p-4">
                            <Settings className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* STAT TILES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatTile label="Today's Inventory" value={bookings.length} sub="+5 from yesterday" color="emerald" />
                    <StatTile label="Currently Active" value={calling?.ticketNumber || 'NONE'} sub="Processing now" color="blue" />
                    <StatTile label="Pending Liquidity" value={currentStatus('pending').length} sub="Persons waiting" color="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LEFT: MAIN LIST */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Queue Inventory</h3>
                            <div className="flex gap-2">
                                {['pending', 'completed', 'cancelled'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                                ${activeTab === tab ? 'bg-white/10 text-white border border-white/20' : 'text-slate-600 opacity-50'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {bookings.filter(b => {
                                    if (activeTab === 'pending') return b.status === 'pending' || b.status === 'calling';
                                    if (activeTab === 'completed') return b.status === 'completed';
                                    return b.status === 'cancelled';
                                }).map(q => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                        key={q.id}
                                        className={`bank-card p-6 flex items-center justify-between transition-all duration-300
                                  ${q.status === 'calling' ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/5">
                                                <span className={`text-2xl font-black ${q.status === 'calling' ? 'text-emerald-400 font-black' : 'text-slate-200'}`}>{q.ticketNumber}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-black text-white">{q.customerName}</div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                        {format(new Date(q.timestamp), 'HH:mm')} • {services.find(s => s.id === q.serviceId)?.name}
                                                    </span>
                                                    <span className={`text-[8px] px-2 py-0.5 rounded uppercase font-black ${q.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                                        {q.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {q.status === 'pending' && (
                                                <button
                                                    onClick={() => onCall(q.id)}
                                                    className="bank-card !rounded-xl px-5 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    Call Next
                                                </button>
                                            )}
                                            {q.status === 'calling' && (
                                                <button
                                                    onClick={() => onComplete(q.id)}
                                                    className="bank-card !rounded-xl px-5 py-3 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                                                >
                                                    Settle
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT: CONTROLS */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bank-card p-6 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resource Control</h3>
                            <div className="space-y-3">
                                {resources.map((r: Resource) => (
                                    <div key={r.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <img src={r.image} className={`w-8 h-8 rounded-full object-cover ${!r.isAvailable && 'grayscale opacity-30'}`} alt="" />
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-black ${!r.isAvailable ? 'text-slate-500' : 'text-slate-200'}`}>{r.name}</span>
                                                <span className="text-[7px] font-bold text-slate-600 uppercase italic">{r.type}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleResourceAvailability(r.id)}
                                            className={`p-2 rounded-xl transition-all ${r.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                                        >
                                            {r.isAvailable ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* VERIFICATION */}
                        {bookings.some(b => b.paymentStatus === 'pending_verification') && (
                            <div className="bank-card p-6 bg-amber-500/5 border-amber-500/20 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Liquidity Verification</h3>
                                {bookings.filter(b => b.paymentStatus === 'pending_verification').map(b => (
                                    <div key={b.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                                        <span className="text-[10px] font-black">{b.ticketNumber} @ {b.customerName}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => updatePaymentStatus(b.id, 'paid')} className="p-2 bg-emerald-500 rounded-lg"><Check className="w-3 h-3 text-white" /></button>
                                            <button onClick={() => updatePaymentStatus(b.id, 'unpaid')} className="p-2 bg-red-500 rounded-lg"><X className="w-3 h-3 text-white" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showReport && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bank-card max-w-sm w-full p-10 border border-white/10">
                            <h2 className="text-2xl font-black mb-8 text-center text-white">Consolidated Report</h2>
                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-center p-6 bg-white/5 rounded-3xl">
                                    <span className="text-slate-500 font-black text-[10px] uppercase">Net Revenue</span>
                                    <span className="text-2xl font-black text-emerald-400 tracking-tighter">฿3,450</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-white/5 rounded-[2rem] text-center border border-white/5">
                                        <div className="text-[8px] text-slate-500 font-black mb-1 uppercase tracking-widest">Liquid (Transfer)</div>
                                        <div className="text-xl font-black tracking-tighter text-white">฿2,100</div>
                                    </div>
                                    <div className="p-5 bg-white/5 rounded-[2rem] text-center border border-white/5">
                                        <div className="text-[8px] text-slate-500 font-black mb-1 uppercase tracking-widest">Cash Position</div>
                                        <div className="text-xl font-black tracking-tighter text-white">฿1,350</div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => { alert('Consolidated Report Sent to Owner!'); setShowReport(false); }}
                                className="btn-premium w-full bg-emerald-500 text-black shadow-xl shadow-emerald-500/20"
                            >
                                Send to Owner
                            </button>
                            <button onClick={() => setShowReport(false)} className="w-full mt-6 text-slate-600 font-black text-[9px] uppercase tracking-widest">Acknowledge & Close</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}

function StatTile({ label, value, sub, color }: any) {
    const colors: any = {
        emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    };

    return (
        <div className="bank-card p-8 group hover:bg-white/[0.02] border border-white/[0.03]">
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-[1.5rem] border ${colors[color]}`}>
                    <BarChart3 className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
                    <h3 className="text-4xl font-black text-white tracking-tighter mt-1">{value}</h3>
                </div>
            </div>
            <div className="flex items-center gap-2 border-t border-white/5 pt-6">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{sub}</span>
            </div>
        </div>
    );
}
