import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SplashScreen as CapSplash } from '@capacitor/splash-screen';
import { QrCode, BookOpen, Map, Store, Globe, Package, MessageSquare, Wallet, ShieldCheck } from 'lucide-react';
import { translations, Language } from './translations';
import VerifyView from './components/VerifyView';
import ProcessView from './components/ProcessView';
import MapView from './components/MapView';
import CatalogView from './components/CatalogView';
import StoreLocatorView from './components/StoreLocatorView';
import LoginView from './components/LoginView';
import OrderTrackingView from './components/OrderTrackingView';
import FeedbackView from './components/FeedbackView';
import TransactionView from './components/TransactionView';
import SplashScreen from './components/SplashScreen';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  updateDoc,
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'verify' | 'process' | 'map' | 'catalog' | 'store-locator' | 'orders' | 'feedback' | 'transactions'>('verify');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [favoriteArtisans, setFavoriteArtisans] = useState<string[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Validate connection on boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch or create user profile
        const userRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userRef);
          
          let profileData;
          if (!userSnap.exists()) {
            profileData = {
              userId: user.uid,
              name: user.displayName || 'User',
              email: user.email || '',
              photo: user.photoURL || '',
              role: 'user',
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, profileData);
          } else {
            profileData = userSnap.data();
          }
          
          setCurrentUser({ ...profileData, id: user.uid }); // Ensure id is set for consistent usage
          setIsAuthenticated(true);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestore Sync: Orders
  useEffect(() => {
    const userId = currentUser?.id || currentUser?.userId;
    if (!isAuthenticated || !userId) return;

    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));

    return () => unsubscribe();
  }, [isAuthenticated, currentUser]);

  // Firestore Sync: Wishlist
  useEffect(() => {
    const userId = currentUser?.id || currentUser?.userId;
    if (!isAuthenticated || !userId) return;

    const path = `users/${userId}/wishlist`;
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const wishlistIds = snapshot.docs.map(doc => doc.id);
      setWishlist(wishlistIds);
    }, (error) => handleFirestoreError(error, OperationType.LIST, path));

    return () => unsubscribe();
  }, [isAuthenticated, currentUser]);

  // Firestore Sync: Favorites
  useEffect(() => {
    const userId = currentUser?.id || currentUser?.userId;
    if (!isAuthenticated || !userId) return;

    const path = `users/${userId}/favorites`;
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const favoriteIds = snapshot.docs.map(doc => doc.id);
      setFavoriteArtisans(favoriteIds);
    }, (error) => handleFirestoreError(error, OperationType.LIST, path));

    return () => unsubscribe();
  }, [isAuthenticated, currentUser]);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTab('verify');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Handle splash screen timeout
  useEffect(() => {
    // Hide native splash immediately since we have our custom one
    CapSplash.hide();

    if (showSplash) {
      const splashTimer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(splashTimer);
    }
  }, [showSplash]);

  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.status === 'placed') return { ...order, status: 'processing' };
          if (order.status === 'processing') return { ...order, status: 'shipped' };
          if (order.status === 'shipped') return { ...order, status: 'delivered' };
          return order;
        })
      );
    }, 10000); // Progress every 10 seconds for demo

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handlePurchase = async (orderItem: any) => {
    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const userId = currentUser.id || currentUser.userId;
    
    // Sanitize item data for Firestore
    const sanitizedItem = {
      en_name: orderItem.en_name || '',
      kn_name: orderItem.kn_name || '',
      img: orderItem.img || '',
      price: orderItem.price || '₹0',
      stock: orderItem.stock || 0
    };

    const newOrder = {
      orderId: orderId,
      userId: userId,
      item: sanitizedItem,
      status: 'placed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      trackingNumber: 'IN8473' + Math.floor(Math.random() * 10000),
      carrier: 'India Post',
      expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
    }
  };

  const handleCancelOrder = async (id: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { 
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const toggleWishlist = async (itemId: string) => {
    const userId = currentUser.id || currentUser.userId;
    const path = `users/${userId}/wishlist/${itemId}`;
    try {
      if (wishlist.includes(itemId)) {
        await deleteDoc(doc(db, path));
      } else {
        await setDoc(doc(db, path), { itemId, addedAt: serverTimestamp() });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const toggleFavoriteArtisan = async (artisanId: string) => {
    const userId = currentUser.id || currentUser.userId;
    const path = `users/${userId}/favorites/${artisanId}`;
    try {
      if (favoriteArtisans.includes(artisanId)) {
        await deleteDoc(doc(db, path));
      } else {
        await setDoc(doc(db, path), { artisanId, addedAt: serverTimestamp() });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };
  
  const t = translations[lang];

  return (
    <div className="h-screen app-container bg-toy-wood-bg flex flex-col relative overflow-hidden">
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && <SplashScreen t={t} />}
      </AnimatePresence>

      {/* Top Header / Status Bar Area */}
      <div className="bg-toy-black text-white px-5 pt-8 pb-5 flex justify-between items-center z-50 rounded-b-[2rem] sticky top-0 w-full shadow-xl border-b-4 border-toy-orange overflow-hidden shrink-0">
        {/* Subtle Background Pattern for Header */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px:10px] pointer-events-none"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-toy-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=200" 
              alt="Channapatna Toy Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col -gap-1">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-toy-yellow leading-none mb-1">
                {t.appTitle.split(' – ')[0]}
              </span>
              <span className="text-[18px] font-black tracking-tighter uppercase leading-none text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                {t.appTitle.split(' – ')[1]}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1 relative z-10">
          <button 
            onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
            className="flex items-center gap-1.5 bg-toy-orange px-3 py-1.5 rounded-xl text-[10px] font-black hover:bg-toy-red transition-all border-2 border-toy-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-white active:translate-y-[1px] active:shadow-none"
          >
            <Globe size={12} className="text-white" /> {lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}
          </button>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 overflow-y-auto bg-toy-wood-bg flex flex-col relative px-1">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5d4037_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        {!isAuthenticated ? (
          <LoginView t={t} onLogin={handleLogin} />
        ) : (
          <>
            {activeTab === 'verify' && (
              <VerifyView 
                t={t} 
                lang={lang} 
                user={currentUser} 
                onNavigate={setActiveTab} 
                scannedCode={scannedCode} 
                onClearScan={() => setScannedCode(null)} 
              />
            )}
            {activeTab === 'process' && <ProcessView t={t} lang={lang} onNavigate={setActiveTab} />}
            {activeTab === 'map' && (
              <MapView 
                t={t} 
                lang={lang} 
                onNavigate={setActiveTab} 
                favoriteArtisans={favoriteArtisans} 
                setFavoriteArtisans={toggleFavoriteArtisan} 
              />
            )}
            {activeTab === 'catalog' && (
              <CatalogView 
                t={t} 
                lang={lang} 
                user={currentUser} 
                onNavigate={setActiveTab} 
                wishlist={wishlist} 
                setWishlist={toggleWishlist} 
                onPurchase={handlePurchase} 
                onRequireLogin={() => setIsAuthenticated(false)} 
              />
            )}
            {activeTab === 'store-locator' && <StoreLocatorView t={t} lang={lang} onNavigate={setActiveTab} />}
            {activeTab === 'orders' && <OrderTrackingView t={t} lang={lang} orders={orders} user={currentUser} onNavigate={setActiveTab} onReturnOrder={(id) => setOrders(prev => prev.map(o => o.id === id ? {...o, status: 'returned'} : o))} onCancelOrder={handleCancelOrder} />}
            {activeTab === 'feedback' && <FeedbackView t={t} lang={lang} user={currentUser} />}
            {activeTab === 'transactions' && <TransactionView t={t} lang={lang} orders={orders} user={currentUser} />}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t-4 border-toy-black z-50">
          <div className="flex items-center px-1 py-3 overflow-x-auto scrollbar-hide gap-1 snap-x max-w-lg mx-auto">
            <div className="snap-start min-w-[60px] flex-shrink-0 flex justify-center">
              <NavItem 
                icon={<QrCode size={22} />} 
                label={t.verifyTab} 
                isActive={activeTab === 'verify'} 
                onClick={() => setActiveTab('verify')} 
              />
            </div>
            <div className="snap-start min-w-[60px] flex-shrink-0 flex justify-center">
              <NavItem 
                icon={<BookOpen size={22} />} 
                label={t.processTab} 
                isActive={activeTab === 'process'} 
                onClick={() => setActiveTab('process')} 
              />
            </div>
            <div className="snap-start min-w-[60px] flex-shrink-0 flex justify-center">
              <NavItem 
                icon={<Map size={22} />} 
                label={t.mapTab} 
                isActive={activeTab === 'map'} 
                onClick={() => setActiveTab('map')} 
              />
            </div>
            <div className="snap-start min-w-[60px] flex-shrink-0 flex justify-center">
              <NavItem 
                icon={<Store size={22} />} 
                label={t.catalogTab} 
                isActive={activeTab === 'catalog'} 
                onClick={() => setActiveTab('catalog')} 
              />
            </div>
            <div className="snap-start min-w-[60px] flex-shrink-0 flex justify-center">
              <NavItem 
                icon={<Package size={22} />} 
                label={t.ordersTab} 
                isActive={activeTab === 'orders'} 
                onClick={() => setActiveTab('orders')} 
              />
            </div>
            <div className="snap-start min-w-[60px] flex-shrink-0 flex justify-center">
              <NavItem 
                icon={<MessageSquare size={22} />} 
                label={t.feedbackTab} 
                isActive={activeTab === 'feedback'} 
                onClick={() => setActiveTab('feedback')} 
              />
            </div>
            <div className="snap-start min-w-[60px] flex-shrink-0 flex justify-center pr-2">
              <NavItem 
                icon={<Wallet size={22} />} 
                label={t.transactionsTab} 
                isActive={activeTab === 'transactions'} 
                onClick={() => setActiveTab('transactions')} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 flex-1 transition-transform ${isActive ? 'scale-110 text-toy-brown' : 'text-gray-400 hover:text-gray-600'}`}
    >
      <div className={`p-1.5 rounded-2xl ${isActive ? 'bg-toy-yellow border-2 border-toy-orange' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className={`text-[9px] text-center font-black leading-tight ${isActive ? 'text-toy-brown' : ''}`}>{label}</span>
    </button>
  );
}
