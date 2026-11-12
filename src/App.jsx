import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Lock, Sparkles, Music, VolumeX, Calendar, Briefcase, Navigation,
  CheckCircle2, Circle, Plus, MapPin, CloudFog, RefreshCw, Trash2,
  ExternalLink, Info, ChevronDown, Sun, Moon
} from 'lucide-react';

const INITIAL_DATA = {
  activePlan: 'A',
  flow: {
    sabtu: [
      { id: 'f1', time: '07:30 AM', title: 'Gerak & Sarapan Berat', desc: 'Isi perut siap-siap dekat bawah sebelum naik bukit', done: false },
      { id: 'f2', time: '09:15 AM', title: 'Parkir Kereta & Naik Puncak', desc: 'Parkir dekat Awana SkyCentral (naik cable car) atau SkyAvenue', done: false },
      { id: 'f3', time: '10:00 AM', title: 'Genting SkyWorlds Adventure', desc: 'Masuk ikut SkyAvenue Gateway (Aras G), link QR untuk VQ & main semua ride!', done: false },
      { id: 'f4', time: '06:00 PM', title: 'Dinner Date @ SkyAvenue', desc: 'Makan malam sedap lepas penat pusing taman tema', done: false },
      { id: 'f5', time: '07:30 PM', title: 'Beli Bekalan Malam (7E / FamilyMart)', desc: 'Air mineral besar, jajan dan kopi panas untuk bilik', done: false },
      { id: 'f6', time: '08:15 PM', title: 'Check-In Highland Breeze (Level 7)', desc: 'Parkir Level 4 Ion Delemen, naik Level 7 bawa cash RM200', done: false },
      { id: 'f7', time: '09:00 PM', title: 'Rehat & Quality Time Berdua', desc: 'Mandi air panas dan layan kabus sejuk 15°C dekat balkoni', done: false }
    ],
    ahad: [
      { id: 'f8', time: '09:00 AM', title: 'Bangun Pagi & Layan Kabus', desc: 'Minum kopi panas dekat balkoni menghadap gunung', done: false },
      { id: 'f9', time: '11:30 AM', title: 'Check-Out & Validate Kad TnG', desc: 'Pulangkan kunci dekat Level 7, ambil RM200 dan validate parkir!', done: false },
      { id: 'f10', time: '12:30 PM', title: 'Lunch @ Genting Permai / Gohtong', desc: 'Singgah makan tengah hari sedap dekat pertengahan bukit', done: false },
      { id: 'f11', time: '02:00 PM', title: 'Shopping & Kopi @ GHPO', desc: 'Jalan santai cuci mata dekat Premium Outlets', done: false },
      { id: 'f12', time: '04:30 PM', title: 'Gerak Balik Dengan Selamat', desc: 'Tamat short getaway Jujuan Go Genting!', done: false }
    ]
  },
  flowB: {
    sabtu: [
      { id: 'fb1', time: '10:00 AM', title: 'Bertolak Santai Dari Rumah', desc: 'Tak payah kalut bangun awal pagi, gerak tenang naik bukit', done: false },
      { id: 'fb2', time: '11:30 AM', title: 'Lunch @ Gohtong & Jalan GHPO', desc: 'Makan tengah hari sedap dan cuci mata dekat Premium Outlets dulu', done: false },
      { id: 'fb3', time: '02:00 PM', title: 'Naik Puncak & Beli Bekalan (7E)', desc: 'Beli siap-siap air mineral, kopi panas dan kudapan malam', done: false },
      { id: 'fb4', time: '03:00 PM', title: 'Check-In Awal Highland Breeze (Level 7)', desc: 'Parkir Level 4 Ion Delemen, daftar masuk awal bawa tunai RM200', done: false },
      { id: 'fb5', time: '03:30 PM', title: 'Rehat Bilik & Quality Time Segar', desc: 'Lepak balkoni berkabus, mandi air panas dan rehat berdua tanpa penat', done: false },
      { id: 'fb6', time: '07:30 PM', title: 'Dinner Date @ SkyAvenue', desc: 'Turun makan malam romantik dekat mall lepas tu balik bilik', done: false },
      { id: 'fb7', time: '09:30 PM', title: 'Malam Santai Suhu 15°C', desc: 'Layan suasana sejuk gunung dan tidur awal kumpul tenaga untuk esok!', done: false }
    ],
    ahad: [
      { id: 'fb8', time: '08:00 AM', title: 'Bangun Pagi, Kopi & Kemas Beg', desc: 'Layan kabus pagi kejap dekat balkoni dan siap kemas semua barang', done: false },
      { id: 'fb9', time: '09:15 AM', title: 'Check-Out Awal & Validate TnG', desc: 'Pulangkan kunci dekat Level 7, ambil semula RM200 dan validate parkir!', done: false },
      { id: 'fb10', time: '09:40 AM', title: 'Parkir @ SkyAvenue (Simpan Beg)', desc: 'Pandu turun ke parkir SkyAvenue dan simpan beg baju dalam bonet', done: false },
      { id: 'fb11', time: '10:00 AM', title: 'All-Out Genting SkyWorlds!', desc: 'Masuk ikut SkyAvenue Gateway (Aras G), pautkan QR untuk VQ & main puas-puas!', done: false },
      { id: 'fb12', time: '05:30 PM', title: 'Makan Petang & Gerak Balik', desc: 'Isi perut dekat SkyAvenue sebelum pandu turun balik KL dengan gembira!', done: false }
    ]
  },
  prep: [
    { id: 'p1', cat: 'SkyWorlds', text: 'Baju hujan pakai buang (2 helai)', done: false },
    { id: 'p2', cat: 'SkyWorlds', text: 'Powerbank penuh & kabel caj', done: false },
    { id: 'p3', cat: 'SkyWorlds', text: 'Kasut sukan selesa & stokin', done: false },
    { id: 'p4', cat: 'SkyWorlds', text: 'Jaket nipis / windbreaker & plastik baju basah', done: false },
    { id: 'p5', cat: 'Dokumen & Duit', text: 'Wang tunai RM200 (Deposit Highland Breeze)', done: false },
    { id: 'p6', cat: 'Dokumen & Duit', text: 'Kad Touch n Go (Baki minimum RM30)', done: false },
    { id: 'p7', cat: 'Dokumen & Duit', text: 'Screenshot baucar HopeGoo & baucar MATTA SkyWorlds', done: false },
    { id: 'p8', cat: 'Bilik & Malam', text: 'Sweater / baju tidur tebal & stokin tidur', done: false },
    { id: 'p9', cat: 'Bilik & Malam', text: 'Berus gigi, pencuci muka & toiletries sendiri', done: false },
    { id: 'p10', cat: 'Bilik & Malam', text: 'Barang peribadi & keperluan keselamatan', done: false }
  ]
};

