import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Scissors, Sparkles, Droplets, Palette, Package, ArrowRight, X, PlayCircle } from 'lucide-react';

export default function ProcessView({ t, lang, onNavigate }: { t: any, lang: string, onNavigate: (t: string) => void }) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const steps = [
    {
      icon: <Leaf size={28} className="text-white" />,
      title: t.step1Title,
      desc: t.step1Desc,
      detail: t.step1Detail,
      bgColor: "bg-toy-green",
      borderColor: "border-toy-black",
      shadow: "shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]",
      img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400&h=300"
    },
    {
      icon: <Scissors size={28} className="text-white" />,
      title: t.step2Title,
      desc: t.step2Desc,
      detail: t.step2Detail,
      bgColor: "bg-toy-brown",
      borderColor: "border-toy-black",
      shadow: "shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]",
      img: "https://images.unsplash.com/photo-1517420879524-86d64ac2f339?auto=format&fit=crop&q=80&w=400&h=300"
    },
    {
      icon: <Droplets size={28} className="text-white" />,
      title: t.step3Title,
      desc: t.step3Desc,
      detail: t.step3Detail,
      bgColor: "bg-toy-red",
      borderColor: "border-toy-black",
      shadow: "shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]",
      img: "https://images.unsplash.com/photo-1574515518428-1b20b29ce3ce?auto=format&fit=crop&q=80&w=400&h=300"
    },
    {
      icon: <Sparkles size={28} className="text-white" />,
      title: t.step4Title,
      desc: t.step4Desc,
      detail: t.step4Detail,
      bgColor: "bg-toy-yellow",
      borderColor: "border-toy-black",
      shadow: "shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]",
      img: "https://images.unsplash.com/photo-1533045620959-5d2ac2eb81bb?auto=format&fit=crop&q=80&w=400&h=300"
    },
    {
      icon: <Palette size={28} className="text-white" />,
      title: t.step5Title,
      desc: t.step5Desc,
      detail: t.step5Detail,
      bgColor: "bg-toy-orange",
      borderColor: "border-toy-black",
      shadow: "shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400&h=300"
    },
    {
      icon: <Package size={28} className="text-white" />,
      title: t.step6Title,
      desc: t.step6Desc,
      detail: t.step6Detail,
      bgColor: "bg-toy-black",
      borderColor: "border-toy-black",
      shadow: "shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]",
      img: "https://images.unsplash.com/photo-1581007871115-f14bc016e0a4?auto=format&fit=crop&q=80&w=400&h=300"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-toy-wood-bg bg-[radial-gradient(#5d4037_1px,transparent_1px)] [background-size:16px_16px] p-6 overflow-x-hidden overflow-y-auto relative">
      
      <div className="mb-8 text-center mt-4">
        <h1 className="text-3xl font-black text-toy-black border-b-4 border-toy-red pb-2 inline-block mb-4">
          {t.processHeading}
        </h1>
        
        <div className="mt-6 mx-auto w-full max-w-2xl bg-white rounded-[2rem] border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] overflow-hidden flex flex-col relative">
          <div className="bg-toy-red border-b-4 border-toy-black p-3 flex items-center justify-center">
            <h3 className="font-black text-white text-lg flex items-center gap-2">
              <PlayCircle size={20} /> {t.watchProcess || "Watch Making Process"}
            </h3>
          </div>
          <div className="aspect-video w-full bg-toy-black">
            <iframe 
              className="w-full h-full" 
              src={lang === 'kn' ? "https://www.youtube.com/embed/XQ5dHQwskSw" : "https://www.youtube.com/embed/Bqkw1zfRZ_w"} 
              title="Channapatna Toys Making Process" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 pb-20">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            onClick={() => setSelectedStep(idx)}
            className={`flex flex-col p-5 rounded-3xl border-4 bg-white cursor-pointer hover:-translate-y-1 transition-transform border-toy-black ${step.shadow}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl border-4 shrink-0 border-toy-black ${step.bgColor}`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-toy-black">{step.title}</h3>
                <p className="text-toy-brown font-black leading-tight mt-1 text-sm line-clamp-2">
                  {step.desc}
                </p>
              </div>
              <div className={`p-2 rounded-full border-2 border-toy-black ${step.bgColor}`}>
                <ArrowRight size={16} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
        
        <motion.button
          onClick={() => onNavigate('map')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: steps.length * 0.15 }}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-toy-green text-white font-black py-4 px-6 rounded-2xl border-4 border-toy-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:opacity-90 active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all"
        >
          {t.meetArtisansBtn} <ArrowRight size={22} />
        </motion.button>
      </div>

      <AnimatePresence>
        {selectedStep !== null && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-toy-wood-bg"
          >
            <div className={`h-full w-full flex flex-col items-center p-6 pb-24 overflow-y-auto`}>
              <button 
                onClick={() => setSelectedStep(null)}
                className="absolute top-6 right-6 p-2 bg-white rounded-full border-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] border-toy-black z-10 hover:bg-toy-wood-bg transition-colors"
              >
                <X size={24} className="text-toy-black" />
              </button>

              <div className={`w-20 h-20 rounded-3xl border-4 flex items-center justify-center mb-6 mt-8 border-toy-black ${steps[selectedStep].bgColor} shadow-[4px_4px_0px_0px_rgba(26,26,26,0.1)]`}>
                {steps[selectedStep].icon}
              </div>

              <h2 className="text-3xl font-black text-toy-black text-center mb-6 px-4">
                {steps[selectedStep].title}
              </h2>

              {steps[selectedStep].img && (
                <div className={`w-full max-w-[320px] rounded-3xl border-4 border-toy-black overflow-hidden mb-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]`}>
                  <img 
                    src={steps[selectedStep].img} 
                    alt={steps[selectedStep].title} 
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer" 
                  />
                </div>
              )}

              <div className={`bg-white rounded-3xl p-6 border-4 flex flex-col gap-4 shadow-[8px_8px_0px_0px_rgba(26,26,26,0.1)] border-toy-black`}>
                 <h4 className="font-black text-toy-black text-lg border-b-2 border-toy-yellow pb-2">Quick Summary:</h4>
                 <p className="text-toy-brown font-black text-lg leading-relaxed">
                   {steps[selectedStep].desc}
                 </p>
                 
                 <h4 className="font-black text-toy-black text-lg border-b-2 border-toy-yellow pb-2 mt-2">Detailed Process:</h4>
                 <p className="text-toy-brown font-black text-lg leading-relaxed pb-4">
                   {steps[selectedStep].detail}
                 </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
