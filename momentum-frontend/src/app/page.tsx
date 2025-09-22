
'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-8">Momentum</h1>
      <TracksManager />
    </main>
  );
}



function TracksManager() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTrackName, setNewTrackName] = useState('');

  
  useEffect(() => {
    async function getTracks() {
      const res = await fetch('http://localhost:8000/tracks', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch tracks');
      }
      const data = await res.json();
      setTracks(data);
      setLoading(false);
    }

    getTracks();
  }, []); 

  async function handleCreateTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!newTrackName) return;

    await fetch('http://localhost:8000/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTrackName }),
    });

    setNewTrackName('');
    
    async function getTracks() {
      const res = await fetch('http://localhost:8000/tracks', { cache: 'no-store' });
      const data = await res.json();
      setTracks(data);
    }
    getTracks();
  }

  if (loading) {
    return <p className="text-gray-400">Loading tracks...</p>;
  }

  return (
    <div className="w-full max-w-md">
      {/* Form for adding a new track */}
      <form onSubmit={handleCreateTrack} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTrackName}
          onChange={(e) => setNewTrackName(e.target.value)}
          placeholder="Enter a new track..."
          className="flex-grow bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md font-semibold">
          Add Track
        </button>
      </form>

      {/* List of existing tracks */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Your Tracks</h2>
        <ul className="space-y-3">
          {tracks.length > 0 ? (
            tracks.map((track: any) => (
              <li key={track.id} className="bg-gray-700 p-4 rounded-md">
                {track.name}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No tracks found. Go ahead and add one!</p>
          )}
        </ul>
      </div>
    </div>
  );
}