const LOCATIONS = [
  {
    name: 'Awana SkyCentral (Parkir & Cable Car)',
    note: 'Tempat parkir jimat pertengahan bukit untuk naik kereta kabel Awana SkyWay terus ke SkyAvenue.',
    waze: 'https://waze.com/ul?q=Awana%20SkyCentral%20Genting&navigate=yes',
    maps: 'https://www.google.com/maps/search/?api=1&query=Awana+SkyCentral+Genting+Highlands'
  },
  {
    name: 'Genting SkyWorlds & SkyAvenue',
    note: 'Guna pintu masuk SkyAvenue Gateway di Aras G. Buka 10:00 AM hingga 6:00 PM.',
    waze: 'https://waze.com/ul?q=Genting%20SkyWorlds%20Theme%20Park&navigate=yes',
    maps: 'https://www.google.com/maps/search/?api=1&query=Genting+SkyWorlds+Theme+Park'
  },
  {
    name: 'Grand Ion Delemen (Highland Breeze)',
    note: 'Masuk parkir sebelah MyNews naik ke Level 4. Kaunter Highland Breeze buka 24 jam dekat Level 7 (sediakan tunai RM200).',
    waze: 'https://waze.com/ul?q=Grand%20Ion%20Delemen%20Hotel&navigate=yes',
    maps: 'https://www.google.com/maps/search/?api=1&query=Grand+Ion+Delemen+Hotel+Genting'
  },
  {
    name: 'Genting Highlands Premium Outlets (GHPO)',
    note: 'Lokasi jalan santai, makan tengah hari atau minum petang dan cuci mata.',
    waze: 'https://waze.com/ul?q=Genting%20Highlands%20Premium%20Outlets&navigate=yes',
    maps: 'https://www.google.com/maps/search/?api=1&query=Genting+Highlands+Premium+Outlets'
  }
];

