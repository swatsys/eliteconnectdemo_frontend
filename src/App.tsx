import { useState, useEffect, useRef } from 'react';
import { 
  Heart, X, MessageCircle, Home, Wallet, User, 
  Search, ChevronLeft, Send, CheckCircle, Shield, Star, Rocket, Globe, Clock, Lock, AlertCircle, Download, Crown, Zap
} from 'lucide-react';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';

// --- CONFIGURATION ---
// CRITICAL: Always use the Render URL for production deployment
const API_URL = 'https://eliteconnectdemo-backend.onrender.com/api';

// !!! IMPORTANT: REPLACE THIS WITH YOUR REAL APP ID FROM developer.worldcoin.org !!!
const WORLD_ID_APP_ID = 'app_486e187afe7bc69a19456a3fa901a162'; // <--- CHANGE THIS TO YOUR REAL APP ID
const WORLD_ID_ACTION = 'signn';

// --- TYPES ---
enum ViewState {
  SPLASH = 'SPLASH',
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  MATCHES = 'MATCHES',
  CHAT = 'CHAT',
  WALLET = 'WALLET',
  PROFILE = 'PROFILE'
}

// --- COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, fullWidth = false, icon }: any) => {
  const baseStyle = "py-4 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900",
    premium: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30"
  };
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
};

