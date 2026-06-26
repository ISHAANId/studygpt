import { useState, useEffect } from 'react';
import { Mic, Volume2, Bot, User, Square } from 'lucide-react';

interface DialogLine {
  sender: 'user' | 'bot';
  text: string;
}

export default function Voice() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<DialogLine[]>([
    { sender: 'bot', text: 'Hey there! Tap the mic to ask me a quick study question using voice.' }
  ]);
  const [pulseScale, setPulseScale] = useState(1);

  // Micro wave pulse animation
  useEffect(() => {
    let anim: any;
    if (isRecording) {
      anim = setInterval(() => {
        setPulseScale(prev => (prev === 1 ? 1.25 : 1));
      }, 500);
    } else {
      setPulseScale(1);
    }
    return () => clearInterval(anim);
  }, [isRecording]);

  const handleStartVoice = () => {
    setIsRecording(true);
    
    // Simulate recording end & translation after 4s
    setTimeout(() => {
      setIsRecording(false);
      setTranscript(prev => [
        ...prev,
        { sender: 'user', text: 'Explain eigenvectors geometrically' },
        { sender: 'bot', text: 'An eigenvector is a vector whose direction does not change when a linear transformation is applied to it. Geometrically, if you stretch or warp space, vectors along the eigenvector line only get scaled (stretched or shrunk) but keep pointing in the exact same or exact opposite direction!' }
      ]);
    }, 4000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-100px)]">
      {/* Left panel: mic controls */}
      <div className="lg:w-96 bg-white border border-primary/5 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center gap-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-primary flex items-center justify-center gap-2">
            <Mic size={24} className="text-accent1" />
            Voice Assistant
          </h2>
          <p className="text-sm text-gray-500 mt-1">Converse with StudyGPT hands-free.</p>
        </div>

        {/* Pulse micro button */}
        <div className="relative my-8 flex items-center justify-center">
          {isRecording && (
            <>
              <div 
                className="absolute w-36 h-36 bg-accent1/25 rounded-full animate-ping duration-1000"
              ></div>
              <div 
                className="absolute w-28 h-28 bg-accent1/20 rounded-full transition-transform duration-500"
                style={{ transform: `scale(${pulseScale})` }}
              ></div>
            </>
          )}
          
          <button
            onClick={isRecording ? handleStopRecording : handleStartVoice}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isRecording 
                ? 'bg-gradient-to-r from-accent1 to-accent2 hover:scale-95 text-white' 
                : 'bg-primary hover:bg-gradient-to-r hover:from-accent1 hover:to-accent2 text-white hover:scale-105'
            }`}
          >
            {isRecording ? <Square size={32} className="fill-white" /> : <Mic size={36} />}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">
            {isRecording ? 'Listening for speech...' : 'Microphone Ready'}
          </p>
          <p className="text-xs text-gray-400 max-w-xs leading-normal">
            {isRecording 
              ? 'Speak clearly into your microphone. Tap the square button to stop recording and process.' 
              : 'Press the microphone icon to begin speaking. Say something like "What is the rank of a matrix?"'}
          </p>
        </div>

        {/* Audio Wave Bars (CSS simulation) */}
        {isRecording && (
          <div className="flex justify-center items-end gap-1.5 h-8 mt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
              <span 
                key={bar} 
                className="w-1.5 bg-accent1 rounded-full animate-pulse"
                style={{ 
                  height: `${Math.floor(Math.random() * 28) + 8}px`,
                  animationDuration: `${Math.random() * 600 + 400}ms`
                }}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* Right panel: Transcript */}
      <div className="flex-1 bg-white border border-primary/5 rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden">
        <h3 className="font-bold text-primary flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <Volume2 size={20} className="text-accent2" /> Conversation Transcript
        </h3>

        <div className="flex-1 overflow-y-auto space-y-4 max-h-[500px] pr-2">
          {transcript.map((line, index) => (
            <div 
              key={index} 
              className={`flex gap-3 max-w-[85%] ${
                line.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 ${
                line.sender === 'user' ? 'bg-gradient-to-r from-accent1 to-accent2' : 'bg-primary'
              }`}>
                {line.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm leading-relaxed text-sm ${
                line.sender === 'user' 
                  ? 'bg-gradient-to-r from-accent1 to-accent2 text-white rounded-tr-none' 
                  : 'bg-bg/40 text-primary border border-primary/5 rounded-tl-none'
              }`}>
                <p>{line.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
