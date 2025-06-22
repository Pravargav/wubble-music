import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Heart, Moon, Sun, Music, Zap, Volume2 } from 'lucide-react';

// Mock API data - simulating backend responses
const MOODS = [
  { id: 'happy', label: 'Happy', icon: '😊', color: 'bg-yellow-500' },
  { id: 'sad', label: 'Sad', icon: '😢', color: 'bg-blue-500' },
  { id: 'energetic', label: 'Energetic', icon: '⚡', color: 'bg-red-500' },
  { id: 'chill', label: 'Chill', icon: '😎', color: 'bg-green-500' }
];

const GENRES = [
  { id: 'pop', label: 'Pop', icon: '🎵' },
  { id: 'lofi', label: 'Lo-fi', icon: '🌙' },
  { id: 'cinematic', label: 'Cinematic', icon: '🎬' },
  { id: 'edm', label: 'EDM', icon: '🔊' }
];

// Mock track database - simulating royalty-free tracks
const MOCK_TRACKS = [
  {
    id: 1,
    title: "Sunny Day Vibes",
    mood: "happy",
    genre: "pop",
    duration: "2:30",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    artist: "AI Composer"
  },
  {
    id: 2,
    title: "Midnight Thoughts",
    mood: "sad",
    genre: "lofi",
    duration: "3:15",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    artist: "Neural Networks"
  },
  {
    id: 3,
    title: "Electric Storm",
    mood: "energetic",
    genre: "edm",
    duration: "2:45",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    artist: "Beat Bot"
  },
  {
    id: 4,
    title: "Ocean Waves",
    mood: "chill",
    genre: "lofi",
    duration: "4:00",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    artist: "Ambient AI"
  },
  {
    id: 5,
    title: "Epic Journey",
    mood: "energetic",
    genre: "cinematic",
    duration: "3:30",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    artist: "Orchestra Bot"
  },
  {
    id: 6,
    title: "Rainy Day Blues",
    mood: "sad",
    genre: "pop",
    duration: "2:50",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    artist: "Melody Maker"
  },
  {
    id: 7,
    title: "Summer Party",
    mood: "happy",
    genre: "edm",
    duration: "3:20",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    artist: "Festival AI"
  },
  {
    id: 8,
    title: "Peaceful Mountain",
    mood: "chill",
    genre: "cinematic",
    duration: "4:15",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    artist: "Nature Sounds"
  }
];

