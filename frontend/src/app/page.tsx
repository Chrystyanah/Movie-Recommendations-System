'use client';

import { value, state } from 'react';
import { useState } from 'react';

export default function Home() {
 5 const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL7/api/v1/recommend/semantic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JON.stringify({ query }),
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
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg6 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            F—6&ÆVC÷¶ÆöF–æwÐ¢6Æ74æÖSÒ'‚Ób’Ó2&rÖ–æF–vòÓc†÷fW#¦&rÖ–æF–vòÓS&÷VæFVBÖÆrföçBÖÖVF—VÒG&ç6—F–öâ ¢à¢¶ÆöF–æròu6V&6†–ærâââr¢t6²’wÐ¢Âö'WGFöãà¢Âöf÷&Óà ¢·w'&÷"bb€¢ÆF—b6Æ74æÖSÒ'ÓB&r×&VBÓ“óC&÷&FW"&÷&FW"×&VBÓSóS&÷VæFVBÖÆrFW‡B×&VBÓ#Ö"Ób#à¢¶W'&÷'Ð¢ÂöF—cà¢—Ð ¢ÆF—b6Æ74æÖSÒ&w&–Bw&–BÖ6öÇ2ÓÖC¦w&–BÖ6öÇ2Ó"vÓBFW‡BÖÆVgB#à¢´'&’æ—4'&’‡&W7VÇG2’b`¢&W7VÇG2æÖ‚†Ö÷f–S¢ç’Â–Gƒ¢çVÖ&W"’Óâ€¢ÆF—b¶W“×¶–G‡Ò6Æ74æÖSÒ'ÓB&r×6ÆFRÓ“&÷&FW"&÷&FW"×6ÆFRÓƒ&÷VæFVBÖÆr#à¢Æƒ26Æ74æÖSÒ&föçBÖ&öÆBFW‡BÖÆrFW‡BÖ–æF–vòÓ3#ç¶Ö÷f–RçF—FÆRÇÂÖ÷f–RææÖWÓÂöƒ3à¢Ç6Æ74æÖSÒ'FW‡B×6ÒFW‡B×6ÆFRÓC×BÓ#÷¶Ö÷f–Ræ÷fW'f–WrÇÂÖ÷f–RæFW67&—F–öçÓÂ÷à¢ÂöF—cà¢’—Ð¢ÂöF—cà¢ÂöÖ–ãà¢ÂöF—cà¢“°§Ð 