import { CreditCard, History, LayoutDashboard, LogOut, Ticket as TicketIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  balance: number;
}

export function Header({ activeTab, setActiveTab, balance }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', label: 'Explore', icon: LayoutDashboard },
    { id: 'tickets', label: 'My Tickets', icon: TicketIcon },
    { id: 'wallet', label: 'Wallet', icon: CreditCard },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
            <span className="font-medium tracking-tight text-lg">TransitPay</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "nav-pill flex items-center gap-2",
                  activeTab === item.id ? "bg-white text-black hover:bg-white" : "text-white/60"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="small-caps">Balance</p>
            <p className="font-mono text-sm">${balance.toFixed(2)}</p>
          </div>
          <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>
    </header>
  );
}
