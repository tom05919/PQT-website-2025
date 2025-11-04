"use client";
import { useEffect } from "react";

export default function LiveTicker() {
  useEffect(() => {
    const container = document.getElementById("tradingview-ticker");
    if (!container) return;

    // Clear previous widget (for hot reload in dev)
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
        { proName: "FOREXCOM:DJI", title: "Dow Jones" },
        { proName: "FOREXCOM:UKXGBP", title: "FTSE 100" },
        { proName: "INDEX:NKY", title: "Nikkei 225" },
        { proName: "CRYPTO:BTCUSD", title: "Bitcoin" },
        { proName: "CRYPTO:ETHUSD", title: "Ethereum" },
        { proName: "CRYPTO:SOLUSD", title: "Solana" },
        { proName: "NASDAQ:AAPL", title: "Apple" },
        { proName: "NASDAQ:TSLA", title: "Tesla" },
        { proName: "NASDAQ:NVDA", title: "NVIDIA" },
        { proName: "NYSE:BRK.B", title: "Berkshire Hathaway" },
        { proName: "BITSTAMP:XRPUSD", title: "XRP" },
      ],
      showSymbolLogo: true,
      colorTheme: "light",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en",
    });

    container.appendChild(script);
  }, []);

  return (
    <div
      className="w-screen border-y border-[#e2dcd6] bg-white/90 backdrop-blur-md fixed left-0 right-0 z-40"
      style={{ overflow: "hidden" }}
    >
      <div id="tradingview-ticker" className="!w-full" />
    </div>
  );
}