function App() {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [likedTracks, setLikedTracks] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const audioRef = useRef(null);

  // Load saved data from memory (simulating localStorage)
  useEffect(() => {
    // In a real app, you'd load from localStorage here
    // For this demo, we'll use in-memory storage
  }, []);

  // Mock API call to generate track
  const generateTrack = async () => {
    if (!selectedMood || !selectedGenre) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 100);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(progressInterval);
    setGenerationProgress(100);

    // Filter tracks by mood and genre, or get random if no match
    const matchingTracks = MOCK_TRACKS.filter(
      track => track.mood === selectedMood && track.genre === selectedGenre
    );
    
    const availableTracks = matchingTracks.length > 0 ? matchingTracks : MOCK_TRACKS;
    const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
    
    // Add to recent tracks
    const updatedRecent = [randomTrack, ...recentTracks.filter(t => t.id !== randomTrack.id)].slice(0, 5);
    setRecentTracks(updatedRecent);
    
    setCurrentTrack(randomTrack);
    setIsGenerating(false);
    setGenerationProgress(0);
  };

  const generateUniqueAudio = (mood, genre) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Define mood-based characteristics
    const moodConfigs = {
      happy: { baseFreq: 523.25, tempo: 120, major: true }, // C5, upbeat
      sad: { baseFreq: 261.63, tempo: 70, major: false },   // C4, slow, minor
      energetic: { baseFreq: 659.25, tempo: 140, major: true }, // E5, fast
      chill: { baseFreq: 329.63, tempo: 80, major: true }   // E4, relaxed
    };
    
    // Define genre-based patterns
    const genreConfigs = {
      pop: { pattern: [1, 0.8, 1.2, 0.9], effects: 'bright' },
      lofi: { pattern: [1, 0.7, 0.9, 0.6], effects: 'warm' },
      cinematic: { pattern: [1, 1.5, 0.8, 1.8], effects: 'epic' },
      edm: { pattern: [1, 1.3, 1.1, 1.4], effects: 'electronic' }
    };

    const moodConfig = moodConfigs[mood] || moodConfigs.happy;
    const genreConfig = genreConfigs[genre] || genreConfigs.pop;
    
    // Create multiple oscillators for harmony
    const oscillators = [];
    const gainNodes = [];
    const duration = 3; // 3 second preview
    
    // Main melody
    for (let i = 0; i < 4; i++) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      // Calculate frequency based on mood and genre
      const frequency = moodConfig.baseFreq * genreConfig.pattern[i];
      const startTime = audioContext.currentTime + (i * 0.5);
      const noteLength = 60 / moodConfig.tempo; // Note length based on tempo
      
      // Set waveform based on genre
      switch (genre) {
        case 'edm':
          osc.type = 'sawtooth';
          break;
        case 'lofi':
          osc.type = 'triangle';
          break;
        case 'cinematic':
          osc.type = 'sine';
          break;
        default:
          osc.type = 'square';
      }
      
      osc.frequency.setValueAtTime(frequency, startTime);
      
      // Add some frequency modulation for interest
      if (mood === 'energetic') {
        osc.frequency.exponentialRampToValueAtTime(frequency * 1.1, startTime + noteLength / 2);
        osc.frequency.exponentialRampToValueAtTime(frequency, startTime + noteLength);
      }
      
      // Volume envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteLength);
      
      osc.start(startTime);
      osc.stop(startTime + noteLength);
      
      oscillators.push(osc);
      gainNodes.push(gain);
    }
    
    // Add bass line for certain genres
    if (genre === 'edm' || genre === 'pop') {
      const bassOsc = audioContext.createOscillator();
      const bassGain = audioContext.createGain();
      
      bassOsc.connect(bassGain);
      bassGain.connect(audioContext.destination);
      
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(moodConfig.baseFreq / 2, audioContext.currentTime);
      
      bassGain.gain.setValueAtTime(0.05, audioContext.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      bassOsc.start(audioContext.currentTime);
      bassOsc.stop(audioContext.currentTime + duration);
    }
    
    // Auto-stop playing after duration
    setTimeout(() => {
      setIsPlaying(false);
    }, duration * 1000);
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      generateUniqueAudio(currentTrack.mood, currentTrack.genre);
    }
  };

  const downloadTrack = () => {
    if (!currentTrack) return;
    
    // Simulate download - in a real app, this would download the actual file
    const link = document.createElement('a');
    link.href = currentTrack.url;
    link.download = `${currentTrack.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleLike = () => {
    if (!currentTrack) return;
    
    const isLiked = likedTracks.some(track => track.id === currentTrack.id);
    if (isLiked) {
      setLikedTracks(likedTracks.filter(track => track.id !== currentTrack.id));
    } else {
      setLikedTracks([...likedTracks, currentTrack]);
    }
  };

  const isTrackLiked = currentTrack && likedTracks.some(track => track.id === currentTrack.id);

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-50 to-blue-50 text-gray-900'}`}>
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Wubble QuickTune Mini
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI Music Preview Generator
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Mood Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-500" />
              Choose Your Mood
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedMood === mood.id
                      ? `border-purple-500 ${mood.color} text-white shadow-xl`
                      : isDarkMode
                      ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      : 'border-gray-200 bg-white hover:border-gray-300 shadow-lg'
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.icon}</div>
                  <div className="font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Genre Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2 text-purple-500" />
              Select Genre
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedGenre === genre.id
                      ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl'
                      : isDarkMode
                      ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      : 'border-gray-200 bg-white hover:border-gray-300 shadow-lg'
                  }`}
                >
                  <div className="text-3xl mb-2">{genre.icon}</div>
                  <div className="font-medium">{genre.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <button
              onClick={generateTrack}
              disabled={!selectedMood || !selectedGenre || isGenerating}
              className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                selectedMood && selectedGenre && !isGenerating
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Magic...</span>
                </div>
              ) : (
                'Generate Track'
              )}
            </button>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="mt-4 max-w-md mx-auto">
                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {generationProgress < 30 ? 'Analyzing mood...' : 
                   generationProgress < 60 ? 'Composing melody...' :
                   generationProgress < 90 ? 'Adding harmonies...' : 'Finalizing track...'}
                </p>
              </div>
            )}
          </div>

          {/* Track Preview */}
          {currentTrack && (
            <div className={`p-8 rounded-3xl shadow-2xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{currentTrack.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    by {currentTrack.artist} • {currentTrack.duration}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {MOODS.find(m => m.id === currentTrack.mood)?.label}
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                    {GENRES.find(g => g.id === currentTrack.genre)?.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>

                <button
                  onClick={toggleLike}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isTrackLiked
                      ? 'bg-red-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className="w-6 h-6" fill={isTrackLiked ? 'currentColor' : 'none'} />
                </button>

                <button
                  onClick={downloadTrack}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Download className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Recent Tracks */}
          {recentTracks.length > 0 && (
            <div className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Recent Tracks</h3>
              <div className="space-y-3">
                {recentTracks.map((track) => (
                  <div
                    key={track.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentTrack(track)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {track.artist} • {track.duration}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                          {MOODS.find(m => m.id === track.mood)?.label}
                        </span>
                        <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs">
                          {GENRES.find(g => g.id === track.genre)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Hidden audio element for future use */}
      <audio ref={audioRef} />
    </div>
  );
}

export default App;