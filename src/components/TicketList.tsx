import { Ticket, TicketStatus } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Ticket as TicketIcon, Calendar, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface TicketListProps {
  tickets: Ticket[];
  onCancel: (ticketId: string) => void;
}

export function TicketList({ tickets, onCancel }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-white/40 border border-dashed border-white/10 rounded-3xl">
        <TicketIcon className="w-12 h-12 mb-4 opacity-20" />
        <p>No active tickets found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tickets.map((ticket, index) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          key={ticket.id}
          className={cn(
            "bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row transition-opacity",
            ticket.status === TicketStatus.CANCELLED && "opacity-60"
          )}
        >
          <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-white/10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <span className="small-caps block mb-1">Route</span>
                <h3 className="text-2xl font-light">{ticket.routeName}</h3>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full flex items-center gap-2",
                ticket.status === TicketStatus.ACTIVE ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              )}>
                {ticket.status === TicketStatus.ACTIVE ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span className="text-[10px] uppercase font-bold tracking-wider">{ticket.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <span className="small-caps block mb-1">Purchased On</span>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 opacity-40" />
                  {format(new Date(ticket.purchaseDate), 'MMM d, yyyy · HH:mm')}
                </div>
              </div>
              <div>
                <span className="small-caps block mb-1">Ticket ID</span>
                <span className="font-mono text-sm leading-none">{ticket.id}</span>
              </div>
            </div>

            {ticket.status === TicketStatus.ACTIVE && (
              <button
                onClick={() => onCancel(ticket.id)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Cancel Ticket & Refund
              </button>
            )}
          </div>

          <div className={cn(
            "p-6 flex flex-col items-center justify-center gap-4 transition-all",
            ticket.status === TicketStatus.CANCELLED ? "bg-white/5" : "bg-white"
          )}>
             <div className={cn(
               "p-2 border-4 rounded-xl",
               ticket.status === TicketStatus.CANCELLED ? "border-white/10 opacity-20" : "border-black/5"
             )}>
               <QRCodeSVG 
                value={ticket.status === TicketStatus.CANCELLED ? "INVALID" : ticket.qrCodeData} 
                size={120} 
                level="H" 
               />
             </div>
             <p className={cn(
               "text-[10px] font-bold tracking-widest uppercase",
               ticket.status === TicketStatus.CANCELLED ? "text-white/20" : "text-black"
             )}>
               {ticket.status === TicketStatus.CANCELLED ? "Invalidated" : "Scan to board"}
             </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
