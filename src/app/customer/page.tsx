'use client';

import liff from '@line/liff';

import { useQueue, Booking, Resource, Service } from '@/app/context/QueueContext';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon, User, ListChecks, MapPin, Tag, CreditCard,
    ChevronRight, ArrowLeft, Bell, Scissors, Smartphone, MoreHorizontal,
    Star, MessageSquare, Info, Search, Menu, ChevronLeft, BarChart3, BarChart
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { th } from 'date-fns/locale';

export default function CustomerFlow() {
    const { resources, services, addBooking, bookings, updatePaymentStatus, serving } = useQueue();
    const [step, setStep] = useState<number | string>(1);
    const [selection, setSelection] = useState<Partial<Booking>>({});
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [liffProfile, setLiffProfile] = useState<{ displayName: string; pictureUrl?: string } | null>(null);

    useEffect(() => {
        liff.init({ liffId: '2009265694-KSR25Q34' })
            .then(() => {
                if (!liff.isLoggedIn()) {
                    liff.login();
                } else {
                    liff.getProfile().then(profile => {
                        setLiffProfile(profile);
                    });
                }
            })
            .catch((err) => console.error('LIFF Init Error:', err));
    }, []);

    // My active booking
    const [myBooking, setMyBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const savedId = sessionStorage.getItem('active_booking_id');
        if (savedId) {
            const active = bookings.find(b => b.id === savedId && b.status !== 'cancelled' && b.status !== 'completed');
            if (active) setMyBooking(active);
        }
    }, [bookings]);

    // --- Step logic ---
    const handlePayment = () => {
        if (myBooking) {
            updatePaymentStatus(myBooking.id, 'paid');
            setStep(4);
        }
    };

    const isStepNavVisible = typeof step === 'number' && step > 1 && step < 4;

    const handleServiceSelect = (serviceId: string) => {
        setSelection({ ...selection, serviceId });
        // If 'v2' (stadium), skip staff selection and go directly to date/time (step 3)
        // Otherwise (v1, barber), go to staff selection (step 2)
        setStep(serviceId === 'v2' ? 3 : 2);
    };

    const handleStaffSelect = (staffId: string) => {
        setSelection({ ...selection, staffId });
        setStep(3);
    };

    const handleBooking = (time: string) => {
        const freshBooking = addBooking({
            customerName: liffProfile?.displayName || 'Guest User',
            staffId: selection.staffId || 'any',
            serviceId: selection.serviceId!,
            date: format(selection.date ? new Date(selection.date) : new Date(), 'yyyy-MM-dd'),
            time,
        });
        sessionStorage.setItem('active_booking_id', freshBooking.id);
        setMyBooking(freshBooking);
        setStep(4);
    };

    // --- Calendar Logic ---
    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const timeSlots = [
        { time: '13:00 - 13:45', status: 'ว่าง' },
        { time: '14:00 - 14:45', status: 'จองแล้ว' },
        { time: '15:00 - 15:45', status: 'ว่าง' },
        { time: '16:00 - 16:45', status: 'ว่าง' }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex flex-col items-center font-sans">

            {/* 📱 LINE STYLE HEADER */}
            <header className="w-full max-w-lg bg-[#1a1a1a] p-4 flex items-center justify-between border-b border-white/5 sticky top-0 z-[100]">
                <div className="flex items-center gap-3">
                    {isStepNavVisible && (
                        <button onClick={() => setStep(Number(step) - 1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        {liffProfile?.pictureUrl && (
                            <img src={liffProfile.pictureUrl} className="w-8 h-8 rounded-full border border-white/20" alt="" />
                        )}
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-white">{liffProfile?.displayName || 'Mistermad Queue'}</h1>
                            <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <Search className="w-5 h-5" />
                    <ListChecks className="w-5 h-5" />
                    <Menu className="w-5 h-5" />
                </div>
            </header>

            <main className="w-full max-w-lg flex-1 overflow-y-auto pb-32 relative z-10">
                <AnimatePresence mode="wait">

                    {/* STEP 1: BANKING DASHBOARD HOME */}
                    {step === 1 && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="p-5 space-y-6"
                        >
                            {/* Account/Status Summary Card */}
                            <div className="bank-card p-8 bg-gradient-to-br from-emerald-600/20 to-[#1a1a1a] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <Scissors className="w-24 h-24 text-emerald-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Current Serving</p>
                                            <h2 className="text-4xl font-black text-white tracking-tighter">{serving || '---'}</h2>
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                                            <BarChart3 className="w-5 h-5 text-emerald-400" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">My Loyalty Balance</p>
                                            <p className="text-lg font-black text-white">450 <span className="text-[10px] text-emerald-500 ml-1">Pts</span></p>
                                        </div>
                                        <button className="bg-emerald-500 text-black text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest">Exchange</button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Action Grid (Banking Style) */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Haircut', icon: <Scissors />, action: () => handleServiceSelect('v1'), color: 'bg-emerald-500/10 text-emerald-500' },
                                    { label: 'Stadium', icon: <Smartphone />, action: () => handleServiceSelect('v2'), color: 'bg-blue-500/10 text-blue-500' },
                                    { label: 'Services', icon: <ListChecks />, action: () => setStep(2), color: 'bg-amber-500/10 text-amber-500' },
                                    { label: 'Locations', icon: <MapPin />, action: () => setStep('map'), color: 'bg-slate-500/10 text-slate-300' },
                                    { label: 'Promo', icon: <Tag />, action: () => setStep('promo'), color: 'bg-purple-500/10 text-purple-400' },
                                    { label: 'Support', icon: <MessageSquare />, action: () => alert('Contacting support...'), color: 'bg-rose-500/10 text-rose-400' },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={item.action}
                                        className="aspect-square bank-card !rounded-[2rem] flex flex-col items-center justify-center gap-3 active:scale-95 hover:bg-white/[0.02]"
                                    >
                                        <div className={`p-3 rounded-2xl ${item.color} shadow-lg`}>
                                            {item.icon}
                                        </div>
                                        <span className="text-[9px] font-black uppercase text-slate-200 tracking-widest">{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Recent Activity / Waiting List */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Waitlist Overview</h3>
                                    <span className="text-[10px] font-bold text-emerald-500">{bookings.filter(b => b.status === 'pending').length} Persons</span>
                                </div>
                                <div className="space-y-3">
                                    {bookings.filter(b => b.status === 'pending').slice(0, 3).map(b => (
                                        <div key={b.id} className="bank-card !rounded-2xl p-4 flex items-center justify-between border border-white/[0.03]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-sm text-emerald-500">
                                                    {b.ticketNumber.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-white">{b.ticketNumber}</p>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase">Estimated 15 mins</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-700" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: STAFF SELECTION (Screenshot 2) */}
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="p-4 space-y-4"
                        >
                            <h2 className="text-lg font-black text-center mb-6 text-white bg-[#1a1a1a] py-3 rounded-xl border border-white/5 uppercase tracking-widest">
                                {selection.serviceId === 'v2' ? 'Select Pitch' : 'Select Stylist'}
                            </h2>

                            <div className="grid grid-cols-2 gap-4 pb-28">
                                {resources.filter((r: Resource) => r.type === (selection.serviceId === 'v2' ? 'field' : 'staff')).map((r: Resource) => (
                                    <motion.button
                                        whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}
                                        key={r.id}
                                        onClick={() => setSelection({ ...selection, staffId: r.id })}
                                        className={`bank-card p-6 flex flex-col items-center gap-4 border transition-all duration-500
                                            ${selection.staffId === r.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 opacity-60 hover:opacity-100'}`}
                                    >
                                        <div className="relative">
                                            <img src={r.image} className="w-20 h-20 rounded-full object-cover border-2 border-white/10" alt="" />
                                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#1a1a1a] ${r.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-black text-white">{r.name}</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{r.description}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {selection.staffId && (
                                    <motion.div
                                        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                                        className="fixed bottom-28 left-0 w-full px-6 z-[60]"
                                    >
                                        <button
                                            onClick={() => setStep(3)}
                                            className="w-full py-5 bg-emerald-500 text-black font-black text-xs uppercase rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
                                        >
                                            ดำเนินการต่อ (Continue)
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* STEP 3: CALENDAR & TIME (Screenshot 3) */}
                    {step === 3 && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                            className="p-4 space-y-4"
                        >
                            <h2 className="text-lg font-black text-center mb-6 text-white bg-[#1a1a1a] py-3 rounded-xl border border-white/5">
                                เลือกเวลา ({resources.find(r => r.id === selection.staffId)?.name || (selection.serviceId === 'v2' ? 'สนาม' : 'ช่าง')})
                            </h2>

                            {/* Premium Calendar */}
                            <div className="bg-[#f5f5f5] text-black rounded-xl p-4 shadow-2xl">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <ChevronLeft className="w-5 h-5 cursor-pointer" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} />
                                    <span className="font-black text-sm uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy', { locale: th })}</span>
                                    <ChevronRight className="w-5 h-5 cursor-pointer" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} />
                                </div>
                                <div className="grid grid-cols-7 text-center text-[8px] font-black text-slate-400 mb-2">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {daysInMonth.map((day, idx) => {
                                        const isSelected = !!selection.date && isSameDay(day, new Date(selection.date));
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelection({ ...selection, date: format(day, 'yyyy-MM-dd') })}
                                                className={`aspect-square flex items-center justify-center text-xs font-bold rounded-full transition-all
                           ${isSelected ? 'bg-black text-white shadow-xl' : 'hover:bg-black/5 text-slate-800'}`}
                                            >
                                                {format(day, 'd')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className="mt-8 space-y-2 pb-40">
                                {timeSlots.map((slot, i) => {
                                    const isSelectedTime = selection.time === slot.time;
                                    return (
                                        <button
                                            key={i}
                                            disabled={slot.status === 'จองแล้ว'}
                                            onClick={() => setSelection({ ...selection, time: slot.time })}
                                            className={`w-full p-4 rounded-xl border text-sm font-bold flex justify-between items-center transition-all active:scale-[0.98]
                                                ${slot.status === 'จองแล้ว' ? 'bg-[#1a1a1a] border-white/5 text-slate-600 opacity-30 shadow-none' :
                                                    isSelectedTime ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/10' :
                                                        'bg-[#1a1a1a] border-white/10 text-white hover:border-emerald-500/50'}`}
                                        >
                                            <span>{slot.time} น.</span>
                                            <span className={`text-[10px] font-black uppercase ${slot.status === 'ว่าง' ? 'text-emerald-500' : 'text-slate-500'}`}>{slot.status}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <AnimatePresence>
                                {selection.time && (
                                    <motion.div
                                        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                                        className="fixed bottom-28 left-0 w-full px-6 z-[60]"
                                    >
                                        <button
                                            onClick={() => handleBooking(selection.time!)}
                                            className="w-full py-5 bg-emerald-500 text-black font-black text-xs uppercase rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
                                        >
                                            ยืนยันการจอง (Confirm Booking)
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* STEP 4: TICKET VIEW with SMART NOTIFICATIONS */}
                    {(myBooking || step === 4) && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="p-6 pt-10"
                        >
                            <div className="bg-[#171717] rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[4px] bg-emerald-500"></div>

                                {/* Frictionless Payment Alert */}
                                {myBooking?.paymentStatus === 'unpaid' && (
                                    <button
                                        onClick={() => setStep(5)}
                                        className="mb-8 w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-between animate-pulse"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5" />
                                            <span className="text-[10px] font-black uppercase">รอชำระมัดจำ (โอนทันทีลด 10.-)</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}

                                <div className="flex items-center gap-2 mb-8 text-white">
                                    <Bell className="w-5 h-5 text-emerald-500 animate-bounce" />
                                    <h3 className="text-xs font-black uppercase tracking-widest">
                                        {bookings.filter(b => b.status === 'pending' && b.timestamp < (myBooking?.timestamp || 0)).length <= 2
                                            ? '[คิวของคุณใกล้ถึงแล้ว!]'
                                            : '[จองคิวสำเร็จ]'} {selection.serviceId === 'v2' ? '⚽' : '💈'}
                                    </h3>
                                </div>

                                <div className="space-y-4 text-sm font-bold">
                                    <div className="flex justify-between border-b border-white/5 pb-3">
                                        <span className="text-slate-500 text-[10px] uppercase">ลูกค้า:</span>
                                        <span className="text-white">คุณ{myBooking?.customerName}</span>
                                    </div>
                                    {myBooking && (
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Stylist / Pitch</p>
                                            <p className="text-[10px] font-black text-white">{resources.find(r => r.id === myBooking.staffId)?.name}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-b border-white/5 pb-3">
                                        <span className="text-slate-500 text-[10px] uppercase">เวลา/วัน:</span>
                                        <span className="text-white">{myBooking?.time} น. ({format(new Date(myBooking?.date || Date.now()), 'dd MMM', { locale: th })})</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-3">
                                        <span className="text-slate-500 text-[10px] uppercase">ชำระเงิน:</span>
                                        <span className={`text-[10px] font-black uppercase ${myBooking?.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {myBooking?.paymentStatus === 'paid' ? 'สำเร็จ' : 'ยังไม่ชำระ'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 text-[10px] uppercase">สถานะคิว:</span>
                                        <span className="text-emerald-500 font-extrabold uppercase">
                                            {bookings.filter(b => b.status === 'pending' && b.timestamp < (myBooking?.timestamp || 0)).length} คิวรอก่อนหน้า
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-12 text-center pt-8 border-t border-white/5">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Queue Ticket</div>
                                    <div className="text-8xl font-black text-white tracking-widest leading-none drop-shadow-2xl">
                                        {myBooking?.ticketNumber}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => { sessionStorage.clear(); setStep(1); setMyBooking(null); }}
                                className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
                            >
                                ยกเลิกและจองใหม่
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 5: PAYMENT */}
                    {step === 5 && myBooking && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                            className="p-4 space-y-4"
                        >
                            <h2 className="text-lg font-black text-center mb-6 uppercase tracking-widest text-white border-b border-white/10 pb-4">ชำระเงิน</h2>
                            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 text-center">
                                <CreditCard className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-black mb-2">ยอดชำระมัดจำ</h3>
                                <p className="text-4xl font-black text-white mb-6">฿{selection.serviceId === 'v2' ? '500.00' : '100.00'}</p>
                                <p className="text-sm text-slate-400 mb-6">เพื่อยืนยันการจอง {selection.serviceId === 'v2' ? 'สนามฟุตบอล' : 'คิวตัดผม'} ของคุณ</p>
                                <button
                                    onClick={() => {
                                        useQueue().updatePaymentStatus(myBooking!.id, 'paid');
                                        setStep(4);
                                    }}
                                    className="w-full py-4 bg-emerald-600 rounded-xl font-black text-xs uppercase shadow-xl shadow-emerald-600/20"
                                >
                                    แนบสลิปและยืนยัน
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* NEW STEP: MAP VIEW */}
                    {step === 'map' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
                            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 text-center">
                                <MapPin className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                <h2 className="text-xl font-black mb-2">ร้านตัดผม นราธิวาส</h2>
                                <p className="text-sm text-slate-400 mb-6">123 ถ.พิชิตบำรุง ต.บางนาค อ.เมือง จ.นราธิวาส</p>
                                <div className="w-full h-48 bg-slate-800 rounded-xl mb-6 flex items-center justify-center italic text-slate-500">
                                    [ Google Maps Preview ]
                                </div>
                                <button
                                    onClick={() => window.open('https://maps.google.com')}
                                    className="w-full py-4 bg-emerald-600 rounded-xl font-black text-xs uppercase"
                                >
                                    เปิดด้วย Google Maps
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* NEW STEP: PROMOTIONS */}
                    {step === 'promo' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
                            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-3xl text-white shadow-2xl">
                                <Tag className="w-10 h-10 mb-4" />
                                <h2 className="text-3xl font-black mb-2">โปรลด 20.-</h2>
                                <p className="font-bold opacity-80">สำหรับการจองผ่าน LINE OA ครั้งแรกเท่านั้น!</p>
                            </div>
                            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                                <h3 className="font-black text-sm mb-2">เงื่อนไข</h3>
                                <ul className="text-xs text-slate-400 space-y-2 list-disc ml-4">
                                    <li>แจ้งพนักงานก่อนชำระเงิน</li>
                                    <li>ไม่สามารถใช้ร่วมกับโปรโมชั่นอื่นได้</li>
                                </ul>
                            </div>
                        </motion.div>
                    )}

                    {/* NEW STEP: QUEUE STATUS */}
                    {step === 'status' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
                            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10">
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">สถานะคิวขณะนี้</h2>
                                <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5 mb-4">
                                    <div className="text-[10px] font-black text-emerald-500 uppercase">กำลังบริการ</div>
                                    <div className="text-4xl font-black">{bookings.find(b => b.status === 'calling')?.ticketNumber || '---'}</div>
                                </div>
                                <div className="space-y-2">
                                    {bookings.filter(b => b.status === 'pending').map(b => (
                                        <div key={b.id} className="flex justify-between p-3 bg-white/5 rounded-lg text-xs font-bold">
                                            <span className="text-slate-500">{b.ticketNumber}</span>
                                            <span>รอเรียก...</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 🛠️ BANKING STYLE BOTTOM NAV */}
            <footer className="w-full max-w-lg fixed bottom-0 nav-blur p-4 h-24 flex justify-around items-center z-[50]">
                <div
                    onClick={() => setStep(1)}
                    className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${step === 1 ? 'text-emerald-500' : 'text-slate-600'}`}
                >
                    <BarChart className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
                </div>

                <div
                    onClick={() => setStep(2)}
                    className="relative -top-10"
                >
                    <div className="bank-card !rounded-full p-6 bg-emerald-500 text-black shadow-[0_20px_50px_rgba(16,185,129,0.3)] active:scale-95 transition-all">
                        <CalendarIcon className="w-8 h-8" />
                    </div>
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest text-emerald-500">Booking</span>
                </div>

                <div
                    onClick={() => setStep('status')}
                    className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${step === 'status' ? 'text-emerald-500' : 'text-slate-600'}`}
                >
                    <ListChecks className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Queue</span>
                </div>
            </footer>
        </div>
    );
}
