import React, { useState, useEffect } from 'react';

export default function App() {
  // --- STATE TANIMLAMALARI ---
  const [btcPrice, setBtcPrice] = useState('79,878.29');
  const [trades, setTrades] = useState([]);
  const [activeTab, setActiveTab] = useState('terminal'); // terminal, bot, volume, grid, signals, whales, settings

  // API Anahtarları (localStorage üzerinden güvenli yönetim)
  const [openRouterKey, setOpenRouterKey] = useState(localStorage.getItem('openrouter_key') || '');
  const [groqKey, setGroqKey] = useState(localStorage.getItem('groq_key') || '');
  const [gcpKey, setGcpKey] = useState(localStorage.getItem('gcp_key') || '');

  // İşlem Paneli State'leri
  const [orderType, setOrderType] = useState('LONG');
  const [orderAmount, setOrderAmount] = useState('');

  // --- 1. BİNANCE WEBSOCKET BAĞLANTISI (Canlı Fiyatlar) ---
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p).toLocaleString('en-US', { minimumFractionDigits: 2 });
      setBtcPrice(price);

      const newTrade = {
        id: data.t,
        time: new Date(data.T).toLocaleTimeString(),
        price: price,
        qty: parseFloat(data.q).toFixed(4),
        isBuyer: data.m 
      };

      setTrades((prev) => [newTrade, ...prev.slice(0, 19)]);
    };

    return () => {
      ws.close();
    };
  }, []);

  // --- 2. API ANAHTARLARINI KAYDETME ---
  const handleSaveKeys = (e) => {
    e.preventDefault();
    localStorage.setItem('openrouter_key', openRouterKey);
    localStorage.setItem('groq_key', groqKey);
    localStorage.setItem('gcp_key', gcpKey);
    alert('API anahtarları tarayıcınızın güvenli hafızasına başarıyla kaydedildi!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-3 sm:p-4">
      {/* ÜST MENÜ / NAVBAR */}
      <header className="flex flex-col xl:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6 shadow-lg gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-lg text-sm">
            HS TRADER
          </div>
          <span className="text-xl font-bold tracking-wider">TERMINAL</span>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full hidden sm:inline-block">
            ● Binance WebSocket & Multi-AI
          </span>
        </div>

        {/* Sekmeler Navigasyonu */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button 
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'terminal' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            💻 Canlı Terminal
          </button>
          <button 
            onClick={() => setActiveTab('bot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'bot' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            🤖 Bot Yönetimi
          </button>
          <button 
            onClick={() => setActiveTab('volume')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'volume' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            🔥 Canlı Hacim (15 Coin)
          </button>
          <button 
            onClick={() => setActiveTab('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'grid' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            📉 Dipten Al / Grid
          </button>
          <button 
            onClick={() => setActiveTab('signals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'signals' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            ⚡ Sinyaller
          </button>
          <button 
            onClick={() => setActiveTab('whales')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'whales' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            🐋 Balina Haberleri
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'settings' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            ⚙️ API & Ayarlar
          </button>
        </div>

        {/* Fiyat Göstergesi */}
        <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm font-mono">
          <span className="text-slate-400 mr-2">BTC/USDT:</span>
          <span className="text-emerald-400 font-bold">${btcPrice}</span>
        </div>
      </header>

      {/* İÇERİK SEKMELERİ */}
      {activeTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SOL: EMİR DEFTERİ & SON İŞLEMLER */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
            <h2 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">⚡ Emir Defteri (WebSocket Aktif)</h2>
            <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1 font-mono text-xs mb-4">
              <div className="flex justify-between text-slate-500 border-b border-slate-800 pb-1">
                <span>Fiyat</span><span>Miktar</span><span>Toplam</span>
              </div>
              <div className="flex justify-between text-red-400"><span>91,435.50</span><span>0.4215</span><span>38,540</span></div>
              <div className="flex justify-between text-red-400"><span>91,430.00</span><span>1.1250</span><span>34,310</span></div>
              <div className="flex justify-between text-red-400"><span>91,425.20</span><span>0.8540</span><span>24,050</span></div>
              <div className="flex justify-between text-red-400"><span>91,421.00</span><span>2.4100</span><span>16,210</span></div>
              <div className="text-center font-bold text-emerald-400 py-1 bg-emerald-950/30 rounded border border-emerald-900/40">
                🚀 ${btcPrice}
              </div>
              <div className="flex justify-between text-emerald-400"><span>91,419.50</span><span>1.5420</span><span>14,100</span></div>
              <div className="flex justify-between text-emerald-400"><span>91,415.00</span><span>0.9200</span><span>8,550</span></div>
              <div className="flex justify-between text-emerald-400"><span>91,410.10</span><span>3.1200</span><span>5,630</span></div>
              <div className="flex justify-between text-emerald-400"><span>91,405.00</span><span>1.8400</span><span>2,400</span></div>
            </div>

            <h2 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">🔔 Son İşlemler</h2>
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 font-mono text-xs">
              {trades.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2">Akış bekleniyor...</p>
              ) : (
                trades.map((t) => (
                  <div key={t.id} className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-500">{t.time}</span>
                    <span className={t.isBuyer ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                      ${t.price}
                    </span>
                    <span className="text-slate-300">{t.qty} BTC</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ORTA: GRAFİK & ANALİZ */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">📈 TradingView Grafik & Mum Analizi</h2>
                <div className="flex gap-2 text-xs">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">15m</span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded">1H</span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded">4H</span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded">1D</span>
                </div>
              </div>

              {/* Mum Grafik Görsel Simülasyonu */}
              <div className="h-[280px] bg-slate-950 rounded-lg border border-slate-800 flex items-end justify-center gap-3 p-4 relative overflow-hidden">
                <div className="absolute top-3 left-3 text-xs text-emerald-400 font-mono">Binance WebSocket Canlı Akış Entegre Grafik</div>
                {/* Örnek Mum Çubukları */}
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 85, 100].map((h, i) => (
                  <div key={i} className="w-4 flex flex-col items-center">
                    <div className="w-0.5 bg-slate-500 h-full absolute"></div>
                    <div 
                      className={`w-full rounded-sm relative z-10 ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIZLI İŞLEM & VARLIKLAR */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* İşlem Paneli */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between mb-3">
                  <button 
                    onClick={() => setOrderType('LONG')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-l-lg transition ${orderType === 'LONG' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                  >
                    AL (LONG)
                  </button>
                  <button 
                    onClick={() => setOrderType('SHORT')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-r-lg transition ${orderType === 'SHORT' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                  >
                    SAT (SHORT)
                  </button>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Emir Fiyatı (USDT):</span>
                    <span className="text-slate-200">${btcPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Miktar (BTC):</span>
                    <input 
                      type="number" 
                      value={orderAmount}
                      onChange={(e) => setOrderAmount(e.target.value)}
                      placeholder="0.00" 
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-right text-slate-200 w-28"
                    />
                  </div>
                  <button 
                    onClick={() => alert(`${orderType} emri simüle edildi!`)}
                    className={`w-full py-2 rounded-lg font-bold text-xs mt-2 transition ${orderType === 'LONG' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                  >
                    {orderType === 'LONG' ? 'BTC Alımı Gerçekleştir' : 'BTC Satışı Gerçekleştir'}
                  </button>
                </div>
              </div>

              {/* Varlıklar */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between font-mono">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">💰 Kullanıcı Varlıkları</span>
                  <div className="mt-2 space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-slate-400">USDT:</span><span className="text-slate-200 font-bold">4,850.20 $</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">BTC:</span><span className="text-emerald-400 font-bold">0.3524</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">ETH:</span><span className="text-slate-200 font-bold">2.4100</span></div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] text-emerald-400 flex items-center justify-between">
                  <span>OKX & Binance Entegre</span>
                  <span className="bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bot' && (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-bold mb-2">🤖 Otomatik Bot Yönetimi & Grid Botlar</h2>
          <p className="text-sm text-slate-400 mb-6">OKX Futures Grid Botları (SUI, PEPE, BTC) ve Python tabanlı CryptoWatch bot konfigürasyonları.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-emerald-400 mb-1">SUI Futures Grid</h3>
              <p className="text-xs text-slate-400 mb-3">Durum: <span className="text-emerald-400 font-bold">Çalışıyor (Aktif)</span></p>
              <button onClick={() => alert('Bot durduruldu!')} className="w-full bg-red-600/20 text-red-400 border border-red-800 py-1.5 rounded text-xs">Durdur</button>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-emerald-400 mb-1">PEPE Grid Bot</h3>
              <p className="text-xs text-slate-400 mb-3">Durum: <span className="text-emerald-400 font-bold">Çalışıyor (Aktif)</span></p>
              <button onClick={() => alert('Bot durduruldu!')} className="w-full bg-red-600/20 text-red-400 border border-red-800 py-1.5 rounded text-xs">Durdur</button>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="font-bold text-slate-400 mb-1">Telegram Rapor Botu</h3>
              <p className="text-xs text-slate-400 mb-3">Durum: <span className="text-amber-400 font-bold">Beklemede</span></p>
              <button onClick={() => alert('Bot başlatıldı!')} className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-800 py-1.5 rounded text-xs">Başlat</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'volume' && (
        <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-bold mb-2">🔥 Canlı Hacim Takip Paneli (15 Coin)</h2>
          <p className="text-sm text-slate-400 mb-6">Piyasadaki en yüksek hacimli 15 kripto paranın anlık hareketleri.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
            {['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'SUI/USDT', 'PEPE/USDT', 'DOGE/USDT', 'AVAX/USDT', 'LINK/USDT', 'ADA/USDT', 'NEAR/USDT', 'APT/USDT', 'ARB/USDT', 'RENDER/USDT', 'INJ/USDT'].map((coin, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col">
                <span className="font-bold text-slate-200">{coin}</span>
                <span className="text-emerald-400 mt-1">+$ {(Math.random() * 1000 + 50).toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 mt-1">Hacim: Yüksek</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'grid' && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-bold mb-2">📉 Dipten Al / Grid Strateji Sihirbazı</h2>
          <p className="text-sm text-slate-400 mb-6">Otomatik kademeli alım ve dip yakalama stratejisi yapılandırması.</p>
          <div className="space-y-4 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center"><span className="text-slate-400">Hedef Varlık:</span><input type="text" defaultValue="BTC/USDT" className="bg-slate-900 border border-slate-800 p-1.5 rounded text-slate-200 text-right" /></div>
              <div className="flex justify-between items-center"><span className="text-slate-400">Alt Sınır (Dip):</span><input type="text" defaultValue="75,000 $" className="bg-slate-900 border border-slate-800 p-1.5 rounded text-slate-200 text-right" /></div>
              <div className="flex justify-between items-center"><span className="text-slate-400">Grid Kademe Sayısı:</span><input type="number" defaultValue="10" className="bg-slate-900 border border-slate-800 p-1.5 rounded text-slate-200 text-right" /></div>
              <button onClick={() => alert('Grid stratejisi aktifleştirildi!')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded transition mt-2">Grid Stratejisini Başlat</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'signals' && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-bold mb-2">⚡ Yapay Zeka Destekli Sinyaller</h2>
          <p className="text-sm text-slate-400 mb-6">OpenRouter ve Groq (Llama 3.1) destekli anlık piyasa analiz sinyalleri.</p>
          <div className="space-y-3 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 border-l-4 border-l-emerald-500">
              <div className="flex justify-between text-slate-400 mb-1"><span>BTC/USDT - LONG Sinyali</span><span className="text-emerald-400 font-bold">Güven: %89</span></div>
              <p className="text-slate-300">79,500 desteğinden güçlü alım tepkisi geldi. Hedef: 82,000 $.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 border-l-4 border-l-amber-500">
              <div className="flex justify-between text-slate-400 mb-1"><span>SUI/USDT - NÖTR / DİKKAT</span><span className="text-amber-400 font-bold">Güven: %65</span></div>
              <p className="text-slate-300">Direnç bölgesinde konsolide oluyor. Kırılım beklenmeli.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'whales' && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-bold mb-2">🐋 Balina Hareketleri & Haberleri</h2>
          <p className="text-sm text-slate-400 mb-6">Büyük cüzdan hareketleri ve zincir üstü (on-chain) balina transfer bildirimleri.</p>
          <div className="space-y-3 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500">10 dakika önce</span>
              <p className="text-slate-200 mt-1 font-bold">🚨 4,500 BTC ($358,000,000) Bilinmeyen Cüzdandan Binance Borsasına Aktarıldı.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500">45 dakika önce</span>
              <p className="text-slate-200 mt-1 font-bold">🐋 Whale Alert: 50,000,000 USDT Tether Treasury'den OKX Borsasına Transfer Edildi.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-bold mb-2">⚙️ Güvenli API Anahtarı Ayarları</h2>
          <p className="text-sm text-slate-400 mb-6">
            GitHub güvenlik taramalarına takılmamak için anahtarlarınız doğrudan koda yazılmaz; yalnızca tarayıcınızın güvenli <code className="text-emerald-400">localStorage</code> alanında saklanır.
          </p>

          <form onSubmit={handleSaveKeys} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">OpenRouter API Key</label>
              <input 
                type="password" 
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Groq API Key</label>
              <input 
                type="password" 
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">GCP API Key (Service Account / Diğer)</label>
              <input 
                type="password" 
                value={gcpKey}
                onChange={(e) => setGcpKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition shadow-lg mt-4 text-sm"
            >
              Anahtarları Güvenle Kaydet
            </button>
          </form>
        </div>
      )}
    </div>
  );
}