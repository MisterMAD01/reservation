'use client';

import { useQueue } from './context/QueueContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scissors, User, ListChecks, Calendar, Bell, ChevronRight,
  Smartphone, Store, ShieldCheck, Zap
} from 'lucide-react';

export default function Home() {
  const { bookings, serving } = useQueue();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const pendingCount = bookings.filter(t => t.status === 'pending').length;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-neutral-950 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="glass-card max-w-lg w-full p-12 text-center relative z-10 border border-white/5 bg-neutral-900/40"
      >
        <div className="flex justify-center mb-8">
          <div className="p-5 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/20 relative">
            <Scissors className="w-10 h-10 text-emerald-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
          </div>
        </div>

        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-emerald-500/10">
          Smart Queue System
        </span>

        <h1 className="text-5xl font-black mb-6 bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent leading-[0.9] tracking-tighter">
          จองง่าย <br /> สะดวก รวดเร็ว
        </h1>

        <p className="text-slate-500 text-sm mb-12 leading-relaxed px-4 font-bold uppercase tracking-widest opacity-60">
          ยกระดับร้านตัดผมของคุณด้วยระบบจองคิวอัจฉริยะแบบ Real-time ผ่าน LINE LIFF
        </p>

        <div className="grid grid-cols-1 gap-4 w-full px-4">
          <Link href="/customer" className="group w-full py-6 px-8 rounded-3xl bg-white text-slate-950 font-black text-lg shadow-2xl shadow-white/5 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-between">
            <span className="flex items-center gap-4">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              สำหรับลูกค้า
            </span>
            <ChevronRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link href="/merchant" className="group w-full py-6 px-8 rounded-3xl bg-neutral-900 border border-white/10 text-slate-300 font-bold hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-between shadow-2xl">
            <span className="flex items-center gap-4">
              <Store className="w-5 h-5 text-slate-500" />
              สำหรับร้านค้า
            </span>
            <ChevronRight className="w-5 h-5 opacity-20 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-6 px-4">
          <div className="text-center p-5 rounded-3xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-all">
            <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tighter">{serving || '---'}</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-black mt-2">Serving Now</div>
          </div>
          <div className="text-center p-5 rounded-3xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-all">
            <div className="text-2xl font-black text-blue-400 uppercase tracking-tighter">{pendingCount}</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-black mt-2">Waitlist</div>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all hover:opacity-100 cursor-default">
          <Zap className="w-4 h-4 text-emerald-400" />
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <Bell className="w-4 h-4 text-amber-500" />
        </div>
      </motion.div>

      <footer className="mt-10 text-[9px] text-slate-700 font-black uppercase tracking-[0.5em] animate-pulse">
        Premium Experience &copy; 2026
      </footer>
    </main>
  );
}
