import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Star, ShieldCheck, Search, Heart, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { catalogItems } from '../data';

interface CatalogViewProps {
  t: any;
  lang: string;
  user: any;
  onNavigate: (t: string) => void;
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  onPurchase: (item: any) => void;
  onRequireLogin: () => void;
}

export default function CatalogView({ t, lang, user, onNavigate, wishlist, setWishlist, onPurchase, onRequireLogin }: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'wishlist'>('all');
  const [confirmItem, setConfirmItem] = useState<any>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [notifyItem, setNotifyItem] = useState<any>(null);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingPincode, setShippingPincode] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');

  const puzzleRadii = [
    "rounded-tl-[3rem] rounded-tr-[1rem] rounded-bl-[1rem] rounded-br-[3rem]",
    "rounded-tl-[1rem] rounded-tr-[3rem] rounded-bl-[3rem] rounded-br-[1rem]",
    "rounded-tl-[2rem] rounded-tr-[2rem] rounded-bl-[0.5rem] rounded-br-[3rem]",
    "rounded-tl-[3rem] rounded-tr-[0.5rem] rounded-bl-[2rem] rounded-br-[2rem]",
  ];

  const handleLocateStore = (item: any) => {
    if (user && user.name === 'Guest User') {
      setShowLoginPrompt(true);
    } else {
      setConfirmItem(item);
    }
  };

  const filteredItems = useMemo(() => {
    let items = catalogItems;
    if (activeTab === 'wishlist') {
      items = items.filter(item => wishlist.includes(item.en_name));
    }
    
    const query = searchQuery.toLowerCase();
    if (!query) return items;
    return items.filter(item => 
      item.en_name.toLowerCase().includes(query) || 
      item.kn_name.includes(query)
    );
  }, [searchQuery, activeTab, wishlist]);

  const toggleWishlist = (e: React.MouseEvent, enName: string) => {
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(enName) 
        ? prev.filter(name => name !== enName)
        : [...prev, enName]
    );
  };

  return (
    <div className="flex flex-col h-full bg-toy-wood-bg p-6 overflow-y-auto overflow-x-hidden pb-24 relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5d4037_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      
      {/* Heritage Story Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 p-5 bg-white border-4 border-toy-black rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-toy-yellow/20 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
        <h2 className="text-xl font-black text-toy-black mb-3 flex items-center gap-2">
          <Star className="text-toy-orange fill-toy-orange" size={20} />
          {lang === 'kn' ? "ಪರಂಪರೆಯ ಕಥೆ" : "Heritage Story"}
        </h2>
        <p className="text-sm font-black text-toy-brown leading-relaxed italic">
          {lang === 'kn' 
            ? "ಇದು ಭಾರತೀಯ ಜಾನಪದ ಕಲೆ ಮತ್ತು ಗ್ರಾಮೀಣ ಕುಶಲತೆಯೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದ ವರ್ಣರಂಜಿತ ಕೈಯಿಂದ ಮಾಡಿದ ಮರದ ಆಟಿಕೆಗಳನ್ನು ಹೊಂದಿದೆ. ಸಾಂಪ್ರದಾಯಿಕ, ಸಾಂಸ್ಕೃತಿಕ ಮತ್ತು ವಿಂಟೇಜ್ ಸಂಗ್ರಹದ ಅನುಭವ ನೀಡುತ್ತದೆ."
            : "Features colorful handcrafted wooden toys associated with Indian folk art and rural craftsmanship. Experience a traditional, cultural, and vintage artisan collection."}
        </p>
      </motion.div>

      <div className="mb-6 flex flex-col gap-4 relative z-10 mt-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-toy-black drop-shadow-sm border-b-4 border-toy-yellow pb-2 inline-block self-start">{t.catalogHeading}</h1>
          <div className="flex bg-white rounded-xl border-4 border-toy-black p-1 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-black text-sm transition-colors ${activeTab === 'all' ? 'bg-toy-red text-white' : 'text-toy-brown hover:bg-toy-yellow/10'}`}
            >
              {lang === 'kn' ? 'ಎಲ್ಲಾ' : 'All'}
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2 rounded-lg font-black text-sm transition-colors flex items-center gap-1.5 ${activeTab === 'wishlist' ? 'bg-toy-red text-white' : 'text-toy-brown hover:bg-toy-yellow/10'}`}
            >
              <Heart size={16} className={activeTab === 'wishlist' ? "fill-white" : ""} />
              {lang === 'kn' ? 'ಹಾರೈಕೆ ಪಟ್ಟಿ' : 'Wishlist'}
              {wishlist.length > 0 && <span className="bg-toy-yellow text-toy-brown text-[10px] px-1.5 py-0.5 rounded-full border border-toy-black/20">{wishlist.length}</span>}
            </button>
          </div>
        </div>
        
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-toy-orange" size={20} />
          </div>
          <input
            type="text"
            className="w-full bg-white border-4 border-toy-black rounded-2xl pl-10 pr-4 py-3 text-lg font-black text-toy-black placeholder-toy-orange/30 focus:outline-none focus:border-toy-orange shadow-[4px_4px_0px_0px_rgba(245,158,11,1)]"
            placeholder={lang === 'kn' ? "ಆಟಿಕೆಗಳನ್ನು ಹುಡುಕಿ..." : "Search toys..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-white border-4 border-toy-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]">
            <p className="font-black text-toy-brown text-lg">
              {lang === 'kn' ? "ಯಾವುದೇ ಆಟಿಕೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ" : "No toys found"}
            </p>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            className={`bg-white p-3 border-4 border-toy-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex flex-col hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] transition-all ${puzzleRadii[idx % 4]}`}
            onClick={() => handleLocateStore(item)}
          >
             <div className={`${['bg-toy-red/10', 'bg-toy-green/10', 'bg-toy-yellow/10', 'bg-toy-orange/10'][idx%4]} rounded-2xl border-4 border-toy-black overflow-hidden mb-3 aspect-square w-full relative flex items-center justify-center p-2`}>
                <img src={item.img} alt={item.en_name} className="w-full h-full object-contain transition-transform duration-500 hover:scale-110" referrerPolicy="no-referrer" />
                <button 
                  onClick={(e) => toggleWishlist(e, item.en_name)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full border-2 border-toy-black shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:bg-white transition-colors z-10"
                >
                  <Heart size={16} className={`${wishlist.includes(item.en_name) ? "fill-toy-red text-toy-red" : "text-gray-400"}`} />
                </button>
             </div>
            <div className="flex-1 flex flex-col justify-end pt-1">
              <h3 className="font-black text-toy-black leading-tight mb-1 text-[15px]">
                {lang === 'kn' ? item.kn_name : item.en_name}
              </h3>
              <div className="flex items-center justify-between mb-3">
                <p className="text-toy-red font-black text-sm bg-toy-yellow/20 px-2 py-0.5 border-2 border-toy-yellow rounded-xl">{item.price}</p>
                {item.stock > 0 ? (
                  <span className="text-[10px] font-black text-toy-brown">{lang === 'kn' ? `ಸ್ಟಾಕ್: ${item.stock}` : `Stock: ${item.stock}`}</span>
                ) : (
                  <span className="text-[10px] font-black text-toy-red uppercase">{lang === 'kn' ? 'ಸ್ಟಾಕ್ ಇಲ್ಲ' : 'Out of Stock'}</span>
                )}
              </div>
              
              {item.stock > 0 ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLocateStore(item); }}
                  className="w-full bg-toy-black text-white font-black py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 hover:bg-toy-brown active:translate-y-[2px] transition-all shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
                >
                  <ShoppingBag size={16} />
                  {lang === 'kn' ? 'ಈಗ ಖರೀದಿಸಿ' : 'Buy Now'}
                </button>
              ) : (
                <button 
                  onClick={(e) => { e.stopPropagation(); setNotifyItem(item); }}
                  className="w-full bg-white text-toy-brown font-black py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 hover:bg-toy-wood-bg active:translate-y-[2px] transition-all border-2 border-toy-brown/30"
                >
                  {lang === 'kn' ? 'ನನಗೆ ತಿಳಿಸಿ' : 'Notify Me'}
                </button>
              )}
            </div>
          </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {confirmItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-toy-black/40 backdrop-blur-sm"
            onClick={() => setConfirmItem(null)}
          >
             <div className="bg-white rounded-[2rem] border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
               <div className="absolute top-4 right-4 cursor-pointer z-10" onClick={() => setConfirmItem(null)}>
                 <X size={20} className="text-toy-black font-black" />
               </div>
               <h2 className="text-2xl font-black text-toy-black mb-4 pr-6">{lang === 'kn' ? 'ಪಾವತಿ' : 'Payment'}</h2>
               
               <div className="flex items-center gap-4 p-4 bg-toy-wood-bg rounded-2xl border-2 border-toy-black/20 mb-6">
                 <img src={confirmItem.img} alt={confirmItem.en_name} className="w-16 h-16 rounded-xl object-contain border-2 border-toy-black shrink-0" />
                 <div className="flex-1 min-w-0">
                   <h3 className="font-black text-toy-black leading-tight truncate">
                     {lang === 'kn' ? confirmItem.kn_name : confirmItem.en_name}
                   </h3>
                   <div className="text-toy-red font-black mt-1">{confirmItem.price}</div>
                 </div>
               </div>

               <h3 className="font-black text-toy-black mb-3">{lang === 'kn' ? 'ಶಿಪ್ಪಿಂಗ್ ವಿವರಗಳು' : 'Shipping Details'}</h3>
               <div className="flex flex-col gap-3 mb-6">
                 <div>
                   <label className="block text-sm font-black text-toy-brown mb-1">{lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'}</label>
                   <input type="text" value={shippingName} onChange={e => setShippingName(e.target.value)} placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು' : 'Your Name'} className="w-full border-2 border-toy-black/20 rounded-xl px-4 py-3 bg-toy-wood-bg focus:bg-white focus:outline-none focus:border-toy-black transition-colors placeholder-toy-brown/30 font-black" />
                 </div>
                 <div>
                   <label className="block text-sm font-black text-toy-brown mb-1">{lang === 'kn' ? 'ವಿಳಾಸ' : 'Address'}</label>
                   <input type="text" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder={lang === 'kn' ? 'ಮನೆ ಸಂಖ್ಯೆ, ರಸ್ತೆ, ಪ್ರದೇಶ' : 'House No, Street, Area'} className="w-full border-2 border-toy-black/20 rounded-xl px-4 py-3 bg-toy-wood-bg focus:bg-white focus:outline-none focus:border-toy-black transition-colors placeholder-toy-brown/30 font-black" />
                 </div>
                 <div className="flex gap-3">
                   <div className="flex-1">
                     <label className="block text-sm font-black text-toy-brown mb-1">{lang === 'kn' ? 'ಪಿನ್ ಕೋಡ್' : 'Pincode'}</label>
                     <input type="text" value={shippingPincode} onChange={e => setShippingPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="560001" maxLength={6} className="w-full border-2 border-toy-black/20 rounded-xl px-4 py-3 bg-toy-wood-bg focus:bg-white focus:outline-none focus:border-toy-black transition-colors placeholder-toy-brown/30 font-black" />
                   </div>
                   <div className="flex-1">
                     <label className="block text-sm font-black text-toy-brown mb-1">{lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Phone Number'}</label>
                     <input type="tel" value={shippingPhone} onChange={e => setShippingPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} placeholder="9876543210" maxLength={10} className="w-full border-2 border-toy-black/20 rounded-xl px-4 py-3 bg-toy-wood-bg focus:bg-white focus:outline-none focus:border-toy-black transition-colors placeholder-toy-brown/30 font-black" />
                   </div>
                 </div>
               </div>

               <h3 className="font-black text-toy-black mb-3">{lang === 'kn' ? 'ಪಾವತಿ ವಿಧಾನ' : 'Payment Method'}</h3>
               <div className="flex flex-col gap-3 mb-6">
                 <div 
                   onClick={() => setPaymentMethod('upi')}
                   className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-colors ${paymentMethod === 'upi' ? 'border-toy-black bg-toy-black text-white shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]' : 'border-toy-black/20 hover:border-toy-black bg-white text-toy-brown'}`}
                 >
                   <div className={`p-2 rounded-lg ${paymentMethod === 'upi' ? 'bg-white/20 text-white' : 'bg-toy-wood-bg text-toy-brown'}`}>
                     <Smartphone size={20} />
                   </div>
                   <span className="font-black">{lang === 'kn' ? 'ಯುಪಿಐ (UPI)' : 'UPI'}</span>
                 </div>
                 
                 <div 
                   onClick={() => setPaymentMethod('card')}
                   className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-colors ${paymentMethod === 'card' ? 'border-toy-black bg-toy-black text-white shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]' : 'border-toy-black/20 hover:border-toy-black bg-white text-toy-brown'}`}
                 >
                   <div className={`p-2 rounded-lg ${paymentMethod === 'card' ? 'bg-white/20 text-white' : 'bg-toy-wood-bg text-toy-brown'}`}>
                     <CreditCard size={20} />
                   </div>
                   <span className="font-black">{lang === 'kn' ? 'ಕ್ರೆಡಿಟ್ / ಡೆಬಿಟ್ ಕಾರ್ಡ್' : 'Credit / Debit Card'}</span>
                 </div>

                 <div 
                   onClick={() => setPaymentMethod('cod')}
                   className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-colors ${paymentMethod === 'cod' ? 'border-toy-black bg-toy-black text-white shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]' : 'border-toy-black/20 hover:border-toy-black bg-white text-toy-brown'}`}
                 >
                   <div className={`p-2 rounded-lg ${paymentMethod === 'cod' ? 'bg-white/20 text-white' : 'bg-toy-wood-bg text-toy-brown'}`}>
                     <Banknote size={20} />
                   </div>
                   <span className="font-black">{lang === 'kn' ? 'ತಲುಪಿಸಿದಾಗ ನಗದು' : 'Cash on Delivery'}</span>
                 </div>
               </div>

               <div className="flex gap-3 mt-4">
                 <button onClick={() => setConfirmItem(null)} className="flex-1 py-3.5 bg-white text-toy-brown font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-wood-bg active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all">
                   {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                 </button>
                 <button 
                   onClick={() => { 
                     onPurchase({ 
                       ...confirmItem, 
                       paymentMethod,
                       shippingDetails: {
                         name: shippingName || 'Guest',
                         address: shippingAddress || 'Not Provided',
                         pincode: shippingPincode || '000000',
                         phone: shippingPhone || '0000000000'
                       }
                     }); 
                     setConfirmItem(null); 
                     setPurchaseSuccess(true); 
                   }} 
                   className="flex-[2] py-3.5 bg-toy-green text-white font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-emerald-600 active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all flex items-center justify-center gap-2"
                 >
                   {paymentMethod === 'cod' ? (lang === 'kn' ? 'ಖಚಿತಪಡಿಸಿ' : 'Confirm Order') : (lang === 'kn' ? `${confirmItem.price} ಪಾವತಿಸಿ` : `Pay ${confirmItem.price}`)}
                 </button>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {purchaseSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-toy-black/40 backdrop-blur-sm"
            onClick={() => setPurchaseSuccess(false)}
          >
             <div className="bg-white rounded-[2rem] border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] p-6 max-w-sm w-full relative flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
               <div className="w-16 h-16 bg-toy-green/10 text-toy-green rounded-full flex items-center justify-center mb-4 border-4 border-toy-green">
                 <ShieldCheck size={32} />
               </div>
               <h2 className="text-2xl font-black text-toy-black mb-2">{lang === 'kn' ? 'ಆದೇಶ ಖಚಿತವಾಗಿದೆ!' : 'Order Confirmed!'}</h2>
               <p className="text-toy-brown font-black mb-6 text-[15px]">
                 {lang === 'kn' ? 'ನಿಮ್ಮ ಆದೇಶವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಇರಿಸಲಾಗಿದೆ. ಕುಶಲಕರ್ಮಿ ಆಟಿಕೆಗಳನ್ನು ಬೆಂಬಲಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!' : 'Your order has been placed successfully. Thank you for supporting artisan toys!'}
               </p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setPurchaseSuccess(false)} className="flex-1 py-3 bg-white text-toy-brown font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-wood-bg active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all">
                  {lang === 'kn' ? 'ಮುಂದುವರಿಸಿ' : 'Continue'}
                </button>
                <button onClick={() => { setPurchaseSuccess(false); onNavigate('orders'); }} className="flex-1 py-3 bg-toy-black text-white font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-brown active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all">
                  {lang === 'kn' ? 'ಆದೇಶಗಳು' : 'Orders'}
                </button>
              </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-toy-black/40 backdrop-blur-sm"
            onClick={() => setShowLoginPrompt(false)}
          >
             <div className="bg-white rounded-[2rem] border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] p-6 max-w-sm w-full relative flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
               <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowLoginPrompt(false)}>
                 <X size={20} className="text-toy-black font-black" />
               </div>
               <div className="w-16 h-16 bg-toy-red/10 text-toy-red rounded-full flex items-center justify-center mb-4 border-4 border-toy-red">
                 <ShieldCheck size={32} />
               </div>
               <h2 className="text-2xl font-black text-toy-black mb-2">{lang === 'kn' ? 'ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ' : 'Login Required'}</h2>
               <p className="text-toy-brown font-black mb-6 text-[15px]">
                 {lang === 'kn' ? 'ಆದೇಶವನ್ನು ಇರಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.' : 'Please sign in to place an order.'}
               </p>
               <div className="flex gap-3 w-full">
                 <button onClick={() => setShowLoginPrompt(false)} className="flex-1 py-3 bg-white text-toy-brown font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-wood-bg active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all">
                   {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                 </button>
                 <button onClick={() => onRequireLogin()} className="flex-1 py-3 bg-toy-orange text-white font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-red active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all">
                   {lang === 'kn' ? 'ಲಾಗಿನ್' : 'Sign In'}
                 </button>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notifyItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-toy-black/40 backdrop-blur-sm"
            onClick={() => setNotifyItem(null)}
          >
             <div className="bg-white rounded-[2rem] border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] p-6 max-w-sm w-full relative flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
               <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setNotifyItem(null)}>
                 <X size={20} className="text-toy-black font-black" />
               </div>
               <h2 className="text-2xl font-black text-toy-black mb-2">{lang === 'kn' ? 'ನಮಗೆ ತಿಳಿಸಿ' : 'Notify Me'}</h2>
               <p className="text-toy-brown font-black mb-6 text-[15px]">
                 {lang === 'kn' ? 'ಈ ವಸ್ತುವು ಸ್ಟಾಕ್‌ಗೆ ಬಂದಾಗ ನಾವು ನಿಮಗೆ ತಿಳಿಸುತ್ತೇವೆ: ' : 'We will inform you when this item is back in stock: '}
                 <span className="font-black text-toy-red">{lang === 'kn' ? notifyItem.kn_name : notifyItem.en_name}</span>
               </p>
               <div className="w-full text-left mb-6">
                 <label className="block text-sm font-black text-toy-brown mb-2">{lang === 'kn' ? 'ನಿಮ್ಮ ವಿಳಾಸ (ಇಮೇಲ್/ದೂರವಾಣಿ)' : 'Your contact info (Email/Phone)'}</label>
                 <input 
                   type="text" 
                   className="w-full border-4 border-toy-black rounded-xl px-4 py-3 bg-toy-wood-bg focus:bg-white focus:outline-none focus:border-toy-orange font-black" 
                   placeholder={lang === 'kn' ? 'ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್' : 'Email or Mobile Number'}
                   defaultValue={user && user.name !== 'Guest User' ? user.phone : ''}
                 />
               </div>
               <button onClick={() => { setNotifyItem(null); setNotifySuccess(true); }} className="w-full py-3 bg-toy-black text-white font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-brown active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all">
                 {lang === 'kn' ? 'ನೆನಪಿಸಿ' : 'Set Reminder'}
               </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notifySuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-toy-black/40 backdrop-blur-sm"
            onClick={() => setNotifySuccess(false)}
          >
             <div className="bg-white rounded-[2rem] border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] p-6 max-w-sm w-full relative flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
               <div className="w-16 h-16 bg-toy-yellow/10 text-toy-yellow rounded-full flex items-center justify-center mb-4 border-4 border-toy-yellow">
                 <ShieldCheck size={32} />
               </div>
               <h2 className="text-2xl font-black text-toy-black mb-2">{lang === 'kn' ? 'ಜ್ಞಾಪನೆಯನ್ನು ಹೊಂದಿಸಲಾಗಿದೆ!' : 'Reminder Set!'}</h2>
               <p className="text-toy-brown font-black mb-6 text-[15px]">
                 {lang === 'kn' ? 'ಸ್ಟಾಕ್ ಲಭ್ಯವಾದ ತಕ್ಷಣ ನಾವು ನಿಮಗೆ ತಿಳಿಸುತ್ತೇವೆ.' : 'We will notify you as soon as the stock is available.'}
               </p>
               <button onClick={() => setNotifySuccess(false)} className="w-full py-3 bg-toy-black text-white font-black rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-brown active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all">
                 {lang === 'kn' ? 'ಸರಿ' : 'Okay'}
               </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
