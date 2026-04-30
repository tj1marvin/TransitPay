import { BusRoute } from '../types';
import { ArrowRight, Clock, MapPin, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface RouteListProps {
  routes: BusRoute[];
  onPurchase: (route: BusRoute) => void;
}

export function RouteList({ routes, onPurchase }: RouteListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {routes.map((route, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          key={route.id}
          className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <span className="small-caps bg-white/5 px-2 py-1 rounded">{route.busNumber}</span>
              <span className="font-mono text-xl">${route.price.toFixed(2)}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <div className="flex flex-col">
                  <span className="small-caps leading-none mb-1">From</span>
                  <span className="text-sm font-medium">{route.from}</span>
                </div>
              </div>
              
              <div className="w-px h-6 bg-white/10 ml-0.5" />

              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                <div className="flex flex-col">
                  <span className="small-caps leading-none mb-1">To</span>
                  <span className="text-sm font-medium">{route.to}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white/40 mb-6">
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>Leaves at {route.departureTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>{route.duration} trip</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onPurchase(route)}
            className="w-full bg-white text-black rounded-lg py-3 font-medium hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            Purchase Ticket
          </button>
        </motion.div>
      ))}
    </div>
  );
}
