import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, CheckCircle2, Clock, ShoppingBag, X, RefreshCw, User, MapPin, Phone } from 'lucide-react';

interface Order {
  id: string;
  item: any;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
  date: string;
  trackingNumber?: string;
  carrier?: string;
  expectedDelivery?: string;
  shippingDetails?: {
    name: string;
    address: string;
    pincode: string;
    phone: string;
  };
}

interface OrderTrackingViewProps {
  t: any;
  lang: string;
  orders: Order[];
  user: any;
  onNavigate: (t: string) => void;
  onReturnOrder: (id: string) => void;
  onCancelOrder: (id: string) => void;
}

export default function OrderTrackingView({ t, lang, orders, user, onNavigate, onReturnOrder, onCancelOrder }: OrderTrackingViewProps) {
  const [returnOrderInfo, setReturnOrderInfo] = useState<{id: string, item: any} | null>(null);
  const [cancelOrderInfo, setCancelOrderInfo] = useState<{id: string, item: any} | null>(null);
  
  const getStatusIndex = (status: Order['status']) => {
    switch (status) {
      case 'placed': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'returned': return -1;
      case 'cancelled': return -2;
      default: return 0;
    }
  };

  const steps = [
    { key: 'placed', icon: <ShoppingBag size={18} />, en: 'Placed', kn: 'ಆದೇಶಿಸಲಾಗಿದೆ' },
    { key: 'processing', icon: <Clock size={18} />, en: 'Processing', kn: 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ' },
    { key: 'shipped', icon: <Truck size={18} />, en: 'Shipped', kn: 'ರವಾನಿಸಲಾಗಿದೆ' },
    { key: 'delivered', icon: <CheckCircle2 size={18} />, en: 'Delivered', kn: 'ತಲುಪಿಸಲಾಗಿದೆ' },
  ];

  return (
    <div className="flex flex-col h-full bg-toy-wood-bg p-6 overflow-y-auto relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5d4037_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      
      <h1 className="text-3xl font-black text-toy-black mb-6 drop-shadow-sm relative z-10 border-b-4 border-toy-yellow pb-2 inline-block self-start">
        {lang === 'kn' ? 'ನನ್ನ ಆದೇಶಗಳು' : 'My Orders'}
      </h1>
      
      {user && user.name !== 'Guest User' && (
        <div className="bg-white rounded-[2rem] p-5 border-4 border-toy-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] mb-6 relative z-10">
          <h2 className="text-xl font-black text-toy-black mb-4">{lang === 'kn' ? 'ಗ್ರಾಹಕರ ವಿವರಗಳು' : 'Customer Details'}</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-toy-yellow/20 p-2 rounded-xl text-toy-brown border-2 border-toy-yellow/30">
                <User size={18} />
              </div>
              <div>
                <div className="text-xs font-black text-toy-brown/50 uppercase tracking-widest">{lang === 'kn' ? 'ಹೆಸರು' : 'Name'}</div>
                <div className="font-black text-toy-black">{user.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-toy-yellow/20 p-2 rounded-xl text-toy-brown border-2 border-toy-yellow/30">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-xs font-black text-toy-brown/50 uppercase tracking-widest">{lang === 'kn' ? 'ವಿಳಾಸ' : 'Address'}</div>
                <div className="font-black text-toy-black text-sm">{user.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-toy-yellow/20 p-2 rounded-xl text-toy-brown border-2 border-toy-yellow/30">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-xs font-black text-toy-brown/50 uppercase tracking-widest">{lang === 'kn' ? 'ದೂರವಾಣಿ' : 'Phone'}</div>
                <div className="font-black text-toy-black">{user.phone}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 border-4 border-toy-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]">
            <Package size={40} className="text-toy-orange" />
          </div>
          <h2 className="text-xl font-black text-toy-black mb-2">{lang === 'kn' ? 'ಯಾವುದೇ ಆದೇಶಗಳಿಲ್ಲ' : 'No Orders Yet'}</h2>
          <p className="text-toy-brown font-black mb-6">{lang === 'kn' ? 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಆಟಿಕೆಗಳನ್ನು ಖರೀದಿಸಿಲ್ಲ.' : 'You haven\'t purchased any toys yet.'}</p>
          <button 
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2 bg-toy-green text-white px-6 py-3 rounded-xl font-black border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
          >
            <ShoppingBag size={20} />
            {lang === 'kn' ? 'ಶಾಪಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ' : 'Start Shopping'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 relative z-10">
          {orders.map((order, idx) => {
            const currentStep = getStatusIndex(order.status);
            
            return (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2rem] p-5 border-4 border-toy-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]"
              >
                <div className="flex items-center gap-4 mb-6 sticky top-0 bg-white z-20 py-2">
                  <div className="w-20 h-20 bg-toy-wood-bg/30 rounded-2xl border-2 border-toy-black overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <img src={order.item.img} alt={order.item.en_name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-toy-red mb-1 uppercase tracking-widest">
                      {lang === 'kn' ? 'ಆದೇಶ' : 'Order'} #{order.id}
                    </div>
                    <h3 className="font-black text-toy-black text-lg leading-tight mb-1">
                      {lang === 'kn' ? order.item.kn_name : order.item.en_name}
                    </h3>
                    <div className="text-sm font-black text-toy-brown/50 italic">{order.date}</div>
                  </div>
                </div>

                {order.status === 'returned' ? (
                  <div className="bg-toy-red/10 p-4 rounded-xl border-2 border-toy-red text-center text-toy-red font-black flex items-center justify-center gap-2">
                    <RefreshCw size={18} />
                    {lang === 'kn' ? 'ಉತ್ಪನ್ನವನ್ನು ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ' : 'Product Returned'}
                  </div>
                ) : order.status === 'cancelled' ? (
                  <div className="bg-toy-black/5 p-4 rounded-xl border-2 border-toy-black text-center text-toy-black font-black flex items-center justify-center gap-2">
                    <X size={18} />
                    {lang === 'kn' ? 'ಆದೇಶ ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ' : 'Order Cancelled'}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute top-4 left-4 right-4 h-1 bg-toy-black/10 rounded-full z-0"></div>
                    <div 
                      className="absolute top-4 left-4 h-1 bg-toy-green rounded-full z-0 transition-all duration-500"
                      style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 2rem)` }}
                    ></div>
                    
                    <div className="flex justify-between relative z-10 w-full mb-6 px-1">
                      {steps.map((step, stepIdx) => {
                        const isCompleted = stepIdx <= currentStep;
                        const isCurrent = stepIdx === currentStep;
                        
                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${isCompleted ? 'bg-toy-green border-toy-black text-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]' : 'bg-toy-wood-bg border-toy-black/10 text-toy-brown/30'}`}>
                              {step.icon}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${isCurrent ? 'text-toy-green' : isCompleted ? 'text-toy-black' : 'text-toy-brown/30'}`}>
                              {lang === 'kn' ? step.kn : step.en}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    { (order.trackingNumber || order.carrier || order.expectedDelivery) && (
                      <div className="bg-toy-yellow/10 p-3 rounded-xl border-2 border-toy-yellow/30 mb-4 text-sm mt-4">
                        {order.carrier && (
                          <div className="flex justify-between mb-1">
                            <span className="font-black text-toy-brown/60 uppercase text-[10px] tracking-widest">{lang === 'kn' ? 'ವಿತರಕರು:' : 'Carrier:'}</span>
                            <span className="font-black text-toy-black">{order.carrier}</span>
                          </div>
                        )}
                        {order.trackingNumber && (
                          <div className="flex justify-between mb-1">
                            <span className="font-black text-toy-brown/60 uppercase text-[10px] tracking-widest">{lang === 'kn' ? 'ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ:' : 'Tracking No:'}</span>
                            <span className="font-black text-toy-black">{order.trackingNumber}</span>
                          </div>
                        )}
                        {order.expectedDelivery && (
                          <div className="flex justify-between">
                            <span className="font-black text-toy-brown/60 uppercase text-[10px] tracking-widest">{lang === 'kn' ? 'ನಿರೀಕ್ಷಿತ ವಿತರಣೆ:' : 'Expected Delivery:'}</span>
                            <span className="font-black text-toy-red">{order.expectedDelivery}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {order.shippingDetails && (
                      <div className="bg-toy-wood-bg/30 p-3 rounded-xl border-2 border-toy-brown/10 mt-4 text-sm animate-in fade-in">
                        <div className="font-black text-toy-brown mb-1 uppercase text-[10px] tracking-widest">{lang === 'kn' ? 'ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ' : 'Shipping Address'}</div>
                        <div className="text-toy-black font-black leading-relaxed italic">
                          {order.shippingDetails.name}<br/>
                          {order.shippingDetails.address}<br/>
                          PIN: {order.shippingDetails.pincode}<br/>
                          Phone: {order.shippingDetails.phone}
                        </div>
                      </div>
                    )}
                    
                    {order.status === 'delivered' && (
                      <div className="pt-2 flex justify-center mt-4">
                        <button 
                          onClick={() => setReturnOrderInfo({id: order.id, item: order.item})}
                          className="flex items-center gap-2 bg-toy-red/10 text-toy-red px-4 py-2 rounded-xl font-black border-2 border-toy-red hover:bg-toy-red/20 transition-colors text-sm shadow-[4px_4px_0px_0px_rgba(239,68,68,0.1)] active:translate-y-[1px] active:shadow-none"
                        >
                          <RefreshCw size={16} />
                          {lang === 'kn' ? 'ತಪ್ಪು ಉತ್ಪನ್ನ - ಹಿಂದಿರುಗಿಸಿ' : 'Wrong Product - Return'}
                        </button>
                      </div>
                    )}

                    {currentStep < 2 && (
                      <div className="pt-2 flex justify-center mt-4">
                        <button 
                          onClick={() => setCancelOrderInfo({id: order.id, item: order.item})}
                          className="flex items-center gap-2 bg-toy-black/5 text-toy-brown px-4 py-2 rounded-xl font-black border-2 border-toy-black/20 hover:bg-toy-black/10 transition-colors text-sm"
                        >
                          <X size={16} />
                          {lang === 'kn' ? 'ಆದೇಶ ರದ್ದುಗೊಳಿಸಿ' : 'Cancel Order'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {returnOrderInfo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-toy-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] w-full max-w-sm"
            >
              <h3 className="text-xl font-black text-toy-black mb-2">
                {lang === 'kn' ? 'ವಸ್ತು ಹಿಂದಿರುಗಿಸಿ' : 'Return Item'}
              </h3>
              <p className="text-toy-brown font-black mb-6 text-sm italic">
                {lang === 'kn' ? 'ತಪ್ಪು ಉತ್ಪನ್ನವನ್ನು ಕಳುಹಿಸಲಾಗಿದೆಯೇ? ನೀವು ಅದನ್ನು ಹಿಂದಿರುಗಿಸಬಹುದು.' : 'Did you receive the wrong product? You can return it for a replacement or refund.'}
              </p>
              
              <div className="flex items-center gap-3 mb-6 p-3 bg-toy-wood-bg/30 rounded-xl border-2 border-toy-brown/10">
                <img src={returnOrderInfo.item.img} alt={returnOrderInfo.item.en_name} className="w-12 h-12 object-contain" />
                <div className="flex-1">
                  <div className="text-[10px] font-black text-toy-red uppercase tracking-widest">{lang === 'kn' ? 'ಆದೇಶ' : 'Order'} #{returnOrderInfo.id}</div>
                  <div className="font-black text-toy-black text-sm leading-tight">
                    {lang === 'kn' ? returnOrderInfo.item.kn_name : returnOrderInfo.item.en_name}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setReturnOrderInfo(null)}
                  className="flex-1 py-3 bg-white text-toy-black font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-wood-bg active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
                >
                  {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                </button>
                <button 
                  onClick={() => {
                    onReturnOrder(returnOrderInfo.id);
                    setReturnOrderInfo(null);
                  }}
                  className="flex-1 py-3 bg-toy-red text-white font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:opacity-90 active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
                >
                  {lang === 'kn' ? 'ಹಿಂದಿರುಗಿಸಿ' : 'Confirm Return'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {cancelOrderInfo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-toy-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] w-full max-w-sm"
            >
              <h3 className="text-xl font-black text-toy-black mb-2">
                {lang === 'kn' ? 'ಆದೇಶ ರದ್ದುಗೊಳಿಸಿ' : 'Cancel Order'}
              </h3>
              <p className="text-toy-brown font-black mb-6 text-sm italic">
                {lang === 'kn' ? 'ನೀವು ಖಚಿತವಾಗಿ ಈ ಆದೇಶವನ್ನು ರದ್ದುಗೊಳಿಸಲು ಬಯಸುತ್ತೀರಾ? ಈ ಕ್ರಮವನ್ನು ಬದಲಾಯಿಸಲಾಗುವುದಿಲ್ಲ.' : 'Are you sure you want to cancel this order? This action cannot be undone.'}
              </p>
              
              <div className="flex items-center gap-3 mb-6 p-3 bg-toy-wood-bg/30 rounded-xl border-2 border-toy-brown/10">
                <img src={cancelOrderInfo.item.img} alt={cancelOrderInfo.item.en_name} className="w-12 h-12 object-contain" />
                <div className="flex-1">
                  <div className="text-[10px] font-black text-toy-red uppercase tracking-widest">{lang === 'kn' ? 'ಆದೇಶ' : 'Order'} #{cancelOrderInfo.id}</div>
                  <div className="font-black text-toy-black text-sm leading-tight">
                    {lang === 'kn' ? cancelOrderInfo.item.kn_name : cancelOrderInfo.item.en_name}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setCancelOrderInfo(null)}
                  className="flex-1 py-3 bg-white text-toy-black font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-wood-bg active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
                >
                  {lang === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}
                </button>
                <button 
                  onClick={() => {
                    onCancelOrder(cancelOrderInfo.id);
                    setCancelOrderInfo(null);
                  }}
                  className="flex-1 py-3 bg-toy-black text-white font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-brown active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
                >
                  {lang === 'kn' ? 'ಖಚಿತಪಡಿಸಿ' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
