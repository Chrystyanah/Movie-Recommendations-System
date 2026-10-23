'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fiddle-accent-lion.ngrok-free.dev';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/recommend/semantic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.recommendations || data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F4EE] text-[#122823]">
      {/* Sidebar - Dark Forest Green (#133E38) */}
      <aside className="w-64 bg-[#133E38] text-white p-6 flex flex-col justify-between hidden md:flex shadow-lg">
        <div>
          <div className="mb-10">
            <h1 className="text-xl font-bold tracking-wider uppercase text-[#E1A655]">CineAI</h1>
            <p className="text-xs text-emerald-200/70 mt-1 uppercase tracking-widest">Movie Support Kit</p>
          </div>

          <nav className="space-y-4 text-emerald-100/80 font-medium">
            <a href="#" className="block hover:text-white transition">Home</a>
            <a href="#" className="block hover:text-white transition">What's Inside</a>
            <a href="#" className="block hover:text-white transition">Watchlist</a>
            <a href="#" className="block hover:text-white transition">FAQ</a>
            <a href="#" className="block hover:text-white transition">About</a>
          </nav>
        </div>

        <div className="border-t border-emerald-800/80 pt-6">
          <h3 className="font-serif text-lg text-white mb-2">You're not alone.</h3>
          <p className="text-xs text-emerald-200/70 leading-relaxed">
            Finding the right movie for your mood shouldn't feel like endless scrolling.
          </p>
        </div>
      </aside>

      {/* Main Content Area - Warm Cream Background (#F5F4EE) */}
      <main className="flex-1 p-8 md:p-16 max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 md:hidden">
          <h1 className="text-2xl font-bold text-[#133E38]">CineAI</h1>
        </header>

        <section className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#526660]">Built With Care</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#122823] mt-2 mb-4 leading-tight">
            Discover movies without <br />
            <span className="italic font-normal text-[#133E38]">scrolling endlessly.</span>
          </h2>
          <p className="text-[#526660] text-lg max-w-xl">
            Search with natural phrases like "cyberpunk thriller with plot twists" or "heartwarming space journey".
          </p>
        </section>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10 max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what movie you want to watch..."
            className="flex-1 px-5 py-4 bg-white border border-[#133E38]/20 rounded-xl focus:outline-none focus:border-[#133E38] shadow-sm text-[#122823] placeholder-[#526660]/60"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-[#E1A655] hover:bg-[#d09544] text-[#122823] rounded-xl font-semibold transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Ask AI →'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 mb-6">
            {error}
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.isArray(results) &&
            results.map((movie: any, idx: number) => (
              <div key={idx} className="p-6 bg-white border border-[#133E38]/10 rounded-2xl shadow-sm hover:shadow-md transition">
                <h3 className="font-serif font-bold text-xl text-[#133E38] mb-2">{movie.title || movie.name}</h3>
                <p className="text-sm text-[#526660] leading-relaxed">{movie.overview || movie.description}</p>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