const BottomNav = ({ currentView, setView }: { currentView: ViewState, setView: (v: ViewState) => void }) => {
  const navItems = [
    { id: ViewState.HOME, icon: Home, label: 'Home' },
    { id: ViewState.EXPLORE, icon: Search, label: 'Explore' },
    { id: ViewState.WALLET, icon: Wallet, label: 'Wallet' },
    { id: ViewState.MATCHES, icon: MessageCircle, label: 'Chat' },
    { id: ViewState.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center pb-8 z-50">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button 
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-purple-600' : 'text-slate-400'}`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} className={isActive ? "text-purple-600" : ""} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- VIEWS ---

const SplashView = ({ onStart }: { onStart: () => void }) => (
  <div className="h-full flex flex-col items-center justify-center p-8 bg-white text-center">
    <div className="flex-1 flex flex-col items-center justify-center w-full">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-glow">
        <Heart className="text-white w-12 h-12 fill-white" />
      </div>
      <h1 className="text-3xl font-bold text-purple-900 mb-2">
        Elite Connect
      </h1>
      <p className="text-slate-500 text-sm">Verified connections, genuine hearts</p>
    </div>
    <div className="w-full mb-8 space-y-4">
      <Button fullWidth onClick={onStart} icon={<Rocket size={18} />}>
        Continue
      </Button>
      <p className="text-xs text-slate-400">World ID verification for genuine connections</p>
    </div>
  </div>
);

const OnboardingView = ({ onSubmit }: any) => {
  const [data, setData] = useState({ name: '', age: '', gender: '', bio: '' });
  return (
    <div className="h-full bg-white flex flex-col p-6 overflow-y-auto">
      <div className="mt-8 mb-8 text-center">
        <div className="text-yellow-400 flex justify-center mb-4"><Star fill="currentColor" size={32} /></div>
        <h2 className="text-2xl font-bold text-slate-900">Complete Your Profile</h2>
        <p className="text-slate-500 text-sm mt-1">Let others know who you are</p>
      </div>
      <div className="space-y-4 flex-1">
        <div><label className="block text-sm font-bold text-slate-700 mb-1">Name *</label><input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500" value={data.name} onChange={e => setData({...data, name: e.target.value})} /></div>
        <div><label className="block text-sm font-bold text-slate-700 mb-1">Age *</label><input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500" type="number" value={data.age} onChange={e => setData({...data, age: e.target.value})} /></div>
        <div><label className="block text-sm font-bold text-slate-700 mb-1">Gender *</label><select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-500" value={data.gender} onChange={e => setData({...data, gender: e.target.value})}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
        <div><label className="block text-sm font-bold text-slate-700 mb-1">Bio</label><textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 h-24 resize-none focus:outline-none focus:border-purple-500" value={data.bio} onChange={(e) => setData({...data, bio: e.target.value})} /></div>
      </div>
      <Button onClick={() => onSubmit(data)} disabled={!data.name} className="mt-6">Complete Profile</Button>
    </div>
  );
};

const HomeView = ({ user, setView }: any) => (
  <div className="h-full bg-slate-50 flex flex-col p-6 pt-12">
    <div className="mb-8 text-center bg-white p-6 rounded-3xl shadow-soft">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg shadow-purple-500/20"><Heart fill="currentColor" size={28} /></div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back, {user?.name || 'User'}!</h1>
        <p className="text-slate-500 text-sm mt-1">Ready to find your match?</p>
    </div>
    <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setView(ViewState.EXPLORE)} className="bg-white p-6 rounded-3xl shadow-soft flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-transform h-48"><div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center"><Search size={32} className="text-slate-900" /></div><span className="font-bold text-slate-900">Discover</span></button>
        <button onClick={() => setView(ViewState.MATCHES)} className="bg-white p-6 rounded-3xl shadow-soft flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-transform h-48"><div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center"><MessageCircle size={32} className="text-slate-900" /></div><span className="font-bold text-slate-900">Messages</span></button>
    </div>
  </div>
);

const WalletView = ({ user, onUpgrade }: any) => {
    // 2 Free unlocks logic
    const FREE_LIMIT = 2;
    const used = user?.freeUnlocksUsed || 0;
    const remaining = Math.max(0, FREE_LIMIT - used);
    
    // Subscription Logic
    const isPremium = user?.subscription?.active;
    const expiryDate = user?.subscription?.expiresAt ? new Date(user.subscription.expiresAt).toLocaleDateString() : '';

    const generatePDF = () => {
        const w = window as any;
        if (w.jspdf) {
            const { jsPDF } = w.jspdf;
            const doc = new jsPDF();
            
            // Design: Dark Luxury Card
            doc.setFillColor(20, 20, 24); // Dark slate
            doc.rect(10, 10, 190, 100, 'F');
            
            // Border
            const color = isPremium ? [251, 191, 36] : [168, 85, 247]; // Gold if premium, Purple if free
            doc.setDrawColor(color[0], color[1], color[2]);
            doc.setLineWidth(2);
            doc.rect(15, 15, 180, 90);

            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text(isPremium ? "ELITE PREMIUM" : "ELITE CONNECT", 105, 40, { align: "center" });
            
            doc.setFontSize(14);
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text("OFFICIAL MEMBERSHIP CARD", 105, 50, { align: "center" });

            // User Info
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.text(`Name: ${user?.name || 'Unknown'}`, 30, 70);
            doc.text(`ID: ${user?.worldId?.substring(0, 10)}...`, 30, 85);
            doc.text(`Plan: ${isPremium ? 'UNLIMITED' : 'STANDARD'}`, 30, 100);

            // Save
            doc.save("Elite_Membership_Card.pdf");
        } else {
            alert("PDF Generator loading...");
        }
    };

    return (
    <div className="h-full bg-slate-50 p-6 pt-10 flex flex-col">
        <div className="flex items-center gap-2 mb-6"><h1 className="text-2xl font-bold text-slate-900">Wallet & Plans</h1></div>
        
        {/* Balance Card */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 mb-6 flex justify-between items-center">
            <div>
                <p className="text-slate-400 text-sm font-medium">Available Balance</p>
                <h2 className="text-3xl font-bold">{user?.balance || 0} WLD</h2>
            </div>
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <Globe className="text-white" size={24} />
            </div>
        </div>

        {/* Current Plan Status */}
        <div className="bg-white rounded-3xl p-6 shadow-soft mb-6 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                {isPremium ? <Crown className="text-amber-400 fill-amber-400" size={20} /> : <User size={20} />}
                Current Plan: {isPremium ? 'Premium Elite' : 'Standard'}
            </h3>
            
            {isPremium ? (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-amber-800 font-bold text-sm">Status: Active</p>
                    <p className="text-amber-600 text-xs mt-1">Expires: {expiryDate}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-amber-700">
                        <CheckCircle size={16} /> Unlimited Chats
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                     <div className="flex justify-between items-end mb-2">
                        <p className="text-slate-700 font-bold text-sm">Free Connections</p>
                        <p className="text-purple-600 font-bold text-lg">{remaining} <span className="text-slate-400 text-xs font-normal">/ {FREE_LIMIT}</span></p>
                     </div>
                     <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                         <div className="h-full bg-purple-500" style={{ width: `${(remaining/FREE_LIMIT)*100}%` }}></div>
                     </div>
                     <p className="text-xs text-slate-400 mt-2">After limit: 5 WLD per chat</p>
                </div>
            )}
        </div>

        {/* Upgrade Offer (Only if not premium) */}
        {!isPremium && (
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white shadow-xl shadow-purple-900/20 mb-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={80} /></div>
                 <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-1">Upgrade to Elite</h3>
                     <p className="text-purple-200 text-sm mb-4">Get unlimited connections for 30 days.</p>
                     <div className="flex items-end gap-2 mb-4">
                         <span className="text-3xl font-bold">3 WLD</span>
                         <span className="text-purple-300 text-sm mb-1">/ month</span>
                     </div>
                     <Button variant="premium" fullWidth onClick={onUpgrade} icon={<Crown size={18} />}>Upgrade Now</Button>
                 </div>
            </div>
        )}

        <div className="flex-1"></div>
        <Button fullWidth onClick={generatePDF} icon={<Download size={18} />} variant="secondary">Download Member Card</Button>
    </div>
    );
};

const MatchesView = ({ matches, onSelect, setView }: any) => (
  <div className="h-full bg-white flex flex-col p-6 pt-10">
    <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-slate-900">Matches</h1></div>
    {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4"><MessageCircle size={40} className="text-slate-300" /></div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Matches Yet</h2>
            <p className="text-slate-500 text-sm max-w-[200px] mb-8">Start swiping to find matches!</p>
            <Button onClick={() => setView(ViewState.EXPLORE)} className="w-48" icon={<Search size={18} />}>Go to Explore</Button>
        </div>
    ) : (
        <div className="space-y-2">
            {matches.map((m: any) => (
                <div key={m.matchId} onClick={() => onSelect(m)} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50">
                     <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${m.avatarColor || 'from-purple-500 to-pink-500'} flex items-center justify-center text-white font-bold`}>{m.name[0]}</div>
                     <div className="flex-1">
                         <div className="flex justify-between"><h3 className="font-bold text-slate-900">{m.name}</h3>{!m.unlocked && <Lock size={14} className="text-slate-400" />}</div>
                         <p className="text-sm text-slate-500 truncate">{m.unlocked ? "Tap to chat" : <span className="text-purple-600 font-bold">Unlock</span>}</p>
                     </div>
                </div>
            ))}
        </div>
    )}
  </div>
);

const ChatScreen = ({ match, messages, onSend, onBack }: any) => {
    const [text, setText] = useState('');
    const endRef = useRef<any>(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    return (
        <div className="h-full flex flex-col bg-slate-50 z-50">
            <div className="p-4 bg-white shadow-sm flex items-center gap-3 pt-6 pb-4">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft className="text-slate-900" /></button>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${match.avatarColor || 'from-purple-500 to-pink-500'} flex items-center justify-center text-white font-bold`}>{match.name[0]}</div>
                <div><h3 className="font-bold text-slate-900 text-sm">{match.name}</h3><div className="flex items-center gap-1 text-xs text-purple-600 font-medium"><Clock size={10} /> 10:00</div></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-center text-xs text-slate-400 my-4">Session Started - Verified Connection</div>
                {messages.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.isMine ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'}`}>{msg.text}</div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-slate-900 outline-none focus:border-purple-500 transition-colors" placeholder="Type a message..." value={text} onChange={e => setText(e.target.value)} onKeyPress={e => e.key === 'Enter' && (onSend(text), setText(''))}/>
                <button onClick={() => { onSend(text); setText(''); }} className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 shadow-lg shadow-purple-200"><Send size={20} /></button>
            </div>
        </div>
    )
}

const ExploreView = ({ profile, onLike, onPass, setView }: any) => {
    if (!profile) return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm"><CheckCircle size={40} className="text-green-500" /></div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h2>
            <Button variant="secondary" onClick={() => setView(ViewState.HOME)}>Back Home</Button>
        </div>
    );
    return (
        <div className="h-full bg-slate-50 p-4 pt-8 flex flex-col">
            <div className="flex-1 relative mb-6">
                <div className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
                    <div className={`h-3/5 w-full bg-gradient-to-br ${profile.avatarColor || 'from-purple-500 to-indigo-500'} flex items-center justify-center`}><span className="text-8xl text-white/30 font-bold">{profile.name?.[0]}</span></div>
                    <div className="flex-1 p-6 flex flex-col justify-center text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{profile.name}, {profile.age}</h2>
                        <p className="text-purple-600 font-medium text-sm mb-4">{profile.gender}</p>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{profile.bio}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-6 mb-20 px-8">
                <button onClick={onPass} className="w-16 h-16 rounded-full bg-white shadow-lg text-slate-400 flex items-center justify-center hover:text-red-500 hover:scale-110 transition-all"><X size={32} /></button>
                <button onClick={onLike} className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 text-white flex items-center justify-center hover:scale-110 transition-all"><Heart fill="currentColor" size={32} /></button>
            </div>
        </div>
    );
};

const ProfileView = ({ user, onLogout }: any) => (
    <div className="h-full bg-slate-50 p-6 pt-12 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-xl shadow-purple-500/20">{user?.name?.[0]}</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{user?.name}, {user?.age}</h2>
        <p className="text-slate-500 mb-8">{user?.gender}</p>
        <div className="w-full space-y-3">
             <Button fullWidth variant="primary" icon={<Star size={18} fill="currentColor" className="text-yellow-200" />}>View My Ratings</Button>
             <Button fullWidth variant="secondary" className="text-red-500 border-red-100 hover:bg-red-50" onClick={onLogout}>Logout</Button>
        </div>
    </div>
);

// --- APP CONTROLLER ---

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.SPLASH);
  const [token, setToken] = useState<string | null>(localStorage.getItem('elite_token'));
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [exploreProfile, setExploreProfile] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => { 
      if (token) fetchUserData(); 
      if (WORLD_ID_APP_ID.includes('12345') && view === ViewState.AUTH) {
          setError("Configuration Error: Please update WORLD_ID_APP_ID in App.tsx");
      }
  }, [token, view]);
  
  useEffect(() => {
    if (view === ViewState.EXPLORE) fetchExploreProfile();
    if (view === ViewState.MATCHES) fetchMatches();
    if (view === ViewState.WALLET) fetchUserData(); 
  }, [view]);

  useEffect(() => {
      let interval: any;
      if (view === ViewState.CHAT && activeChat) {
          fetchMessages(activeChat.matchId);
          interval = setInterval(() => fetchMessages(activeChat.matchId), 2000);
      }
      return () => clearInterval(interval);
  }, [view, activeChat]);

  // --- API ---
  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/me`, { headers: { 'Authorization': token || '' } });
      
      // Handle unauthorized (401) gracefully
      if (res.status === 401) {
          localStorage.removeItem('elite_token');
          setToken(null);
          setView(ViewState.AUTH);
          return;
      }

      if(!res.ok) throw new Error("Connection failed");
      const data = await res.json();
      if (data.success) { setUser(data.user); setView(ViewState.HOME); } else { setView(ViewState.ONBOARDING); }
    } catch { 
        setError("Cannot connect to server. Ensure backend is running.");
        setView(ViewState.AUTH); 
    }
  };
  const fetchExploreProfile = async () => {
    try { const res = await fetch(`${API_URL}/explore`, { headers: { 'Authorization': token || '' } }); const data = await res.json(); setExploreProfile(data.success ? data.profile : null); } catch (e) { console.error(e); }
  };
  const fetchMatches = async () => {
    try { const res = await fetch(`${API_URL}/matches`, { headers: { 'Authorization': token || '' } }); const data = await res.json(); if(data.success) setMatches(data.matches); } catch(e) { console.error(e); }
  };
  const fetchMessages = async (matchId: string) => {
      try { const res = await fetch(`${API_URL}/chat/${matchId}`, { headers: { 'Authorization': token || '' } }); const data = await res.json(); if(data.success) setActiveMessages(data.messages); } catch(e) { console.error(e); }
  };

  // GENERIC LOGIN FUNCTION (Used by Mock & World ID)
  const loginUser = async (proof: any) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ proof }) });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || `Server error: ${res.status}`);
        
        if (data.success) { 
            localStorage.setItem('elite_token', data.token); 
            setToken(data.token); 
            setError(''); 
        }
    } catch (e: any) {
        console.error("Login failed:", e);
        throw e; // Re-throw to be handled by caller
    }
  };
  
  // MOCK LOGIN HANDLER
  const handleMockLogin = async () => {
      try {
          await loginUser('mock');
      } catch (e: any) {
          alert(`Login failed: ${e.message}`);
          setError("Login Error: " + e.message); 
      }
  };

  // WORLD ID HANDLERS
  // 1. handleVerify: Called by IDKit *during* verification. We must return a Promise.
  //    If this rejects, IDKit shows an error. If resolves, IDKit shows success.
  const handleVerify = async (result: any) => {
      console.log("Verifying proof with backend...", result);
      // We return the promise from loginUser directly
      await loginUser(result);
  };

  // 2. onSuccess: Called after handleVerify resolves and modal closes.
  const onSuccess = () => {
      console.log("Verification successful & Login complete.");
      // Token is already set by loginUser, so view will update automatically via useEffect
  };

  const handleProfileSubmit = async (p: any) => {
    await fetch(`${API_URL}/auth/onboard`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': token || '' }, body: JSON.stringify(p) }); fetchUserData();
  };
  const handleLike = async () => {
    if(!exploreProfile) return;
    await fetch(`${API_URL}/explore/like`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': token || '' }, body: JSON.stringify({ targetId: exploreProfile.worldId }) }); fetchExploreProfile();
  };
  const handleUnlock = async (matchId: string) => {
      const msg = user?.subscription?.active ? "Unlock Chat? (Premium Active)" : "Unlock 10min Chat? (Costs Free Unlock or 5 WLD)";
      if(!confirm(msg)) return;
      
      try {
          const res = await fetch(`${API_URL}/matches/unlock`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': token || '' }, body: JSON.stringify({ matchId }) });
          const data = await res.json();
          if(data.success) { 
              alert(data.message);
              fetchMatches(); 
              fetchUserData(); 
          } else { alert(data.error); }
      } catch(e) { console.error(e); }
  };
  const handleSendMessage = async (text: string) => {
      if(!activeChat || !text.trim()) return;
      await fetch(`${API_URL}/chat/send`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': token || '' }, body: JSON.stringify({ matchId: activeChat.matchId, text }) });
      fetchMessages(activeChat.matchId);
  }

  const handleUpgrade = async () => {
      if(!confirm("Upgrade to Premium for 3 WLD?")) return;
      try {
          const res = await fetch(`${API_URL}/subscription/upgrade`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': token || '' } });
          const data = await res.json();
          if(data.success) { 
              alert("Successfully Upgraded!");
              fetchUserData(); 
          } else { alert(data.error); }
      } catch (e) { console.error(e); }
  };

  // --- ROUTER ---
  return (
    <div className="h-full w-full bg-white relative">
        <div className="h-full overflow-hidden flex flex-col">
            {view === ViewState.SPLASH && <SplashView onStart={() => setView(token ? ViewState.HOME : ViewState.AUTH)} />}
            {view === ViewState.AUTH && (
                 <div className="h-full flex flex-col items-center justify-center p-8 bg-white">
                    <h2 className="text-2xl font-bold mb-8">Verify to Continue</h2>
                    
                    {/* VISIBLE ERROR BOX for Mobile Debugging */}
                    {error && (
                        <div className="w-full mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-bold"><AlertCircle size={16} /> Login Error</div>
                            <p>{error}</p>
                            <div className="text-xs text-red-400 mt-1 pt-2 border-t border-red-100">
                                Check backend logs or try again in a few seconds (Cold Start).
                            </div>
                        </div>
                    )}
                    
                    <div className="text-xs text-center text-slate-400 mb-4 p-2 bg-slate-50 rounded">
                        Debug: Backend is {API_URL} <br/>
                        If stuck, Backend is likely down.
                    </div>

                    <Button fullWidth onClick={() => handleMockLogin()} className="mb-4">Mock Login (Dev Only)</Button>
                    
                    <div className="w-full">
                        <IDKitWidget 
                            app_id={WORLD_ID_APP_ID} 
                            action={WORLD_ID_ACTION} 
                            onSuccess={onSuccess} 
                            handleVerify={handleVerify}
                            verification_level={VerificationLevel.Device}
                        >
                            {({ open }: any) => (
                                <Button fullWidth variant="secondary" onClick={open} icon={<Globe size={18} />}>
                                    Verify with World ID
                                </Button>
                            )}
                        </IDKitWidget>
                    </div>
                 </div>
            )}
            {view === ViewState.ONBOARDING && <OnboardingView onSubmit={handleProfileSubmit} />}
            
            {(view === ViewState.HOME || view === ViewState.EXPLORE || view === ViewState.MATCHES || view === ViewState.WALLET || view === ViewState.PROFILE) && (
                <>
                    <div className="flex-1 overflow-hidden relative">
                        {view === ViewState.HOME && <HomeView user={user} setView={setView} />}
                        {view === ViewState.EXPLORE && <ExploreView profile={exploreProfile} onLike={handleLike} onPass={() => fetchExploreProfile()} setView={setView} />}
                        {view === ViewState.MATCHES && <MatchesView matches={matches} onSelect={(m: any) => { if(m.unlocked) { setActiveChat(m); setView(ViewState.CHAT); } else { handleUnlock(m.matchId); } }} setView={setView} />}
                        {view === ViewState.WALLET && <WalletView user={user} onUpgrade={handleUpgrade} />}
                        {view === ViewState.PROFILE && <ProfileView user={user} onLogout={() => { localStorage.removeItem('elite_token'); setToken(null); setUser(null); setView(ViewState.SPLASH); }} />}
                    </div>
                    <BottomNav currentView={view} setView={setView} />
                </>
            )}
            
            {view === ViewState.CHAT && activeChat && (
                <ChatScreen match={activeChat} messages={activeMessages} onSend={handleSendMessage} onBack={() => setView(ViewState.MATCHES)} />
            )}
        </div>
    </div>
  );
}