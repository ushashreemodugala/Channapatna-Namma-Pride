import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Clock, CheckCircle2, CreditCard, Banknote, Smartphone, XCircle } from 'lucide-react';

export default function TransactionView({ t, lang, orders, user }: { t: any, lang: string, orders: any[], user: any }) {
  // Use orders as transactions for demonstration 
  
  const transactions = orders.map(order => ({
    id: `TXN-${order.id}`,
    date: order.date,
    amount: order.item.price,
    type: 'purchase',
    status: order.status === 'cancelled' || order.status === 'returned' ? 'failed' : 'success',
    item: lang === 'kn' ? order.item.kn_name : order.item.en_name,
    paymentMethod: order.item.paymentMethod || 'cod'
  }));

  const totalSpent = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => {
      // Parse amount which is like "₹450"
      const num = parseInt(t.amount.replace(/[^0-9]/g, ''));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

  return (
    <div className="flex flex-col h-full bg-toy-wood-bg p-6 overflow-y-auto relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5d4037_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      
      <h1 className="text-3xl font-black text-toy-black mb-6 drop-shadow-sm flex items-center gap-2 relative z-10 border-b-4 border-toy-yellow pb-2 inline-block self-start">
        <Wallet size={32} className="text-toy-brown" />
        {lang === 'kn' ? 'ವಹಿವಾಟುಗಳು' : 'Transactions'}
      </h1>

      <div className="bg-gradient-to-br from-toy-red to-toy-orange rounded-[2rem] p-6 text-white border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] mb-8 relative z-10">
        <p className="font-black text-white/70 mb-1 uppercase tracking-widest text-xs">{lang === 'kn' ? 'ಒಟ್ಟು ಖರ್ಚು' : 'Total Spent'}</p>
        <div className="text-4xl font-black tracking-tight flex items-baseline gap-1">
          <span className="text-2xl">₹</span>
          {totalSpent.toLocaleString('en-IN')}
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
           <div className="bg-white/20 px-3 py-1 text-[10px] font-black rounded-xl border-2 border-white/30 backdrop-blur-sm uppercase tracking-wider">
             {transactions.filter(t => t.status === 'success').length} {lang === 'kn' ? 'ಯಶಸ್ವಿ' : 'Successful'}
           </div>
           <div className="bg-toy-black/20 px-3 py-1 text-[10px] font-black rounded-xl border-2 border-toy-black/30 backdrop-blur-sm uppercase tracking-wider">
             {transactions.filter(t => t.status === 'failed').length} {lang === 'kn' ? 'ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ/ಮರಳಿಸಲಾಗಿದೆ' : 'Cancelled/Returned'}
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <h2 className="text-xl font-black text-toy-black mb-2 uppercase tracking-widest">{lang === 'kn' ? 'ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು' : 'Recent Transactions'}</h2>
        
        {transactions.length === 0 ? (
          <div className="bg-white p-8 rounded-[2rem] border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] text-center text-toy-brown font-black italic">
            {lang === 'kn' ? 'ಯಾವುದೇ ವಹಿವಾಟುಗಳಿಲ್ಲ.' : 'No transactions found.'}
          </div>
        ) : (
          <AnimatePresence>
            {transactions.map((txn, idx) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-4 border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl border-2 border-toy-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] shrink-0
                    ${txn.status === 'success' ? 'bg-toy-green text-white font-black' : 'bg-toy-wood-bg text-toy-brown/30'}
                  `}>
                    {txn.paymentMethod === 'card' ? <CreditCard size={24} /> : txn.paymentMethod === 'upi' ? <Smartphone size={24} /> : <Banknote size={24} />}
                  </div>
                  <div>
                    <div className="font-black text-toy-black leading-tight">
                      {txn.item}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-toy-brown/50 flex items-center gap-1 uppercase tracking-tighter">
                        <Clock size={10} /> {txn.date}
                      </span>
                      <span className="text-[10px] font-black text-toy-red/40 uppercase tracking-tighter">
                        {txn.id}
                      </span>
                    </div>
                    <div className="text-[9px] font-black text-toy-brown/30 mt-1 uppercase tracking-widest">
                      {txn.paymentMethod === 'card' ? 'CARD PAYMENT' : txn.paymentMethod === 'upi' ? 'UPI / SMARTPHONE' : 'CASH ON DELIVERY'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-black text-lg ${txn.status === 'success' ? 'text-toy-black' : 'text-toy-brown/30 line-through'}`}>
                    -{txn.amount}
                  </div>
                  {txn.status === 'success' ? (
                     <div className="text-[9px] font-black text-toy-green uppercase flex items-center gap-1 justify-end mt-1 tracking-widest">
                       <CheckCircle2 size={10} /> {lang === 'kn' ? 'ಯಶಸ್ವಿ' : 'SUCCESS'}
                     </div>
                  ) : (
                     <div className="text-[9px] font-black text-toy-red uppercase flex items-center gap-1 justify-end mt-1 tracking-widest">
                       <XCircle size={10} /> {lang === 'kn' ? 'ವಿಫಲವಾಗಿದೆ' : 'FAILED'}
                     </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
    </div>
  );
}
