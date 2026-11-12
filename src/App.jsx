import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Lock, Sparkles, Music, VolumeX, Calendar, Briefcase, Navigation,
  CheckCircle2, Circle, Plus, MapPin, CloudFog, RefreshCw, Trash2, ExternalLink, Info
} from 'lucide-react';

const INITIAL_DATA = {
  flow: {
    sabtu: [
      { id: 'f1', time: '07:30 AM', title: 'Gerak & Sarapan Berat', desc: 'Isi perut siap-siap dekat bawah sebelum naik bukit', done: false },
      { id: 'f2', time: '09:15 AM', title: 'Parkir Kereta & Naik Puncak', desc: 'Parkir dekat Awana SkyCentral (naik cable car) atau SkyAvenue', done: false },
      { id: 'f3', time: '10:00 AM', title: 'Genting SkyWorlds Adventure', desc: 'Tebus QR, tempah slot VQ dalam app dan main semua ride!', done: false },
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
  prep: [
    { id: 'p1', cat: 'SkyWorlds', text: 'Baju hujan pakai buang (2 helai)', done: false },
    { id: 'p2', cat: 'SkyWorlds', text: 'Powerbank penuh & kabel caj', done: false },
    { id: 'p3', cat: 'SkyWorlds', text: 'Kasut sukan selesa & stokin', done: false },
    { id: 'p4', cat: 'SkyWorlds', text: 'Jaket nipis / windbreaker & plastik baju basah', done: false },
    { id: 'p5', cat: 'Dokumen & Duit', text: 'Wang tunai RM200 (Deposit Highland Breeze)', done: false },
    { id: 'p6', cat: 'Dokumen & Duit', text: 'Kad Touch n Go (Baki minimum RM30)', done: false },
    { id: 'p7', cat: 'Dokumen & Duit', text: 'Screenshot baucar HopeGoo & tiket QR SkyWorlds', done: false },
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
    note: 'Taman tema buka 10:00 AM hingga 6:00 PM. Jangan lupa beli bekalan malam dekat 7E/FamilyMart sebelum naik hotel.',
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
    note: 'Lokasi jalan santai, minum petang dan cuci mata hari Ahad sebelum bertolak balik.',
    waze: 'https://waze.com/ul?q=Genting%20Highlands%20Premium%20Outlets&navigate=yes',
    maps: 'https://www.google.com/maps/search/?api=1&query=Genting+Highlands+Premium+Outlets'
  }
];

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgmMissing, setBgmMissing] = useState(false);
  const [mainTab, setMainTab] = useState('flow');
  const [dayTab, setDayTab] = useState('sabtu');
  const [stateData, setStateData] = useState(INITIAL_DATA);
  const [syncing, setSyncing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [countdown, setCountdown] = useState({ d: '00', h: '00', m: '00', s: '00' });

  const audioRef = useRef(null);
  const lastSaveRef = useRef(0);

  useEffect(() => {
    const target = new Date('2026-11-14T07:30:00+08:00').getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      setCountdown({
        d: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        h: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        m: String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0'),
        s: String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchLatestState = useCallback(async (silent = false) => {
    if (silent && Date.now() - lastSaveRef.current < 3000) return;

    if (!silent) setSyncing(true);
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (res.ok) {
        const cloudData = await res.json();
        setIsLive(true);
        if (cloudData && cloudData.flow && cloudData.prep) {
          setStateData(cloudData);
          localStorage.setItem('jujuan_genting', JSON.stringify(cloudData));
          if (!silent) setSyncing(false);
          return;
        }
      }
    } catch {
      setIsLive(false);
    }

    if (!silent) {
      const saved = localStorage.getItem('jujuan_genting');
      if (saved) setStateData(JSON.parse(saved));
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestState(false);

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchLatestState(true);
      }
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
    lastSaveRef.current = Date.now();
    setStateData(updated);
    localStorage.setItem('jujuan_genting', JSON.stringify(updated));
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
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
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setBgmMissing(false);
        })
        .catch(() => setIsPlaying(false));
    }
    confetti({ particleCount: 55, spread: 65, origin: { y: 0.7 } });
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setBgmMissing(false);
        })
        .catch(() => setBgmMissing(true));
    }
  };

  const toggleFlowItem = (day, id) => {
    const updatedDay = stateData.flow[day].map((item) => {
      if (item.id === id) {
        if (!item.done) confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
        return { ...item, done: !item.done };
      }
      return item;
    });
    saveState({ ...stateData, flow: { ...stateData.flow, [day]: updatedDay } });
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
  };

  const deleteCustomPrep = (id) => {
    saveState({ ...stateData, prep: stateData.prep.filter((i) => i.id !== id) });
  };

  const allFlow = [...stateData.flow.sabtu, ...stateData.flow.ahad];
  const flowPercent = Math.round((allFlow.filter((i) => i.done).length / allFlow.length) * 100);
  const prepPercent = Math.round((stateData.prep.filter((i) => i.done).length / stateData.prep.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden selection:bg-sky-400/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <audio
        ref={audioRef}
        src="/bgm.m4a"
        loop
        preload="auto"
        onError={() => setBgmMissing(true)}
      />

      <AnimatePresence>
        {!unlocked && (
          <motion.div
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col justify-between items-center p-6 bg-slate-950/75 backdrop-blur-2xl"
          >
            <div className="mt-14 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-sky-200 mb-4">
                <Lock className="w-3 h-3" /> Private Trip Pass
              </div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                14 - 15 Nov
              </h1>
              <p className="text-sm text-white/70 mt-1">Sabtu & Ahad • Genting Highlands</p>
            </div>

            <div className="w-full max-w-sm bg-white/12 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                  <CloudFog className="w-4 h-4" /> TRIP REMINDER
                </span>
                <span>Sekarang</span>
              </div>
              <h2 className="text-xl font-bold text-white">Jujuan Go Genting 🎢🌫️</h2>
              <p className="text-xs text-white/75 mt-1 leading-relaxed">
                Kad tentatif, lokasi Waze dan senarai persediaan rasmi kita dah siap. Tekan di bawah untuk mula semak!
              </p>
            </div>

            <button
              onClick={handleUnlock}
              className="mb-10 w-full max-w-xs py-4 px-6 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-xl border border-white/30 shadow-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              Tap to Open Jujuan Go Genting
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-md mx-auto px-4 pt-4 pb-20">
        <div className="sticky top-3 z-30 flex flex-col items-center mb-6">
          <div className="bg-black/70 backdrop-blur-2xl border border-white/15 rounded-full px-4 py-2 flex items-center gap-3.5 shadow-lg">
            <button onClick={toggleMusic} className="flex items-center gap-2 text-xs font-medium text-white/90 cursor-pointer">
              {isPlaying ? (
                <Music className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-white/50" />
              )}
              <span>{isPlaying ? 'BGM Playing' : 'Play BGM'}</span>
            </button>
            <div className="w-px h-3.5 bg-white/20" />
            <button
              onClick={() => fetchLatestState(false)}
              className="flex items-center gap-1.5 text-xs text-sky-300 cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              <span>{isLive ? 'Auto-Sync' : 'Local'}</span>
            </button>
          </div>
          {bgmMissing && (
            <span className="mt-1.5 text-[10px] text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-full">
              Letak fail public/bgm.m4a untuk hidupkan lagu
            </span>
          )}
        </div>

        <section className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 mb-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-300">
              Weekend Getaway
            </span>
            <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full border border-white/10">
              15°C Misty Vibe
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Jujuan Go Genting</h1>
          <p className="text-xs text-white/70 flex items-center gap-1 mt-1 mb-5">
            <MapPin className="w-3.5 h-3.5 text-pink-300" /> SkyWorlds & Highland Breeze @ Ion Delemen
          </p>

          <div className="grid grid-cols-4 gap-2 text-center mb-5">
            {[
              { label: 'Hari', val: countdown.d },
              { label: 'Jam', val: countdown.h },
              { label: 'Minit', val: countdown.m },
              { label: 'Saat', val: countdown.s }
            ].map((item) => (
              <div key={item.label} className="bg-black/30 border border-white/10 rounded-2xl py-2.5">
                <div className="text-xl font-bold text-white">{item.val}</div>
                <div className="text-[10px] uppercase text-white/55">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-white/80 mb-1">
                <span>Persediaan Barang (Prep)</span>
                <span className="font-semibold text-sky-300">{prepPercent}%</span>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-500" style={{ width: `${prepPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-white/80 mb-1">
                <span>Perjalanan (Tentative Flow)</span>
                <span className="font-semibold text-emerald-300">{flowPercent}%</span>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500" style={{ width: `${flowPercent}%` }} />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-1 bg-white/10 backdrop-blur-xl p-1.5 rounded-2xl border border-white/15 mb-5">
          <button
            onClick={() => setMainTab('flow')}
            className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mainTab === 'flow' ? 'bg-white text-slate-950 shadow-md' : 'text-white/75'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Jadual
          </button>
          <button
            onClick={() => setMainTab('prep')}
            className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mainTab === 'prep' ? 'bg-white text-slate-950 shadow-md' : 'text-white/75'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Barang
          </button>
          <button
            onClick={() => setMainTab('nav')}
            className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mainTab === 'nav' ? 'bg-white text-slate-950 shadow-md' : 'text-white/75'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" /> Waze
          </button>
        </div>

        {mainTab === 'flow' && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex gap-2 mb-4">
              {['sabtu', 'ahad'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDayTab(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    dayTab === d
                      ? 'bg-sky-400/25 border-sky-300/50 text-white'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  {d === 'sabtu' ? 'Sabtu (14 Nov)' : 'Ahad (15 Nov)'}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {stateData.flow[dayTab].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleFlowItem(dayTab, item.id)}
                  className={`p-4 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    item.done
                      ? 'bg-emerald-500/15 border-emerald-400/30 opacity-75'
                      : 'bg-white/10 border-white/15 hover:bg-white/15'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/40 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold text-sky-300">{item.time}</span>
                    <h3 className={`text-sm font-bold ${item.done ? 'line-through text-white/60' : 'text-white'}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/65 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {mainTab === 'prep' && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <form onSubmit={addCustomPrep} className="flex gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Tambah barang lain..."
                className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-sky-400"
              />
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 rounded-2xl flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {['SkyWorlds', 'Dokumen & Duit', 'Bilik & Malam', 'Tambahan Kita'].map((category) => {
              const items = stateData.prep.filter((i) => i.cat === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-3 px-1">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => togglePrepItem(item.id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          item.done
                            ? 'bg-emerald-500/15 border-emerald-400/30 opacity-75'
                            : 'bg-black/25 border-white/10 hover:bg-black/35'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.done ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-white/40 shrink-0" />
                          )}
                          <span className={`text-xs font-medium ${item.done ? 'line-through text-white/55' : 'text-white'}`}>
                            {item.text}
                          </span>
                        </div>
                        {item.id.startsWith('custom_') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCustomPrep(item.id);
                            }}
                            className="text-white/40 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.section>
        )}

        {mainTab === 'nav' && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3.5">
            <div className="bg-sky-500/15 backdrop-blur-xl border border-sky-400/30 rounded-2xl p-4 flex gap-3 items-start">
              <Info className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
              <div className="text-xs text-white/85 leading-relaxed">
                <p className="font-bold text-white mb-1">Nota Penting Check-In Hotel:</p>
                Jangan taip Highland Breeze dekat Waze! Guna butang <strong>Grand Ion Delemen</strong> kat bawah ni. Parkir kereta dekat <strong>Level 4</strong>, lepas tu naik lif ke <strong>Level 7</strong> untuk ambil kunci dan validate kad Touch n Go.
              </div>
            </div>

            {LOCATIONS.map((loc) => (
              <div key={loc.name} className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-4">
                <h3 className="text-sm font-bold text-white">{loc.name}</h3>
                <p className="text-xs text-white/65 mt-1 mb-3.5 leading-relaxed">{loc.note}</p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={loc.waze}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-sky-500/25 hover:bg-sky-500/35 border border-sky-400/40 text-xs font-semibold text-sky-200 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Buka Waze
                  </a>
                  <a
                    href={loc.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white/90 flex items-center justify-center gap-1.5 transition-all"
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
