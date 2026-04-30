import { Plus, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, TrendingUp, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface WalletProps {
  balance: number;
  onAddFunds: (amount: number) => void;
  transactions: Transaction[];
}

export function Wallet({ balance, onAddFunds, transactions }: WalletProps) {
  const suggestedAmounts = [10, 20, 50, 100];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 rounded-3xl p-10 relative overflow-hidden">
          <div className="relative z-10">
            <span className="small-caps opacity-60">Transit Balance</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl md:text-6xl font-light">$</span>
              <span className="text-6xl md:text-8xl font-light tracking-tighter">{balance.toFixed(2)}</span>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <button className="bg-white text-black px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:scale-[1.02] transition-transform">
                <Plus className="w-4 h-4" />
                Add Funds
              </button>
            </div>
          </div>
          
          <WalletIcon className="absolute -bottom-10 -right-10 w-64 h-64 text-white/[0.02] -rotate-12" />
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <span className="small-caps mb-4 block">Quick Reload</span>
            <div className="grid grid-cols-2 gap-3">
              {suggestedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => onAddFunds(amount)}
                  className="py-3 border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-mono text-sm"
                >
                  +${amount}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-400/60 mt-6">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Secure encrypted payment</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-light mb-6 flex items-center gap-3">
          <HistoryIcon className="w-5 h-5 text-white/40" />
          Recent Transactions
        </h3>
        
        {transactions.length === 0 ? (
          <div className="h-40 flex items-center justify-center border border-dashed border-white/5 rounded-2xl text-white/20 text-sm">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                key={tx.id} 
                className="flex items-center justify-between py-4 border-b border-white/5 group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-colors",
                    tx.type === 'purchase' ? "text-white/40 group-hover:bg-white/5" : 
                    tx.type === 'refund' ? "text-green-400 group-hover:bg-green-400/5" :
                    "text-blue-400 group-hover:bg-blue-400/5"
                  )}>
                    {tx.type === 'reload' && <Plus className="w-4 h-4" />}
                    {tx.type === 'purchase' && <ArrowUpRight className="w-4 h-4" />}
                    {tx.type === 'refund' && <RotateCcw className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-white/30">
                      {format(new Date(tx.date), 'MMM d, yyyy · HH:mm')}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "font-mono text-sm",
                  tx.amount > 0 ? "text-green-400" : "text-white/60"
                )}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}