function normalizeState(raw) {
  if (!raw || typeof raw !== 'object') return INITIAL_DATA;
  return {
    activePlan: raw.activePlan === 'B' ? 'B' : 'A',
    flow: raw.flow && raw.flow.sabtu && raw.flow.ahad ? raw.flow : INITIAL_DATA.flow,
    flowB: raw.flowB && raw.flowB.sabtu && raw.flowB.ahad ? raw.flowB : INITIAL_DATA.flowB,
    prep: Array.isArray(raw.prep) ? raw.prep : INITIAL_DATA.prep
  };
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('jujuan_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgmMissing, setBgmMissing] = useState(false);
  const [mainTab, setMainTab] = useState('flow');
  const [dayTab, setDayTab] = useState('sabtu');
  const [stateData, setStateData] = useState(INITIAL_DATA);
  const [syncing, setSyncing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [countdown, setCountdown] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [openCats, setOpenCats] = useState({
    'SkyWorlds': false,
    'Dokumen & Duit': false,
    'Bilik & Malam': false,
    'Tambahan Kita': false
  });

  const audioRef = useRef(null);
  const lastSaveRef = useRef(0);

  const activePlan = stateData.activePlan === 'B' ? 'B' : 'A';
  const currentFlowKey = activePlan === 'B' ? 'flowB' : 'flow';
  const currentFlow = stateData[currentFlowKey] || INITIAL_DATA.flow;

  // Kemas kini warna status bar telefon mengikut tema gelap/cerah
  useEffect(() => {
    localStorage.setItem('jujuan_theme', isDark ? 'dark' : 'light');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDark ? '#020617' : '#f0f9ff');
    }
    document.body.style.backgroundColor = isDark ? '#020617' : '#f0f9ff';
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const toggleCategory = (cat) => {
    setOpenCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  useEffect(() => {
    const targetIso = activePlan === 'B'
      ? '2026-11-14T10:00:00+08:00'
      : '2026-11-14T07:30:00+08:00';
    const target = new Date(targetIso).getTime();

    const updateTimer = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      setCountdown({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff / 3600000) % 24)).padStart(2, '0'),
        m: String(Math.floor((diff / 60000) % 60)).padStart(2, '0'),
        s: String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [activePlan]);

  const fetchLatestState = useCallback(async (silent = false) => {
    if (silent && Date.now() - lastSaveRef.current < 3000) return;
    if (!silent) setSyncing(true);
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (res.ok) {
        const cloudData = await res.json();
        setIsLive(true);
        if (cloudData && cloudData.prep) {
          const clean = normalizeState(cloudData);
          setStateData(clean);
          localStorage.setItem('jujuan_genting', JSON.stringify(clean));
          if (!silent) setSyncing(false);
          return;
        }
      }
    } catch {
      setIsLive(false);
    }
    if (!silent) {
      const saved = localStorage.getItem('jujuan_genting');
      if (saved) setStateData(normalizeState(JSON.parse(saved)));
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestState(false);
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') fetchLatestState(true);
    }, 5000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchLatestState(true);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [fetchLatestState]);

  const saveState = async (updated) => {
    const clean = normalizeState(updated);
    lastSaveRef.current = Date.now();
    setStateData(clean);
    localStorage.setItem('jujuan_genting', JSON.stringify(clean));
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clean)
      });
      if (res.ok) setIsLive(true);
    } catch {
      setIsLive(false);
    }
  };

  const handleUnlock = () => {
    setUnlocked(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setBgmMissing(false);
      }).catch(() => setIsPlaying(false));
    }
    confetti({ particleCount: 55, spread: 65, origin: { y: 0.7 } });
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setBgmMissing(false);
      }).catch(() => setBgmMissing(true));
    }
  };

  const switchPlan = (plan) => {
    if (plan === activePlan) return;
    saveState({ ...stateData, activePlan: plan });
  };

  const toggleFlowItem = (day, id) => {
    const updatedDay = currentFlow[day].map((item) => {
      if (item.id === id) {
        if (!item.done) confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
        return { ...item, done: !item.done };
      }
      return item;
    });
    saveState({
      ...stateData,
      [currentFlowKey]: { ...currentFlow, [day]: updatedDay }
    });
  };

  const togglePrepItem = (id) => {
    const updatedPrep = stateData.prep.map((item) => {
      if (item.id === id) {
        if (!item.done) confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
        return { ...item, done: !item.done };
      }
      return item;
    });
    saveState({ ...stateData, prep: updatedPrep });
  };

  const addCustomPrep = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = {
      id: 'custom_' + Date.now(),
      cat: 'Tambahan Kita',
      text: newItemText.trim(),
      done: false
    };
    saveState({ ...stateData, prep: [...stateData.prep, newItem] });
    setNewItemText('');
    setOpenCats((prev) => ({ ...prev, 'Tambahan Kita': true }));
  };

  const deleteCustomPrep = (id) => {
    saveState({ ...stateData, prep: stateData.prep.filter((i) => i.id !== id) });
  };

  const allFlow = [...currentFlow.sabtu, ...currentFlow.ahad];
  const flowPercent = Math.round((allFlow.filter((i) => i.done).length / allFlow.length) * 100);
  const prepPercent = Math.round((stateData.prep.filter((i) => i.done).length / stateData.prep.length) * 100);

  // Kelas warna dinamik mengikut Dark Mode vs Light Mode (iOS Glassmorphism)
  const glassCard = isDark
    ? 'bg-white/10 border-white/20 shadow-xl'
    : 'bg-white/70 border-white/90 shadow-xl shadow-sky-900/5';
  const subGlass = isDark
    ? 'bg-white/10 border-white/15'
    : 'bg-white/65 border-slate-200/80 shadow-md shadow-sky-900/5';
  const textMuted = isDark ? 'text-white/70' : 'text-slate-600';
  const textSoft = isDark ? 'text-white/55' : 'text-slate-500';
  const accentText = isDark ? 'text-sky-300' : 'text-sky-600';

  return (
    <div
      className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-500 selection:bg-sky-400/30 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-sky-50 text-slate-900'
      }`}
    >
      {/* Latar Belakang Aurora Glassmorphism */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl animate-pulse transition-colors duration-500 ${
            isDark ? 'bg-sky-500/30' : 'bg-sky-300/55'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-24 w-96 h-96 rounded-full blur-3xl transition-colors duration-500 ${
            isDark ? 'bg-indigo-500/25' : 'bg-indigo-300/45'
          }`}
        />
        <div
          className={`absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl transition-colors duration-500 ${
            isDark ? 'bg-pink-500/20' : 'bg-pink-300/40'
          }`}
        />
      </div>

      <audio
        ref={audioRef}
        src="/bgm.m4a"
        loop
        preload="auto"
        onError={() => setBgmMissing(true)}
      />

      {/* Skrin Kunci iOS */}
      <AnimatePresence>
        {!unlocked && (
          <motion.div
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className={`fixed inset-0 z-50 flex flex-col justify-between items-center p-6 backdrop-blur-2xl transition-colors duration-500 ${
              isDark ? 'bg-slate-950/75 text-white' : 'bg-sky-50/80 text-slate-900'
            }`}
          >
            {/* Butang Tema Pada Skrin Kunci */}
            <div className="w-full max-w-sm flex justify-end pt-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Tukar tema"
                className={`p-2.5 rounded-full backdrop-blur-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-amber-300 hover:bg-white/20'
                    : 'bg-white/75 border-slate-200 text-indigo-600 shadow-sm hover:bg-white'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-center">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs mb-4 ${
                  isDark
                    ? 'bg-white/10 border-white/15 text-sky-200'
                    : 'bg-white/80 border-sky-200 text-sky-700 shadow-sm'
                }`}
              >
                <Lock className="w-3 h-3" /> Private Trip Pass
              </div>
              <h1
                className={`text-5xl font-bold tracking-tight bg-clip-text text-transparent ${
                  isDark
                    ? 'bg-linear-to-b from-white to-white/70'
                    : 'bg-linear-to-b from-slate-900 to-slate-600'
                }`}
              >
                14 - 15 Nov
              </h1>
              <p className={`text-sm mt-1 ${textMuted}`}>Sabtu & Ahad • Genting Highlands</p>
            </div>

            <div
              className={`w-full max-w-sm backdrop-blur-xl border rounded-3xl p-5 shadow-2xl ${
                isDark ? 'bg-white/12 border-white/20' : 'bg-white/80 border-white shadow-sky-900/10'
              }`}
            >
              <div className={`flex items-center justify-between text-xs mb-2 ${textSoft}`}>
                <span className={`font-semibold flex items-center gap-1.5 ${accentText}`}>
                  <CloudFog className="w-4 h-4" /> TRIP REMINDER
                </span>
                <span>Sekarang</span>
              </div>
              <h2 className="text-xl font-bold">Jujuan Go Genting 🎢🌫️</h2>
              <p className={`text-xs mt-1 leading-relaxed ${textMuted}`}>
                Kad tentatif fleksibel (Pelan A & Pelan B), lokasi Waze dan senarai barang kita dah siap!
              </p>
            </div>

            <button
              onClick={handleUnlock}
              className={`mb-10 w-full max-w-xs py-4 px-6 rounded-full active:scale-95 backdrop-blur-xl border shadow-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/20 hover:bg-white/30 border-white/30 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white shadow-slate-900/20'
              }`}
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              Tap to Open Jujuan Go Genting
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-md mx-auto px-4 pt-4 pb-20">
        {/* Dynamic Island Bar (BGM + Auto-Sync + Dark/Light Switch) */}
        <div className="sticky top-3 z-30 flex flex-col items-center mb-6">
          <div
            className={`backdrop-blur-2xl border rounded-full px-4 py-2 flex items-center gap-3 shadow-lg transition-colors duration-300 ${
              isDark
                ? 'bg-black/75 border-white/15 text-white'
                : 'bg-white/85 border-slate-200/90 text-slate-800 shadow-sky-900/10'
            }`}
          >
            <button onClick={toggleMusic} className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
              {isPlaying ? (
                <Music className="w-3.5 h-3.5 text-sky-500 animate-bounce" />
              ) : (
                <VolumeX className={`w-3.5 h-3.5 ${textSoft}`} />
              )}
              <span>{isPlaying ? 'BGM On' : 'Play BGM'}</span>
            </button>

            <div className={`w-px h-3.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />

            <button
              onClick={() => fetchLatestState(false)}
              className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer ${accentText}`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              <span>{isLive ? 'Auto-Sync' : 'Local'}</span>
            </button>

            <div className={`w-px h-3.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Tukar mod gelap atau cerah"
              className={`flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors ${
                isDark ? 'text-amber-300 hover:text-amber-200' : 'text-indigo-600 hover:text-indigo-500'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {bgmMissing && (
            <span className="mt-1.5 text-[10px] text-amber-300 bg-black/75 px-2.5 py-0.5 rounded-full">
              Letak fail public/bgm.m4a untuk hidupkan lagu
            </span>
          )}
        </div>

        {/* Kad Utama Tajuk & Countdown */}
        <section className={`backdrop-blur-2xl border rounded-3xl p-6 mb-5 transition-colors duration-300 ${glassCard}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${accentText}`}>
              {activePlan === 'A' ? 'Pelan A • Sabtu SkyWorlds' : 'Pelan B • Ahad SkyWorlds'}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border ${
                isDark ? 'bg-white/15 border-white/10 text-white' : 'bg-sky-100/80 border-sky-200 text-sky-800'
              }`}
            >
              15°C Misty Vibe
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Jujuan Go Genting</h1>
          <p className={`text-xs flex items-center gap-1 mt-1 mb-5 ${textMuted}`}>
            <MapPin className="w-3.5 h-3.5 text-pink-500" /> SkyWorlds & Highland Breeze @ Ion Delemen
          </p>

          <div className="grid grid-cols-4 gap-2 text-center mb-5">
            {[
              { label: 'Hari', val: countdown.d },
              { label: 'Jam', val: countdown.h },
              { label: 'Minit', val: countdown.m },
              { label: 'Saat', val: countdown.s }
            ].map((item) => (
              <div
                key={item.label}
                className={`border rounded-2xl py-2.5 transition-colors ${
                  isDark ? 'bg-black/30 border-white/10' : 'bg-sky-950/5 border-slate-200/80'
                }`}
              >
                <div className="text-xl font-bold">{item.val}</div>
                <div className={`text-[10px] uppercase ${textSoft}`}>{item.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className={`flex justify-between mb-1 ${textMuted}`}>
                <span>Persediaan Barang (Prep)</span>
                <span className={`font-semibold ${accentText}`}>{prepPercent}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-black/30' : 'bg-slate-200'}`}>
                <div
                  className="h-full bg-linear-to-r from-sky-400 to-indigo-500 transition-all duration-500"
                  style={{ width: `${prepPercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className={`flex justify-between mb-1 ${textMuted}`}>
                <span>Perjalanan (Pelan {activePlan})</span>
                <span className={`font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  {flowPercent}%
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-black/30' : 'bg-slate-200'}`}>
                <div
                  className="h-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                  style={{ width: `${flowPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigasi Utama */}
        <div
          className={`grid grid-cols-3 gap-1 backdrop-blur-xl p-1.5 rounded-2xl border mb-5 transition-colors ${subGlass}`}
        >
          {[
            { id: 'flow', label: 'Jadual', Icon: Calendar },
            { id: 'prep', label: 'Barang', Icon: Briefcase },
            { id: 'nav', label: 'Waze', Icon: Navigation }
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMainTab(id)}
              className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mainTab === id
                  ? isDark
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-900 text-white shadow-md'
                  : textMuted
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* TAB 1: JADUAL */}
        {mainTab === 'flow' && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`backdrop-blur-2xl border rounded-2xl p-3 mb-4 ${subGlass}`}>
              <div className="flex items-center justify-between px-1 mb-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${accentText}`}>
                  Pilih Mod Perjalanan (Auto-Sync)
                </span>
                <span className={`text-[10px] ${textSoft}`}>Tiket Open-Date</span>
              </div>
              <div
                className={`grid grid-cols-2 gap-1.5 p-1 rounded-xl border ${
                  isDark ? 'bg-black/30 border-white/10' : 'bg-slate-200/70 border-slate-300/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => switchPlan('A')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePlan === 'A'
                      ? 'bg-sky-500 text-white shadow-md'
                      : `${textMuted} hover:opacity-100`
                  }`}
                >
                  🎢 Pelan A: Sabtu
                </button>
                <button
                  type="button"
                  onClick={() => switchPlan('B')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePlan === 'B'
                      ? 'bg-indigo-500 text-white shadow-md'
                      : `${textMuted} hover:opacity-100`
                  }`}
                >
                  🌫️ Pelan B: Ahad
                </button>
              </div>
              <p className={`text-[11px] mt-2 px-1 leading-relaxed ${textMuted}`}>
                {activePlan === 'A'
                  ? 'Sabtu pagi terus masuk SkyWorlds, malam check-in & Ahad bangun lambat santai.'
                  : 'Sabtu gerak santai & check-in 3:00 PM segar, Ahad check-out 9:15 AM baru masuk SkyWorlds!'}
              </p>
            </div>

            <div className="flex gap-2 mb-4">
              {['sabtu', 'ahad'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDayTab(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    dayTab === d
                      ? isDark
                        ? 'bg-sky-400/25 border-sky-300/50 text-white'
                        : 'bg-sky-500 border-sky-500 text-white shadow-sm'
                      : isDark
                        ? 'bg-white/5 border-white/10 text-white/60'
                        : 'bg-white/60 border-slate-200 text-slate-600'
                  }`}
                >
                  {d === 'sabtu' ? 'Sabtu (14 Nov)' : 'Ahad (15 Nov)'}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {currentFlow[dayTab].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleFlowItem(dayTab, item.id)}
                  className={`p-4 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    item.done
                      ? isDark
                        ? 'bg-emerald-500/15 border-emerald-400/30 opacity-75'
                        : 'bg-emerald-50/90 border-emerald-300/80 opacity-80'
                      : isDark
                        ? 'bg-white/10 border-white/15 hover:bg-white/15'
                        : 'bg-white/75 border-slate-200/90 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className={`w-5 h-5 shrink-0 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`text-[11px] font-semibold ${accentText}`}>{item.time}</span>
                    <h3
                      className={`text-sm font-bold ${
                        item.done ? `line-through ${textSoft}` : ''
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className={`text-xs mt-0.5 ${textMuted}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* TAB 2: BARANG (ACCORDION) */}
        {mainTab === 'prep' && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3.5">
            <form onSubmit={addCustomPrep} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Tambah barang lain..."
                className={`flex-1 backdrop-blur-xl border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-sky-400 ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder:text-white/45'
                    : 'bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm'
                }`}
              />
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 rounded-2xl flex items-center justify-center cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {['SkyWorlds', 'Dokumen & Duit', 'Bilik & Malam', 'Tambahan Kita'].map((category) => {
              const items = stateData.prep.filter((i) => i.cat === category);
              if (items.length === 0) return null;

              const doneCount = items.filter((i) => i.done).length;
              const allDone = doneCount === items.length;
              const isOpen = !!openCats[category];

              return (
                <div
                  key={category}
                  className={`backdrop-blur-2xl border rounded-3xl overflow-hidden transition-all ${subGlass}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-bold uppercase tracking-wider ${accentText}`}>
                        {category}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          allDone
                            ? isDark
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                              : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                            : isDark
                              ? 'bg-black/30 text-white/70 border-white/10'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {doneCount}/{items.length}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isOpen ? `rotate-180 ${accentText}` : textSoft
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`px-4 pb-4 pt-2 space-y-2 border-t ${
                            isDark ? 'border-white/10' : 'border-slate-200/70'
                          }`}
                        >
                          {items.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => togglePrepItem(item.id)}
                              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                item.done
                                  ? isDark
                                    ? 'bg-emerald-500/15 border-emerald-400/30 opacity-75'
                                    : 'bg-emerald-50 border-emerald-300/80 opacity-80'
                                  : isDark
                                    ? 'bg-black/25 border-white/10 hover:bg-black/35'
                                    : 'bg-white/85 border-slate-200/80 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {item.done ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                ) : (
                                  <Circle
                                    className={`w-5 h-5 shrink-0 ${
                                      isDark ? 'text-white/40' : 'text-slate-400'
                                    }`}
                                  />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    item.done ? `line-through ${textSoft}` : ''
                                  }`}
                                >
                                  {item.text}
                                </span>
                              </div>
                              {item.id.startsWith('custom_') && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCustomPrep(item.id);
                                  }}
                                  className={`${textSoft} hover:text-rose-500 p-1 cursor-pointer`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.section>
        )}

        {/* TAB 3: WAZE & LOKASI */}
        {mainTab === 'nav' && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3.5">
            <div
              className={`backdrop-blur-xl border rounded-2xl p-4 flex gap-3 items-start ${
                isDark
                  ? 'bg-sky-500/15 border-sky-400/30 text-white/85'
                  : 'bg-sky-100/80 border-sky-300 text-slate-800'
              }`}
            >
              <Info className={`w-5 h-5 shrink-0 mt-0.5 ${accentText}`} />
              <div className="text-xs leading-relaxed">
                <p className="font-bold mb-1">Nota Penting Check-In Hotel:</p>
                Jangan taip Highland Breeze dekat Waze! Guna butang <strong>Grand Ion Delemen</strong> kat bawah ni. Parkir kereta dekat <strong>Level 4</strong>, lepas tu naik lif ke <strong>Level 7</strong> untuk ambil kunci dan validate kad Touch n Go.
              </div>
            </div>

            {LOCATIONS.map((loc) => (
              <div key={loc.name} className={`backdrop-blur-2xl border rounded-3xl p-4 ${subGlass}`}>
                <h3 className="text-sm font-bold">{loc.name}</h3>
                <p className={`text-xs mt-1 mb-3.5 leading-relaxed ${textMuted}`}>{loc.note}</p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={loc.waze}
                    target="_blank"
                    rel="noreferrer"
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isDark
                        ? 'bg-sky-500/25 hover:bg-sky-500/35 border-sky-400/40 text-sky-200'
                        : 'bg-sky-500 hover:bg-sky-600 border-sky-500 text-white shadow-sm'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" /> Buka Waze
                  </a>
                  <a
                    href={loc.maps}
                    target="_blank"
                    rel="noreferrer"
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 border-white/15 text-white/90'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Google Maps
                  </a>
                </div>
              </div>
            ))}
          </motion.section>
        )}
      </main>
    </div>
  );
}
