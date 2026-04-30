/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { RouteList } from './components/RouteList';
import { TicketList } from './components/TicketList';
import { Wallet } from './components/Wallet';
import { TransitService } from './services/transitService';
import { BusRoute, Ticket, UserProfile, Transaction } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, MapPin, Search } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = async () => {
    try {
      const [u, r, t, tx] = await Promise.all([
        TransitService.getUserProfile(),
        TransitService.getRoutes(),
        TransitService.getTickets(),
        TransitService.getTransactions()
      ]);
      setUser({ ...u }); // Spread to ensure reference change
      setRoutes(r);
      setTickets([...t]);
      setTransactions([...tx]);
    } catch (error) {
      console.error("Failed to load transit data", error);
    }
  };

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, []);

  const handlePurchase = async (route: BusRoute) => {
    if (!user) return;
    try {
      await TransitService.purchaseTicket(route);
      await refreshData();
      setActiveTab('tickets');
    } catch (error) {
      alert(error instanceof Error ? error.message : "Purchase failed");
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this ticket? You will receive a full refund.");
    if (!confirmCancel) return;

    try {
      await TransitService.cancelTicket(ticketId);
      await refreshData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Cancellation failed");
    }
  };

  const handleAddFunds = async (amount: number) => {
    if (!user) return;
    await TransitService.addFunds(amount);
    await refreshData();
  };

  const filteredRoutes = routes.filter(r => 
    r.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        balance={user?.balance || 0} 
      />

      <main className="max-w-7xl mx-auto px-6 pt-32">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <section className="relative h-[400px] flex flex-col justify-end pb-12 overflow-hidden rounded-[32px]">
                 {/* Visual backdrop */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                 <div className="absolute inset-0 bg-white/[0.02]" />
                 
                 <div className="relative z-20">
                   <span className="small-caps mb-4 block">Next Generation Transit</span>
                   <h1 className="title-text mb-8">Where to next, {user?.displayName}?</h1>
                   
                   <div className="relative max-w-2xl">
                     <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40">
                       <Search className="w-5 h-5" />
                     </div>
                     <input 
                       type="text"
                       placeholder="Search destinations, stations, or route numbers..."
                       className="w-full bg-white/10 border border-white/10 rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-white/40 focus:bg-white/15 transition-all text-lg placeholder:text-white/20"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                   </div>
                 </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-light">Available Routes</h2>
                  <div className="flex items-center gap-4">
                    <button className="nav-pill text-xs">Filter</button>
                    <button className="nav-pill text-xs">Sort by Price</button>
                  </div>
                </div>
                <RouteList routes={filteredRoutes} onPurchase={handlePurchase} />
              </section>
            </motion.div>
          )}

          {activeTab === 'tickets' && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-12">
                <span className="small-caps mb-2 block">Active Boarding Passes</span>
                <h2 className="text-5xl font-light tracking-tight">Your Tickets</h2>
              </div>
              <TicketList tickets={tickets} onCancel={handleCancelTicket} />
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-12">
                <span className="small-caps mb-2 block">Manage Funds</span>
                <h2 className="text-5xl font-light tracking-tight">Personal Wallet</h2>
              </div>
              <Wallet 
                balance={user?.balance || 0} 
                onAddFunds={handleAddFunds} 
                transactions={transactions}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-40 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale opacity-40">
            <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="font-medium tracking-tight">TransitPay</span>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="small-caps mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-white/40">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <p className="small-caps mb-4">Support</p>
              <ul className="space-y-2 text-sm text-white/40">
                <li>Help Center</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">© 2026 TransitPay Systems International</p>
        </div>
      </footer>
    </div>
  );
}
