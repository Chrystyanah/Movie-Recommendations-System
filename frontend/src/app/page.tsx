'use client';

import { useState } from 'react';

type Movie = {
  id?: number | string;
  title?: string;
  name?: string;
  overview?: string;
  description?: string;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="home" className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="mb-10">
            <h1 className="text-xl font-bold tracking-wider uppercase text-accent">CineAI</h1>
            <p className="text-xs text-sidebar-foreground mt-1 uppercase tracking-widest">Your movie companion</p>
          </div>

          <nav aria-label="Main navigation" className="space-y-4 font-medium">
            <a href="#home" className="block hover:text-white focus-visible:outline-2 focus-visible:outline-accent rounded transition">Home</a>
            <a href="#discover" className="block hover:text-white focus-visible:outline-2 focus-visible:outline-accent rounded transition">Discover movies</a>
            <a href="#results" className="block hover:text-white focus-visible:outline-2 focus-visible:outline-accent rounded transition">Recommendations</a>
          </nav>
        </div>

        <div className="border-t border-sidebar-border pt-6">
          <h3 className="font-serif text-lg text-white mb-2">A movie for every mood.</h3>
          <p className="text-xs leading-relaxed">
            Finding the right movie for your mood shouldn&apos;t feel like endless scrolling.
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 w-full p-6 sm:p-8 md:p-12 lg:p-16 max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 md:hidden">
          <h1 className="text-2xl font-bold text-primary">CineAI</h1>
        </header>

        <section id="discover" className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Find your next favourite</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-2 mb-4 leading-tight">
            Discover movies without <br />
            <span className="italic font-normal text-primary">scrolling endlessly.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Search with natural phrases like &ldquo;cyberpunk thriller with plot twists&rdquo; or &ldquo;heartwarming space journey&rdquo;.
          </p>
        </section>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10 max-w-2xl">
          <label htmlFor="movie-query" className="sr-only">Describe the movie you want to watch</label>
          <input
            id="movie-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what movie you want to watch..."
            className="min-w-0 flex-1 px-5 py-4 bg-card border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background shadow-sm placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 px-8 py-4 bg-accent hover:bg-accent/85 text-accent-foreground rounded-xl font-semibold transition shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Ask AI →'}
          </button>
        </form>

        {error && (
          <div role="alert" className="p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 mb-6">
            {error}
          </div>
        )}

        <div id="results" aria-label="Movie recommendations" aria-live="polite" aria-busy={loading} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.isArray(results) &&
            results.map((movie, idx) => (
              <div key={movie.id ?? idx} className="p-6 bg-card text-card-foreground border border-border rounded-2xl shadow-sm hover:shadow-md transition">
                <h3 className="font-serif font-bold text-xl text-primary mb-2">{movie.title || movie.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{movie.overview || movie.description}</p>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
