import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, PlayCircle, Star, ShieldCheck } from 'lucide-react';
import { mockToys, artisanDetails } from '../data';

export default function VerifyView({ 
  t, 
  lang, 
  user, 
  onNavigate, 
  scannedCode, 
  onClearScan 
}: { 
  t: any, 
  lang: string, 
  user: any, 
  onNavigate: (t: string) => void,
  scannedCode?: string | null,
  onClearScan?: () => void
}) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (scannedCode) {
      setCode(scannedCode);
      // Small timeout to allow the text to appear before verifying for visual feedback
      const timer = setTimeout(() => {
        handleVerify(scannedCode);
        if (onClearScan) onClearScan();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scannedCode]);

  const handleVerify = (codeToVerify?: string) => {
    const finalCode = codeToVerify || code;
    if (finalCode.length < 3) return;
    const toy = mockToys.find((t) => t.id === finalCode);
    if (toy) {
      const artisan = artisanDetails.find((a) => a.id === toy.artisanId);
      setResult({ toy, artisan });
    } else {
      setResult(null);
    }
    setHasSearched(true);
  };

  return (
    <div className="flex flex-col h-full bg-toy-wood-bg relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5d4037_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      
      <div className="bg-toy-red rounded-b-[2rem] p-6 pb-8 shadow-xl relative overflow-hidden z-10 border-b-4 border-toy-black">
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-toy-yellow rounded-full opacity-20"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-toy-orange rounded-full opacity-20"></div>
        
        {user && user.name !== 'Guest User' && (
          <p className="text-toy-yellow font-black mb-1 relative z-10 text-[10px] uppercase tracking-widest">{lang === 'kn' ? `ಸುಸ್ವಾಗತ, ${user.name}!` : `Welcome back, ${user.name.split(' ')[0]}!`}</p>
        )}
        <h1 className="text-3xl font-black text-white mb-1 relative z-10">{t.verifyTitle}</h1>
        <p className="text-white/80 font-bold mb-6 relative z-10 text-xs italic">{t.verifySubtitle}</p>
        
        <div className="flex flex-row gap-2 relative z-10">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ''));
              setHasSearched(false);
            }}
            placeholder={t.verifyPlaceholder}
            className="flex-1 w-full min-w-0 bg-white border-4 border-toy-black rounded-2xl px-3 py-3 text-xl font-black tracking-widest text-center shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] focus:translate-y-[2px] transition-all placeholder:text-toy-brown/20 placeholder:tracking-normal text-toy-black"
          />
          <button
            onClick={() => handleVerify()}
            className="shrink-0 bg-toy-yellow text-toy-brown text-lg font-black px-4 py-3 border-4 border-toy-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-orange hover:text-white active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-y-[2px] transition-all whitespace-nowrap"
          >
            {t.verifyButton}
          </button>
        </div>
        <p className="text-[10px] uppercase font-black tracking-wider text-center text-white/60 mt-4">{t.tryMock}</p>
      </div>

      <div className="flex-1 p-6 pb-24 overflow-y-auto relative z-0">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className="w-24 h-24 bg-toy-yellow/10 rounded-full border-4 border-dashed border-toy-yellow/30 flex items-center justify-center mb-6">
                <ShieldCheck size={64} className="text-toy-yellow/20" />
              </div>
              <p className="text-center font-black text-toy-brown uppercase tracking-widest text-[10px] max-w-[200px] leading-relaxed opacity-40">Enter the unique ID to discover the story of your toy.</p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="success"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white border-4 border-toy-black rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
                <div className="flex items-center gap-3 mb-6 bg-toy-green/10 p-3 rounded-2xl border-2 border-toy-green/20">
                  <CheckCircle2 className="text-toy-green" size={32} />
                  <h2 className="text-2xl font-black text-toy-black leading-tight">{t.authenticTitle}</h2>
                </div>
                
                <div className="relative group mb-6">
                  <img src={result.toy.image} alt="Toy" className="w-full h-56 object-cover rounded-[1.5rem] border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,0.1)]" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 bg-toy-yellow text-toy-brown px-3 py-1 rounded-full border-2 border-toy-black font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                    #Certified
                  </div>
                </div>
                
                <div className="bg-toy-wood-bg/30 rounded-2xl p-4 border-2 border-toy-brown/10 flex items-center gap-4 mb-6">
                  <img src={result.artisan.photo} alt={result.artisan.name} className="w-16 h-16 rounded-2xl border-2 border-toy-black object-cover shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-[10px] text-toy-brown font-black uppercase tracking-widest opacity-60">{t.madeBy}</p>
                    <p className="text-xl font-black text-toy-black leading-tight">{lang === 'kn' ? result.artisan.kn_name : result.artisan.name}</p>
                    <div className="flex text-toy-yellow mt-1">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="bg-toy-wood-bg/10 p-4 rounded-xl border-l-4 border-toy-yellow mb-6">
                  <p className="text-toy-brown font-black italic leading-relaxed text-sm">
                    "{result.artisan.bio}"
                  </p>
                </div>

                <button 
                  onClick={() => onNavigate('process')} 
                  className="w-full flex items-center justify-center gap-2 bg-toy-green text-white font-black py-4 px-4 rounded-xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-emerald-600 active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
                >
                  <PlayCircle size={20} />
                  {t.watchProcess}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border-4 border-toy-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-toy-red/10 rounded-full flex items-center justify-center mb-6 border-4 border-toy-red/20 shadow-[4px_4px_0px_0px_rgba(239,68,68,0.05)]">
                <XCircle className="text-toy-red" size={40} />
              </div>
              <h2 className="text-2xl font-black text-toy-black mb-2">{t.invalidTitle}</h2>
              <p className="text-toy-brown font-black italic text-sm">{t.invalidDesc}</p>
              
              <button 
                onClick={() => setCode('')} 
                className="mt-8 text-toy-red font-black uppercase text-[10px] tracking-widest hover:underline"
              >
                Try Another Code
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
