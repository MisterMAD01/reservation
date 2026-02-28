'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Profile = {
    id: string;
    name: string;
    type: 'barber' | 'stadium' | 'clinic';
    logo: string;
    status: 'active' | 'suspended';
};

export type Resource = {
    id: string;
    name: string;
    type: 'staff' | 'field';
    description: string;
    image: string;
    isAvailable: boolean;
};

export type Service = {
    id: string;
    name: string;
    price: number;
    discount?: string;
    icon: string;
};

export type Booking = {
    id: string;
    customerName: string;
    staffId: string;
    serviceId: string;
    date: string;
    time: string;
    status: 'pending' | 'calling' | 'completed' | 'cancelled';
    ticketNumber: string;
    timestamp: number;
    paymentStatus: 'unpaid' | 'pending_verification' | 'paid';
    paymentSlip?: string;
};

type QueueContextType = {
    bookings: Booking[];
    resources: Resource[];
    services: Service[];
    serving: string | null;
    businessProfile: Profile;
    addBooking: (booking: Omit<Booking, 'id' | 'ticketNumber' | 'timestamp' | 'status' | 'paymentStatus'>) => Booking;
    updateBookingStatus: (id: string, status: Booking['status']) => void;
    updatePaymentStatus: (id: string, status: Booking['paymentStatus'], slip?: string) => void;
    toggleResourceAvailability: (id: string) => void;
    resetAll: () => void;
};

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const INITIAL_RESOURCES: Resource[] = [
    { id: 'r1', name: 'ช่างอเล็กซ์', type: 'staff', description: 'วินเทจ', image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=200&h=250&fit=crop', isAvailable: true },
    { id: 'r2', name: 'ช่างบอย', type: 'staff', description: 'แกะลาย', image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=200&h=250&fit=crop', isAvailable: true },
    { id: 'r3', name: 'สนาม A (7-man)', type: 'field', description: 'หญ้าเทียมพรีเมียม', image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=200&h=250&fit=crop', isAvailable: true },
    { id: 'r4', name: 'สนาม B (9-man)', type: 'field', description: 'มาตรฐานสากล', image: 'https://images.unsplash.com/photo-1431324155629-1a6eda1f469a?q=80&w=200&h=250&fit=crop', isAvailable: true },
];

const INITIAL_PROFILE: Profile = {
    id: 'shop_01',
    name: 'ร้านตัดผม นราธิวาส',
    type: 'barber',
    logo: '✂️',
    status: 'active'
};

const INITIAL_SERVICES: Service[] = [
    { id: 'v1', name: 'จองคิวตัดผม', price: 200, discount: 'ลด 20.-', icon: 'Scissors' },
    { id: 'v2', name: 'แกะลาย', price: 150, icon: 'Palette' },
    { id: 'v3', name: 'สระไดร์', price: 100, icon: 'Wind' },
];

export function QueueProvider({ children }: { children: ReactNode }) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);

    useEffect(() => {
        const saved = localStorage.getItem('booking_v3');
        if (saved) {
            const parsed = JSON.parse(saved);
            setBookings(parsed.bookings || []);
            setResources(parsed.resources || INITIAL_RESOURCES);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('booking_v3', JSON.stringify({ bookings, resources }));
    }, [bookings, resources]);

    const serving = bookings.find(b => b.status === 'calling')?.ticketNumber || null;

    const addBooking = (data: Omit<Booking, 'id' | 'ticketNumber' | 'timestamp' | 'status' | 'paymentStatus'>) => {
        const prefix = INITIAL_SERVICES.find(s => s.id === data.serviceId)?.name.charAt(0) || 'B';
        const count = bookings.length + 1;
        const ticketNumber = `${prefix}${count.toString().padStart(3, '0')}`;

        const newBooking: Booking = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            ticketNumber,
            status: 'pending',
            paymentStatus: 'unpaid',
            timestamp: Date.now(),
        };

        setBookings(prev => [...prev, newBooking]);
        return newBooking;
    };

    const updateBookingStatus = (id: string, status: Booking['status']) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    };

    const updatePaymentStatus = (id: string, status: Booking['paymentStatus'], slip?: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, paymentStatus: status, paymentSlip: slip || b.paymentSlip } : b));
    };

    const toggleResourceAvailability = (id: string) => {
        setResources(prev => prev.map(r => r.id === id ? { ...r, isAvailable: !r.isAvailable } : r));
    };

    const resetAll = () => {
        setBookings([]);
        setResources(INITIAL_RESOURCES);
    };

    return (
        <QueueContext.Provider value={{
            bookings,
            resources,
            services: INITIAL_SERVICES,
            serving,
            businessProfile: INITIAL_PROFILE,
            addBooking,
            updateBookingStatus,
            updatePaymentStatus,
            toggleResourceAvailability,
            resetAll
        }}>
            {children}
        </QueueContext.Provider>
    );
}

export const useQueue = () => {
    const context = useContext(QueueContext);
    if (!context) throw new Error('useQueue must be used within QueueProvider');
    return context;
};
