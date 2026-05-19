import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Star, Send, CheckCircle2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FeedbackView({ t, lang, user }: { t: any, lang: string, user: any }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && feedback.trim() !== '') {
      setIsSubmitting(true);
      try {
        const userId = user.id || user.userId || 'anonymous';
        const userName = user.name || 'Anonymous';
        
        await addDoc(collection(db, 'feedback'), {
          id: Math.random().toString(36).substr(2, 9),
          userId: userId,
          userName: userName,
          comment: feedback,
          rating: rating,
          createdAt: serverTimestamp()
        });
        setIsSubmitted(true);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'feedback');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-toy-wood-bg p-6 overflow-y-auto relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5d4037_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      
      <h1 className="text-3xl font-black text-toy-black mb-6 drop-shadow-sm flex items-center gap-2 relative z-10 border-b-4 border-toy-green pb-2 inline-block self-start">
        <MessageSquare size={32} className="text-toy-green" />
        {lang === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆ ಮತ್ತು ಸಂಪರ್ಕ' : 'Feedback & Contact'}
      </h1>

      <div className="bg-white rounded-[2rem] p-6 border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative z-10 flex flex-col items-center">
        {!isSubmitted ? (
          <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
            <p className="text-toy-brown font-black mb-6 text-center italic">
              {lang === 'kn' ? 'ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.' : 'We value your opinion. Share your experience with us.'}
            </p>

            {/* Rating Stars */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`${
                      (hoveredRating || rating) >= star
                        ? 'fill-toy-yellow text-toy-yellow drop-shadow-sm'
                        : 'text-toy-brown/20'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Default Name/Email if logged in */}
            <div className="w-full max-w-md space-y-4 mb-6">
              <div>
                <label className="block text-sm font-black text-toy-brown mb-1 uppercase tracking-widest text-[10px]">{lang === 'kn' ? 'ಹೆಸರು' : 'Name'}</label>
                <input
                  type="text"
                  readOnly={user && user.name !== 'Guest User'}
                  defaultValue={user && user.name !== 'Guest User' ? user.name : ''}
                  placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು' : 'Your Name'}
                  required
                  className="w-full p-3 rounded-xl border-4 border-toy-black/10 focus:border-toy-black focus:outline-none bg-toy-wood-bg/30 font-black text-toy-black placeholder:text-toy-brown/30 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                  style={{ opacity: user && user.name !== 'Guest User' ? 0.7 : 1 }}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-toy-brown mb-1 uppercase tracking-widest text-[10px]">{lang === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆ' : 'Your Feedback'}</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...' : 'Write your feedback here...'}
                  required
                  rows={4}
                  className="w-full p-3 rounded-xl border-4 border-toy-black/10 focus:border-toy-black focus:outline-none bg-toy-wood-bg/30 font-black text-toy-black placeholder:text-toy-brown/30 transition-all resize-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={rating === 0 || feedback.trim() === '' || isSubmitting}
              className={`flex items-center gap-2 py-3 px-8 text-white font-black text-lg rounded-2xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all ${
                rating === 0 || feedback.trim() === '' || isSubmitting
                  ? 'bg-toy-brown/20 cursor-not-allowed opacity-70 border-toy-black/20'
                  : 'bg-toy-orange hover:bg-toy-red active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
              }`}
            >
              <Send size={20} />
              {isSubmitting ? 'Submitting...' : (lang === 'kn' ? 'ಸಲ್ಲಿಸಿ' : 'Submit Feedback')}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-10"
          >
            <div className="w-20 h-20 bg-toy-green/10 rounded-full flex items-center justify-center mb-4 border-4 border-toy-green shadow-[4px_4px_0px_0px_rgba(34,197,94,0.1)]">
              <CheckCircle2 size={40} className="text-toy-green" />
            </div>
            <h2 className="text-2xl font-black text-toy-black mb-2">
              {lang === 'kn' ? 'ಧನ್ಯವಾದಗಳು!' : 'Thank You!'}
            </h2>
            <p className="text-toy-brown font-black text-center italic">
              {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ.' : 'Your feedback has been submitted successfully.'}
            </p>
            <button 
              onClick={() => {
                setIsSubmitted(false);
                setRating(0);
                setFeedback('');
              }}
              className="mt-8 text-toy-orange font-black hover:text-toy-red underline"
            >
              {lang === 'kn' ? 'ಮತ್ತೊಂದು ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ' : 'Submit another response'}
            </button>
          </motion.div>
        )}
      </div>
      
      <div className="mt-8 bg-toy-yellow/10 rounded-[2rem] p-6 border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative z-10 flex flex-col items-center">
         <h2 className="text-xl font-black text-toy-black mb-4 uppercase tracking-widest">{lang === 'kn' ? 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ' : 'Contact Us'}</h2>
         <p className="font-black text-toy-brown mb-2 text-sm">Email: <span className="text-toy-black">info@channapatnatoys.com</span></p>
         <p className="font-black text-toy-brown text-sm">Phone/WhatsApp: <span className="text-toy-black">+91 80000 00000</span></p>
      </div>
      
    </div>
  );
}
