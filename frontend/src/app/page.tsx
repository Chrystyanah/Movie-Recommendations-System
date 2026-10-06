"use client";

import { useState } from "react";
import { Search, Sparkles, Film, Loader2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Movie {
  id: string;
  title: string;
  overview: string;
  release_year?: string;
  ai_explanation?: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/recommend/semantic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: 6 }),
      });
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Header / Navbar */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Film className="w-8 h-8 text-indigo-500" />
          <h1 className="text-2xl font-bold tracking-tight">CineAI</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="text-slate-300">Watchlist</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">Sign In</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto text-center my-12">
        <h2 className="text-4xl font-extrabold mb-4">
          Discover Movies using <span className="text-indigo-400">Natural Language</span>
        </h2>
        <p className="text-slate-400 mb-8">
          Search with natural phrases like "cyberpunk thriller with plot twists" or "heartwarming space travel".
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe what movie you want to watch..."
              className="pl-10 h-11 bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 h-11 px-6 font-medium"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Ask AI
          </Button>
        </form>
      </section>

      {/* Recommendations Grid */}
      <section className="max-w-6xl mx-auto mt-16">
        {movies.length > 0 && (
          <h3 className="text-xl font-bold mb-6 text-slate-200">Recommended for You</h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className="bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer transition flex flex-col justify-between"
            >
              <CardHeader>
                <CardTitle className="text-indigo-300">{movie.title}</CardTitle>
                {movie.release_year && (
                  <CardDescription className="text-slate-500">{movie.release_year}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 line-clamp-3">{movie.overview}</p>
              </CardContent>
              {movie.ai_explanation && (
                <CardFooter className="pt-2">
                  <div className="bg-indigo-950/50 border border-indigo-800/50 rounded-lg p-3 text-xs text-indigo-200 flex items-start gap-2 w-full">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{movie.ai_explanation}</span>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Movie Detail Dialog Modal */}
      <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl text-indigo-300">{selectedMovie?.title}</DialogTitle>
            <DialogDescription className="text-slate-400 mt-2">
              {selectedMovie?.overview}
            </DialogDescription>
          </DialogHeader>
          {selectedMovie?.ai_explanation && (
            <div className="bg-indigo-950/60 border border-indigo-800/60 rounded-lg p-3 text-sm text-indigo-200 flex items-start gap-2 my-2">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-indigo-300 mb-1">Why AI Recommended This:</p>
                <p>{selectedMovie.ai_explanation}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <BookmarkPlus className="w-4 h-4 mr-2" /> Add to Watchlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
