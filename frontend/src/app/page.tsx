'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Uses Vercel env variable, or falls back directly to your active ngrok URL
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
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-indigo-400">CineAI</h1>
      </header>

      <main className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Discover Movies using <span className="text-indigo-500">Natural Language</span>
        </h2>
        <p className="text-slate-400 mb-8">
          Search with natural phrases like "cyberpunk thriller with plot twists"
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition"
          >
            {loading ? 'Searching...' : 'Ask AI'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {Array.isArray(results) &&
            results.map((movie: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="font-bold text-lg text-indigo-300">{movie.title || movie.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{movie.overview || movie.description}</p>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
