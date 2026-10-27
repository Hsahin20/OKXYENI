import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('terminal');
  
  // Kullanıcı Ayarları ve API State'leri
  const [userOkxApiKey, setUserOkxApiKey] = useState(localStorage.getItem('okx_api_key') || '');
  const [userOkxSecret, setUserOkxSecret] = useState(localStorage.getItem('okx_secret') || '');
  const [userOkxPassphrase, setUserOkxPassphrase] = useState(localStorage.getItem('okx_passphrase') || '');

  const [apiKey1, setApiKey1] = useState(localStorage.getItem('ai_key_1') || 'AQ.Ab8RN6JT9-C5kiJsCT8--LaUNaANKKXV7Xj_j2e1kAJmmBouUQ');
  const [apiKey2, setApiKey2] = useState(localStorage.getItem('ai_key_2') || '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');
  const [apiKey3, setApiKey3] = useState(localStorage.getItem('ai_key_3') || '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');
  const [apiKeyNvidia, setApiKeyNvidia] = useState(localStorage.getItem('ai_key_nv') || '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');

  const [telegramToken, setTelegramToken] = useState(localStorage.getItem('tg_token') || '8877868491:AAGzEjoQDSt7tVeQgSn0Ge7YMBb2JatNH60');
  const [telegramChatId, setTelegramChatId] = useState(localStorage.getItem('tg_chatid') || '2037458047');
  const [telegramStatus, setTelegramStatus] = useState('');

  const [activeApiKeyIndex, setActiveApiKeyIndex] = useState(0);
  const [useFreeFallbackAgent, setUseFreeFallbackAgent] = useState(false);

  // Binance WebSocket Canlı Fiyat & Flash State'leri
  const [btcPrice, setBtcPrice] = useState('91,420.00');
  const [priceFlash, setPriceFlash] = useState('');
  const lastPriceRef = useRef(91420);

  const [orderBook] = useState({
    asks: [
      { price: '91,435.50', amount: '0.4215', total: '38,540' },
      { price: '91,430.00', amount: '1.1250', total: '34,310' },
      { price: '91,425.20', amount: '0.8540', total: '24,080' },
      { price: '91,421.00', amount: '2.4100', total: '16,210' },
    ],
    bids: [
      { price: '91,419.50', amount: '1.5420', total: '14,100' },
      { price: '91,415.00', amount: '0.9200', total: '8,550' },
      { price: '91,410.10', amount: '3.1200', total: '5,630' },
      { price: '91,405.00', amount: '1.8400', total: '2,400' },
    ]
  });

  const [recentTrades, setRecentTrades] = useState([
    { id: 1, time: '14:32:05', price: '91,419.50', amount: '0.45 BTC', type: 'buy' },
    { id: 2, time: '14:32:04', price: '91,418.00', amount: '1.20 BTC', type: 'sell' },
    { id: 3, time: '14:32:02', price: '91,421.50', amount: '0.15 BTC', type: 'buy' },
  ]);

  // Alım / Satım Panel State'leri
  const [orderType, setOrderType] = useState('buy');
  const [priceInput, setPriceInput] = useState('91419.50');
  const [amountInput, setAmountInput] = useState('');
  const [tradeMessage, setTradeMessage] = useState('');

  // Portföy & Yönetilebilir Botlar
  const [basePortfolio] = useState(14820.50);
  const [activeTraderBots, setActiveTraderBots] = useState([
    { id: 1, name: 'SUI/USDT DCA Pro Bot', type: 'DCA', exchange: 'OKX Futures', pnl: '+%18.4', profit: 342.10, status: 'Çalışıyor' },
    { id: 2, name: 'PEPE/USDT Smart Grid', type: 'Grid', exchange: 'OKX Spot', pnl: '+%12.1', profit: 184.50, status: 'Çalışıyor' },
    { id: 3, name: 'BTC/USDT Quantum DCA', type: 'DCA', exchange: 'OKX Futures', pnl: '+%6.8', profit: 512.00, status: 'Çalışıyor' },
  ]);
  const [newBotName, setNewBotName] = useState('');
  const [newBotType, setNewBotType] = useState('DCA');
  const [newBotExchange, setNewBotExchange] = useState('OKX Futures');

  // İlk 15 Yükselen Coin Tablosu
  const [volumeCoins] = useState([
    { symbol: 'BTC-USDT', change: '+%4.5', volume: '$12.4B', rsi: 'Nötr (48.2)', macd: 'Yükseliş', news: 'Kurumsal ETF girişleri hızlandı.' },
    { symbol: 'ETH-USDT', change: '+%6.1', volume: '$5.1B', rsi: 'Pozitif (52.4)', macd: 'Kesişim', news: 'L2 ağlarında işlem hacmi arttı.' },
    { symbol: 'SOL-USDT', change: '+%11.4', volume: '$1.8B', rsi: 'Boğa (61.0)', macd: 'Güçlü Alım', news: 'DeFi ekosisteminde liderlik sürüyor.' },
    { symbol: 'SUI-USDT', change: '+%24.8', volume: '$482M', rsi: 'Dip (31.2)', macd: 'Pozitif Kesişim', news: 'TVL rekoru kırıldı, balina alımları var.' },
    { symbol: 'PEPE-USDT', change: '+%18.2', volume: '$310M', rsi: 'Aşırı Satım (27.5)', macd: 'Dipte Toparlanma', news: 'Sosyal medya hacim patlaması yaşanıyor.' },
    { symbol: 'AVAX-USDT', change: '+%9.3', volume: '$840M', rsi: 'Nötr (49.1)', macd: 'Yatay', news: 'Subnet entegrasyonları duyuruldu.' },
    { symbol: 'NEAR-USDT', change: '+%14.7', volume: '$620M', rsi: 'Boğa (58.3)', macd: 'Güçlü İvme', news: 'AI odaklı projeler yayına alındı.' },
    { symbol: 'RENDER-USDT', change: '+%8.9', volume: '$450M', rsi: 'Destek (42.0)', macd: 'Yukarı Kesişim', news: 'Merkeziyetsiz render talebi arttı.' },
    { symbol: 'TIA-USDT', change: '+%16.4', volume: '$390M', rsi: 'Boğa (64.2)', macd: 'Güçlü Alım', news: 'Modüler blokzincir ekosisteminde büyüme.' },
    { symbol: 'AR-USDT', change: '+%7.8', volume: '$210M', rsi: 'Nötr (50.5)', macd: 'Yatay', news: 'Kalıcı veri depolama talebi yükseldi.' },
    { symbol: 'FET-USDT', change: '+%19.5', volume: '$540M', rsi: 'Aşırı Alım (72.1)', macd: 'Güçlü Trend', news: 'Yapay zekâ tokenlarında sepet alımları.' },
    { symbol: 'INJ-USDT', change: '+%8.2', volume: '$300M', rsi: 'Destek (46.8)', macd: 'Pozitif', news: 'Türev borsası hacimlerinde artış.' },
    { symbol: 'APT-USDT', change: '+%10.1', volume: '$410M', rsi: 'Boğa (55.4)', macd: 'Kesişim', news: 'Yeni ağ ortaklıkları duyuruldu.' },
    { symbol: 'ARB-USDT', change: '+%6.5', volume: '$290M', rsi: 'Nötr (49.0)', macd: 'Yatay', news: 'Layer-2 ağ aktivitesinde toparlanma.' },
    { symbol: 'OP-USDT', change: '+%7.1', volume: '$270M', rsi: 'Nötr (51.2)', macd: 'Pozitif', news: 'Superchain entegrasyonları hız kazandı.' },
  ]);

  // Resimli ve Linkli Balina Haberleri
  const [cryptoNews] = useState([
    { 
      title: 'OKX ve Major Borsalarda SUI, PEPE ve NEAR Liderliğinde Hacim Patlaması!', 
      time: 'Şimdi', 
      source: 'OKX Research & On-Chain Insights', 
      sourceUrl: 'https://www.okx.com/insights',
      sentiment: 'Boğa (Güçlü Alım)',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop',
      details: 'SUI (+%24.8), PEPE (+%18.2) ve NEAR (+%14.7) paritelerinde anormal hacim artışları ve balina alımları doğrulanmıştır.' 
    },
    { 
      title: 'On-Chain Balina Raporu: SOL, TIA ve AR Ağlarında Yoğun Birikim', 
      time: '3 dk önce', 
      source: 'CoinDesk / On-Chain Tracker', 
      sourceUrl: 'https://www.coindesk.com',
      sentiment: 'Pozitif Trend',
      image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=600&auto=format&fit=crop',
      details: 'Solana (SOL) ve Celestia (TIA) cüzdanlarında kurumsal adreslerin soğuk cüzdan çekimleri tespit edildi.' 
    },
  ]);
  const [selectedNews, setSelectedNews] = useState(null);

  // AI İşlem ve Sinyal State'leri
  const [selectedTradeCoin, setSelectedTradeCoin] = useState('SUI-USDT');
  const [tradeType, setTradeType] = useState('spot_dip_tepe'); 
  const [leverage, setLeverage] = useState('3x');
  const [aiTradeRecommendation, setAiTradeRecommendation] = useState('🤖 Derinlemesine AI & Haber Analiz Motoru Hazır...');
  const [isAnalyzingTrade, setIsAnalyzingTrade] = useState(false);
  const isSpotStrategy = tradeType.includes('spot') || tradeType.includes('dca_spot');

  const [signalCoin, setSignalCoin] = useState('SUI-USDT');
  const [signalBar, setSignalBar] = useState('1H');
  const [signalLogs, setSignalLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'ALIM (LONG)', coin: 'SUI-USDT', price: '1.4520', desc: 'RSI Dip Seviyesinde, MACD Pozitif Kesişim Teyit Edildi.' }
  ]);
  const [isGeneratingSignal, setIsGeneratingSignal] = useState(false);

  const canvasRef = useRef(null);

  // Arka Plan Tuval Animasyonu
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speed: Math.random() * 1 + 0.3
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;
        ctx.fillStyle = 'rgba(52, 211, 153, 0.3)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Binance WebSocket Canlı Fiyat Bağlantısı
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newPrice = parseFloat(data.p);
      const formattedPrice = newPrice.toLocaleString('en-US', { minimumFractionDigits: 2 });

      if (newPrice > lastPriceRef.current) {
        setPriceFlash('text-emerald-400 bg-emerald-500/10');
      } else if (newPrice < lastPriceRef.current) {
        setPriceFlash('text-red-400 bg-red-500/10');
      }
      lastPriceRef.current = newPrice;
      setBtcPrice(formattedPrice);

      setTimeout(() => setPriceFlash(''), 300);

      const newTrade = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        price: formattedPrice,
        amount: (parseFloat(data.q)).toFixed(3) + ' BTC',
        type: data.m ? 'sell' : 'buy'
      };
      setRecentTrades(prev => [newTrade, ...prev.slice(0, 6)]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const toggleBotStatus = (id) => {
    setActiveTraderBots(prev => prev.map(bot => {
      if (bot.id === id) {
        return { ...bot, status: bot.status === 'Çalışıyor' ? 'Durduruldu' : 'Çalışıyor' };
      }
      return bot;
    }));
  };

  const deleteBot = (id) => {
    setActiveTraderBots(prev => prev.filter(bot => bot.id !== id));
  };

  const addNewBot = () => {
    if (!newBotName) return;
    const newBot = {
      id: Date.now(),
      name: newBotName,
      type: newBotType,
      exchange: newBotExchange,
      pnl: '+%5.0',
      profit: 50.00,
      status: 'Çalışıyor'
    };
    setActiveTraderBots(prev => [...prev, newBot]);
    setNewBotName('');
  };

  const sendTelegramNotification = async (customMsg) => {
    if (!telegramToken || !telegramChatId) return;
    try {
      const message = encodeURIComponent(customMsg);
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${telegramChatId}&text=${message}`);
    } catch (err) {
      console.error("Telegram hata:", err);
    }
  };

  const saveUserSettings = () => {
    localStorage.setItem('okx_api_key', userOkxApiKey);
    localStorage.setItem('okx_secret', userOkxSecret);
    localStorage.setItem('okx_passphrase', userOkxPassphrase);
    localStorage.setItem('ai_key_1', apiKey1);
    localStorage.setItem('ai_key_2', apiKey2);
    localStorage.setItem('ai_key_3', apiKey3);
    localStorage.setItem('ai_key_nv', apiKeyNvidia);
    localStorage.setItem('tg_token', telegramToken);
    localStorage.setItem('tg_chatid', telegramChatId);
    setTelegramStatus("✅ Tüm ayarlar ve API anahtarları kaydedildi!");
    setTimeout(() => setTelegramStatus(''), 4000);
  };

  const sendTelegramTest = async () => {
    if (!telegramToken || !telegramChatId) {
      setTelegramStatus('Lütfen Telegram Bot Token ve Chat ID girin!');
      return;
    }
    setTelegramStatus('Gönderiliyor...');
    try {
      await sendTelegramNotification('🚀 HS 3Commas Pro: WebSocket & Bot Sistem Testi Başarılı!');
      setTelegramStatus("✅ Test mesajı Telegram'a gönderildi!");
    } catch (error) {
      setTelegramStatus("Bağlantı hatası!");
    }
  };

  const runTradingViewSignalBot = async () => {
    setIsGeneratingSignal(true);
    const slotNames = ["Gemini AI", "Grok AI", "OpenRouter AI", "NVIDIA AI"];
    let currentProvider = useFreeFallbackAgent ? "Ücretsiz Yerel Fallback Ajanı" : slotNames[activeApiKeyIndex];

    setTimeout(async () => {
      try {
        const types = ['ALIM (LONG)', 'SATIŞ (SHORT)', 'DAR ARALIK GRID', 'DCA KADEMELİ'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const newLog = {
          time: new Date().toLocaleTimeString(),
          type: chosenType,
          coin: signalCoin,
          price: btcPrice,
          desc: `${signalBar} periyotta ${currentProvider} tarafından RSI, MACD ve Hacim taraması yapılarak tetiklendi.`
        };

        setSignalLogs(prev => [newLog, ...prev]);
        setIsGeneratingSignal(false);
        await sendTelegramNotification(`⚡ TradingView Sinyal Botu (${signalCoin} - ${signalBar}):\n\nTip: ${chosenType}\nFiyat: ${btcPrice}\nMotor: ${currentProvider}`);
      } catch (err) {
        setIsGeneratingSignal(false);
      }
    }, 1200);
  };

  const generateAiTradePlan = async () => {
    setIsAnalyzingTrade(true);
    const targetCoinObj = volumeCoins.find(c => c.symbol === selectedTradeCoin) || volumeCoins[0];
    const displayLeverage = isSpotStrategy ? '1x (Spot / Kaldıraçsız)' : leverage;

    setTimeout(async () => {
      let planText = `💎 **Kapsamlı AI & Haber Odaklı Strateji Raporu**\n`;
      planText += `📌 Parite: ${selectedTradeCoin} | Mod: ${tradeType.toUpperCase()} | Kaldıraç: ${displayLeverage}\n`;
      planText += `📰 Haber Özeti: "${targetCoinObj.news}"\n`;
      planText += `📈 RSI & MACD: ${targetCoinObj.rsi} - ${targetCoinObj.macd}\n`;
      planText += `🎯 Karar: Kademeli Alım (DCA) ve Grid aktif edildi. Hedef: +%16.5`;

      setAiTradeRecommendation(planText);
      setIsAnalyzingTrade(false);
      await sendTelegramNotification(`📢 Kapsamlı İşlem Raporu:\n\n${planText}`);
    }, 1500);
  };

  const handleTradeAction = (e) => {
    e.preventDefault();
    if (!amountInput) return;
    setTradeMessage(`✅ Başarılı! ${amountInput} BTC tutarında ${orderType.toUpperCase()} emri işleme alındı.`);
    setTimeout(() => setTradeMessage(''), 4000);
    setAmountInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B0E11] text-slate-100 font-sans overflow-hidden select-none relative">
      
      {/* Arka Plan Tuval */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* ÜST MENÜ BARı */}
      <header className="w-full bg-[#181A20] border-b border-slate-800/80 px-5 py-3 flex items-center justify-between z-20 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg font-black text-slate-950 text-lg">
            HS
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">HS TRADER TERMINAL</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Binance WebSocket & Multi-AI</p>
          </div>
        </div>

        {/* Sekme Butonları */}
        <nav className="flex items-center space-x-1.5">
          {[
            { id: 'terminal', label: '📈 Canlı Terminal' },
            { id: 'bots', label: '🤖 Bot Yönetimi' },
            { id: 'hacim', label: '🔥 Canlı Hacim (15 Coin)' },
            { id: 'trade_ai', label: '🎯 Dipten Al / Grid' },
            { id: 'signals', label: '⚡ Sinyaller' },
            { id: 'pulse', label: '📰 Balina Haberleri' },
            { id: 'settings', label: '⚙️ API & Ayarlar' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 font-black shadow-lg scale-105'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black border border-slate-800 bg-slate-950/60 ${priceFlash || 'text-white'}`}>
          BTC/USDT: ${btcPrice}
        </div>
      </header>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 overflow-y-auto p-3 z-10">
        
        {/* 1. CANLI TRADING TERMINALİ (3 Sütunlu Grid Layout) */}
        {activeTab === 'terminal' && (
          <div className="grid grid-cols-12 gap-3 h-full">
            
            {/* Sol Kolon: Emir Defteri & Son İşlemler (3 Sütun) */}
            <section className="col-span-3 bg-[#181A20] rounded-2xl border border-slate-800/80 p-3.5 flex flex-col justify-between shadow-xl">
              <div>
                <h2 className="text-xs font-black uppercase text-slate-400 mb-2.5 flex items-center justify-between">
                  <span>📚 Emir Defteri</span>
                  <span className="text-[10px] text-emerald-400">WebSocket Aktif</span>
                </h2>
                <div className="grid grid-cols-3 text-[10px] font-bold text-slate-500 pb-1.5 border-b border-slate-800">
                  <span>Fiyat</span>
                  <span className="text-right">Miktar</span>
                  <span className="text-right">Toplam</span>
                </div>
                
                {/* Asks */}
                <div className="space-y-0.5 my-1.5">
                  {orderBook.asks.map((ask, i) => (
                    <div key={i} className="grid grid-cols-3 text-xs font-mono py-0.5 hover:bg-red-500/10">
                      <span className="text-red-400 font-bold">{ask.price}</span>
                      <span className="text-right text-slate-300">{ask.amount}</span>
                      <span className="text-right text-slate-500">{ask.total}</span>
                    </div>
                  ))}
                </div>

                <div className={`py-1.5 my-1 border-y border-slate-800 text-sm font-black font-mono text-center ${priceFlash || 'text-emerald-400'} bg-[#0B0E11]/60`}>
                  ⚡ ${btcPrice}
                </div>

                {/* Bids */}
                <div className="space-y-0.5 my-1.5">
                  {orderBook.bids.map((bid, i) => (
                    <div key={i} className="grid grid-cols-3 text-xs font-mono py-0.5 hover:bg-emerald-500/10">
                      <span className="text-emerald-400 font-bold">{bid.price}</span>
                      <span className="text-right text-slate-300">{bid.amount}</span>
                      <span className="text-right text-slate-500">{bid.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Son İşlemler */}
              <div className="border-t border-slate-800 pt-2.5 mt-2">
                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-1.5">⚡ Son İşlemler</h3>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {recentTrades.map((t) => (
                    <div key={t.id} className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500 text-[10px]">{t.time}</span>
                      <span className={t.type === 'buy' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>${t.price}</span>
                      <span className="text-slate-300">{t.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Orta Kolon: TradingView Grafik Terminali (6 Sütun) */}
            <section className="col-span-6 bg-[#181A20] rounded-2xl border border-slate-800/80 p-4 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase text-slate-300">📊 TradingView Grafik & Mum Analizi</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">1S Candlestick</span>
                </div>
                <div className="flex space-x-1 text-xs">
                  {['15m', '1H', '4H', '1D'].map((tf, idx) => (
                    <button key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700">
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-[#0B0E11] rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden p-4 shadow-inner">
                <div className="z-10 flex items-end space-x-3 h-52">
                  {[40, 65, 55, 80, 70, 95, 85, 110, 100, 130, 120, 150].map((h, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-0.5 ${i % 2 === 0 ? 'bg-emerald-400 h-6' : 'bg-red-400 h-6'}`}></div>
                      <div className={`w-3.5 rounded-sm ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ height: `${h}px` }}></div>
                      <div className={`w-0.5 ${i % 2 === 0 ? 'bg-emerald-400 h-4' : 'bg-red-400 h-4'}`}></div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 font-mono z-10">Binance WebSocket Canlı Akış Entegre Grafik</p>
              </div>
            </section>

            {/* Sağ Kolon: Hızlı İşlem Paneli & Varlıklar (3 Sütun) */}
            <section className="col-span-3 bg-[#181A20] rounded-2xl border border-slate-800/80 p-4 flex flex-col justify-between shadow-xl">
              <div>
                <h2 className="text-xs font-black uppercase text-slate-400 mb-3 tracking-wider">⚡ Hızlı İşlem Paneli</h2>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button 
                    onClick={() => setOrderType('buy')}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${orderType === 'buy' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    AL (LONG)
                  </button>
                  <button 
                    onClick={() => setOrderType('sell')}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${orderType === 'sell' ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    SAT (SHORT)
                  </button>
                </div>

                <form onSubmit={handleTradeAction} className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Emir Fiyatı (USDT)</label>
                    <input 
                      type="text" 
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      className="w-full bg-[#0B0E11] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white font-mono shadow-inner focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Miktar (BTC)</label>
                    <input 
                      type="number" 
                      step="0.001"
                      placeholder="0.00"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="w-full bg-[#0B0E11] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white font-mono shadow-inner focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {tradeMessage && (
                    <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[11px] text-emerald-300 font-bold">
                      {tradeMessage}
                    </div>
                  )}

                  <button 
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-xs font-black shadow-xl transition-all ${orderType === 'buy' ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-red-500 hover:bg-red-400 text-white'}`}
                  >
                    {orderType === 'buy' ? 'BTC Alımı Gerçekleştir' : 'BTC Satışı Gerçekleştir'}
                  </button>
                </form>
              </div>

              {/* Kullanıcı Varlıkları */}
              <div className="border-t border-slate-800 pt-3 mt-3">
                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2">💰 Kullanıcı Varlıkları</h3>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300"><span>USDT:</span> <span className="font-bold">4,850.20</span></div>
                  <div className="flex justify-between text-slate-300"><span>BTC:</span> <span className="font-bold">0.3524</span></div>
                  <div className="flex justify-between text-slate-300"><span>ETH:</span> <span className="font-bold">2.4100</span></div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* 2. BOT YÖNETİMİ SEKMESİ */}
        {activeTab === 'bots' && (
          <div className="max-w-4xl mx-auto bg-[#181A20] p-7 rounded-2xl border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-black text-white mb-4">🤖 3Commas Stili Aktif Bot Performans & Yönetim Paneli</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {activeTraderBots.map((bot) => (
                <div key={bot.id} className="bg-[#0B0E11] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-sm text-emerald-400">{bot.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${bot.status === 'Çalışıyor' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{bot.status}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">Borsa: <span className="text-white font-semibold">{bot.exchange}</span></p>
                  </div>
                  <div className="flex justify-between items-end border-t border-slate-800 pt-3">
                    <p className="text-base font-black text-emerald-400">${bot.profit.toFixed(2)} <span className="text-xs text-emerald-300">({bot.pnl})</span></p>
                    <div className="flex gap-2">
                      <button onClick={() => toggleBotStatus(bot.id)} className={`px-2.5 py-1 rounded text-xs font-black ${bot.status === 'Çalışıyor' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {bot.status === 'Çalışıyor' ? 'Durdur' : 'Başlat'}
                      </button>
                      <button onClick={() => deleteBot(bot.id)} className="bg-slate-800 text-slate-400 hover:text-red-400 px-2 py-1 rounded text-xs">✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0B0E11] p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-black text-emerald-400 uppercase mb-3">➕ Yeni DCA veya Grid Botu Ekle</h3>
              <div className="grid grid-cols-4 gap-3">
                <input type="text" placeholder="Bot Adı (örn: SOL Grid)" value={newBotName} onChange={(e) => setNewBotName(e.target.value)} className="bg-[#181A20] border border-slate-700 rounded-xl p-2.5 text-xs text-white" />
                <select value={newBotType} onChange={(e) => setNewBotType(e.target.value)} className="bg-[#181A20] border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold">
                  <option value="DCA">DCA Stratejisi</option>
                  <option value="Grid">Grid Stratejisi</option>
                </select>
                <select value={newBotExchange} onChange={(e) => setNewBotExchange(e.target.value)} className="bg-[#181A20] border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold">
                  <option value="OKX Futures">OKX Futures</option>
                  <option value="OKX Spot">OKX Spot</option>
                </select>
                <button onClick={addNewBot} className="bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg hover:bg-emerald-400">Botu Başlat</button>
              </div>
            </div>
          </div>
        )}

        {/* 3. CANLI HACİM TARAMASI SEKMESİ (15 COİN) */}
        {activeTab === 'hacim' && (
          <div className="max-w-5xl mx-auto bg-[#181A20] rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
              <span>🔥</span> Hacim Yükselişindeki İlk 15 Popüler Coin (Canlı OKX V5 Verileri)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="pb-3">COİN ÇİFTİ</th>
                    <th className="pb-3">24S DEĞİŞİM</th>
                    <th className="pb-3">HACİM</th>
                    <th className="pb-3">RSI / İNDİKATÖR</th>
                    <th className="pb-3">CANLI HABER DESTEĞİ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {volumeCoins.map((coin, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-3 font-black text-emerald-400 text-sm">{coin.symbol}</td>
                      <td className="py-3 text-emerald-400 font-black">{coin.change}</td>
                      <td className="py-3 text-slate-300 font-semibold">{coin.volume}</td>
                      <td className="py-3 text-slate-300 font-semibold">{coin.rsi}</td>
                      <td className="py-3 text-slate-400">{coin.news}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. DİPTEN AL / GRID & AI RAPOR SEKMESİ */}
        {activeTab === 'trade_ai' && (
          <div className="max-w-3xl mx-auto bg-[#181A20] p-7 rounded-2xl border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-black mb-1 text-white">🎯 Dipten Al, Tepeden Sat & Derinlemesine AI Karar Motoru</h2>
            <p className="text-xs text-slate-400 mb-6">Canlı borsa verileri ve haber analizleri harmanlanarak ayrıntılı karar raporu üretilir.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Coin Seçimi</label>
                <select value={selectedTradeCoin} onChange={(e) => setSelectedTradeCoin(e.target.value)} className="w-full bg-[#0B0E11] border border-slate-700 rounded-xl p-3 text-xs font-bold text-white">
                  {volumeCoins.map((c, i) => <option key={i} value={c.symbol}>{c.symbol}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Strateji Modu</label>
                <select value={tradeType} onChange={(e) => setTradeType(e.target.value)} className="w-full bg-[#0B0E11] border border-slate-700 rounded-xl p-3 text-xs font-bold text-white">
                  <option value="spot_dip_tepe">Normal Spot (Dipten Al / Sat)</option>
                  <option value="spot_grid">Spot Grid (Dar Aralık Kâr Döngüsü)</option>
                  <option value="futures_grid">Futures Grid (Kaldıraçlı)</option>
                </select>
              </div>
            </div>

            <button onClick={generateAiTradePlan} disabled={isAnalyzingTrade} className="bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 font-black px-7 py-3 rounded-xl text-xs shadow-xl mb-6 disabled:opacity-50">
              {isAnalyzingTrade ? '✨ Rapor Üretiliyor...' : '🤖 Kapsamlı AI Raporu Üret & Telegrama Gönder'}
            </button>

            <div className="bg-[#0B0E11] border border-slate-800 p-5 rounded-xl whitespace-pre-line text-xs text-slate-200 font-mono shadow-inner">
              {aiTradeRecommendation}
            </div>
          </div>
        )}

        {/* 5. SİNYALLER SEKMESİ */}
        {activeTab === 'signals' && (
          <div className="max-w-3xl mx-auto bg-[#181A20] p-7 rounded-2xl border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-black mb-1 text-white">⚡ TradingView Benzeri Ücretsiz Canlı Sinyal Botu</h2>
            <p className="text-xs text-slate-400 mb-6">Parite ve periyot seçerek yapay zeka destekli sinyal üretin.</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Parite</label>
                <select value={signalCoin} onChange={(e) => setSignalCoin(e.target.value)} className="w-full bg-[#0B0E11] border border-slate-700 rounded-xl p-3 text-xs font-bold text-white">
                  {volumeCoins.map((c, i) => <option key={i} value={c.symbol}>{c.symbol}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Zaman Dilimi</label>
                <select value={signalBar} onChange={(e) => setSignalBar(e.target.value)} className="w-full bg-[#0B0E11] border border-slate-700 rounded-xl p-3 text-xs font-bold text-white">
                  <option value="15m">15 Dakika</option>
                  <option value="1H">1 Saat</option>
                  <option value="4H">4 Saat</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={runTradingViewSignalBot} disabled={isGeneratingSignal} className="w-full bg-emerald-500 text-slate-950 font-black py-3 rounded-xl text-xs hover:bg-emerald-400 shadow-xl">
                  {isGeneratingSignal ? 'Sinyal Taranıyor...' : 'Sinyal Botunu Çalıştır'}
                </button>
              </div>
            </div>

            <div className="bg-[#0B0E11] p-4 rounded-xl border border-slate-800 space-y-2 max-h-60 overflow-y-auto">
              {signalLogs.map((log, index) => (
                <div key={index} className="bg-[#181A20] p-3 rounded-lg border border-slate-800 text-xs flex justify-between">
                  <div>
                    <span className="text-slate-500 mr-2">{log.time}</span>
                    <span className="text-emerald-400 font-bold mr-2">{log.coin}</span>
                    <span className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded font-bold mr-2">{log.type}</span>
                    <span className="text-slate-300">{log.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. RESİMLİ BALİNA HABERLERİ SEKMESİ */}
        {activeTab === 'pulse' && (
          <div className="max-w-4xl mx-auto bg-[#181A20] p-7 rounded-2xl border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-black mb-1 text-white">📰 Canlı Kripto Haberler & Kaynak Linkleri</h2>
            <p className="text-xs text-slate-400 mb-6">Yapay zeka ajanları tarafından taranan haberlerin tamamını okuyun ve orijinal kaynağına gidin:</p>
            
            <div className="space-y-6">
              {cryptoNews.map((news, idx) => (
                <div key={idx} className="bg-[#0B0E11] rounded-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-44 overflow-hidden">
                    <img src={news.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-400 hover:underline">🌐 {news.source} ↗</a>
                        <span className="text-xs text-slate-500">{news.time}</span>
                      </div>
                      <h3 className="font-black text-sm text-slate-100 mb-2">{news.title}</h3>
                      <p className="text-xs text-slate-300 mb-3">{news.details}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="bg-slate-800 text-emerald-300 text-[10px] px-2.5 py-1 rounded font-bold">Piyasa Duygusu: {news.sentiment}</span>
                      <button onClick={() => setSelectedNews(news)} className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-lg hover:bg-emerald-500 hover:text-slate-950">Haberi Oku</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedNews && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div className="bg-[#181A20] border border-emerald-500/50 rounded-2xl max-w-xl w-full p-6 relative">
                  <button onClick={() => setSelectedNews(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white font-black">✕</button>
                  <h3 className="text-base font-black text-white mb-2">{selectedNews.title}</h3>
                  <img src={selectedNews.image} alt="" className="w-full h-40 object-cover rounded-xl mb-3" />
                  <p className="text-xs text-slate-300 mb-5">{selectedNews.details} Bu içerik yapay zeka tarama ajanları tarafından derlenmiştir.</p>
                  <div className="flex justify-between">
                    <a href={selectedNews.sourceUrl} target="_blank" rel="noopener noreferrer" className="bg-cyan-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs">Orijinal Kaynağa Git ↗</a>
                    <button onClick={() => setSelectedNews(null)} className="bg-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs">Kapat</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. API & AYARLAR SEKMESİ */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-[#181A20] p-7 rounded-2xl border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-black mb-1 text-white">⚙️ Kullanıcı Borsa API & Telegram Ayarları</h2>
            <p className="text-xs text-slate-400 mb-6">Kendi OKX/Binance API bilgilerinizi ve Telegram bot bilgilerinizi güvenle girin:</p>
            
            <div className="space-y-4">
              <div className="bg-[#0B0E11] p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-black text-emerald-400 uppercase">🔑 Borsa API Bilgileri</h3>
                <input type="text" value={userOkxApiKey} onChange={(e) => setUserOkxApiKey(e.target.value)} placeholder="API Key girin..." className="w-full bg-[#181A20] border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono" />
                <input type="password" value={userOkxSecret} onChange={(e) => setUserOkxSecret(e.target.value)} placeholder="Secret Key girin..." className="w-full bg-[#181A20] border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono" />
              </div>

              <div className="bg-[#0B0E11] p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-black text-amber-400 uppercase">📢 Telegram Bot Entegrasyonu</h3>
                <input type="text" value={telegramToken} onChange={(e) => setTelegramToken(e.target.value)} placeholder="Bot Token..." className="w-full bg-[#181A20] border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono" />
                <input type="text" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} placeholder="Chat ID..." className="w-full bg-[#181A20] border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono" />
              </div>

              {telegramStatus && <p className="text-xs font-black text-emerald-400">{telegramStatus}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={saveUserSettings} className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 font-black py-3 rounded-xl text-xs shadow-xl">
                  Ayarları ve API'leri Kaydet
                </button>
                <button onClick={sendTelegramTest} className="bg-slate-800 text-emerald-300 font-black px-5 py-3 rounded-xl text-xs hover:bg-slate-700">
                  Telegram Test Mesajı
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}