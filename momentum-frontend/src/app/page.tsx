
'use client'; 

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTrackName, setNewTrackName] = useState('');

  // Function to fetch tracks from the API
  const getTracks = async () => {
    const res = await fetch('http://localhost:8000/tracks', { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch tracks');
      setLoading(false);
      return;
    }
    const data = await res.json();
    setTracks(data);
    setLoading(false);
  };

  // useEffect runs this code once when the component first loads
  useEffect(() => {
    getTracks();
  }, []);

  // Function to handle creating a new track
  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!newTrackName) return;

    await fetch('http://localhost:8000/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTrackName }),
    });

    setNewTrackName(''); 
    getTracks(); 
  };

  
  const handleLogProgress = async (trackId: number) => {
    await fetch(`http://localhost:8000/tracks/${trackId}/log`, {
      method: 'POST',
    });
   
    console.log(`Logged progress for track ${trackId}`);
  };

 
  const handleDeleteTrack = async (trackId: number) => {
    await fetch(`http://localhost:8000/tracks/${trackId}`, {
      method: 'DELETE',
    });
    getTracks(); 
  };


  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-8">Momentum</h1>
      
      <div className="w-full max-w-md">
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

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4">Your Tracks</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <ul className="space-y-3">
              {tracks.length > 0 ? (
                tracks.map((track: any) => (
                  <li 
                    key={track.id} 
                    className="flex items-center justify-between bg-gray-700 p-4 rounded-md"
                  >
                    <span className="font-medium">{track.name}</span>
                    {/* --- NEW BUTTONS --- */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleLogProgress(track.id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 text-sm rounded-md"
                      >
                        Log
                      </button>
                      <button
                        onClick={() => handleDeleteTrack(track.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No tracks found. Go ahead and add one!</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}