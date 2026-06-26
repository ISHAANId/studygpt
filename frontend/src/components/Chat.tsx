import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, UploadCloud, FileText, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function Chat() {
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am StudyGPT, your AI study companion. Please upload a PDF of your study notes or slides so we can discuss them together!',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSimulatedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setLoadingNotes(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/upload`, {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error("Failed to process document");
        }

        await response.json();
        setLoadingNotes(false);
        setNotesLoaded(true);
        setMessages(prev => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: 'bot',
            text: `✨ Successfully processed "${file.name}"! I have analyzed the document and extracted the main topics. You can now ask me questions!`,
            timestamp: new Date()
          }
        ]);
      } catch (err: any) {
        // Fallback: demo mode when backend is unreachable (e.g. deployed on Vercel)
        setTimeout(() => {
          setLoadingNotes(false);
          setNotesLoaded(true);
          setMessages(prev => [
            ...prev,
            {
              id: `sys-${Date.now()}`,
              sender: 'bot',
              text: `✨ Loaded "${file.name}" in demo mode! The AI backend is not connected, so I'll use built-in sample responses. To get full AI-powered answers, run the FastAPI backend locally with:\n\n  python server.py\n\nThen use the app at http://localhost:5173`,
              timestamp: new Date()
            }
          ]);
        }, 1500);
      }
    }
  };

  const loadSampleNotes = async () => {
    setFileName('Linear_Algebra_Notes.pdf');
    setLoadingNotes(true);

    // Simulate fetching sample PDF
    setTimeout(() => {
      setLoadingNotes(false);
      setNotesLoaded(true);
      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'bot',
          text: '✨ Loaded sample Linear Algebra notes. You can now chat or test yourself on them!',
          timestamp: new Date()
        }
      ]);
    }, 1000);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: data.answer || "No response received.",
          timestamp: new Date()
        }
      ]);
    } catch {
      // Demo mode fallback when backend is unreachable
      const q = text.toLowerCase();
      let demoAnswer = '';

      if (q.includes('vector space') || q.includes('vector spaces')) {
        demoAnswer = 'A vector space V over a field F is a set equipped with two operations — vector addition and scalar multiplication — satisfying 10 axioms including closure, associativity, commutativity, existence of identity and inverse elements, and distributivity.\n\nExample: ℝⁿ is a vector space over ℝ.';
      } else if (q.includes('eigenvalue') || q.includes('eigen')) {
        demoAnswer = 'An eigenvalue λ of a matrix A is a scalar such that Av = λv for some non-zero vector v (the eigenvector). They are found by solving det(A - λI) = 0, known as the characteristic equation.';
      } else if (q.includes('subspace')) {
        demoAnswer = 'A subspace W of a vector space V is a subset that is itself a vector space. To verify, check three conditions:\n1. The zero vector is in W\n2. W is closed under addition\n3. W is closed under scalar multiplication';
      } else if (q.includes('basis') || q.includes('dimension')) {
        demoAnswer = 'A basis of a vector space V is a set of vectors that is both linearly independent and spans V. The number of vectors in any basis is called the dimension of V. All bases of a given vector space have the same cardinality.';
      } else if (q.includes('linear transformation') || q.includes('transformation')) {
        demoAnswer = 'A linear transformation T: V → W preserves addition and scalar multiplication:\n• T(u + v) = T(u) + T(v)\n• T(cv) = cT(v)\n\nEvery linear transformation between finite-dimensional spaces can be represented by a matrix.';
      } else if (q.includes('rank') || q.includes('nullity')) {
        demoAnswer = 'The Rank-Nullity Theorem states: dim(Ker T) + dim(Range T) = dim(V), where T: V → W is a linear transformation. The rank is the dimension of the image, and the nullity is the dimension of the kernel.';
      } else {
        demoAnswer = `Great question about "${text}"! I'm currently running in demo mode without the AI backend connected. To get full AI-powered answers from your uploaded notes:\n\n1. Run the backend: python server.py\n2. Use the local app: http://localhost:5173\n\nThe backend uses Ollama (llama3.2) with RAG to answer from your actual PDF notes.`;
      }

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            sender: 'bot',
            text: demoAnswer,
            timestamp: new Date()
          }
        ]);
      }, 800);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    'Explain the concept of Vector Subspaces',
    'What is the characteristic equation for Eigenvalues?',
    'Give me a summary of Chapter 2'
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      {/* Left side: Notes uploader */}
      <div className="lg:w-80 bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-6 border border-primary/5">
        <div>
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <FileText size={20} className="text-accent1" />
            Study Notes
          </h2>
          <p className="text-sm text-gray-500 mt-1">Upload slides or syllabus files to query.</p>
        </div>

        {!notesLoaded ? (
          <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-accent2/30 rounded-xl p-6 bg-bg/20 text-center hover:bg-bg/40 transition-colors">
            {loadingNotes ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent1"></div>
                <p className="text-sm font-medium text-primary">Analyzing PDF structure...</p>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-3">
                <UploadCloud size={44} className="text-accent1 animate-bounce" />
                <span className="text-sm font-semibold text-primary">Click to select PDF</span>
                <span className="text-xs text-gray-400">PDF up to 10MB</span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleSimulatedUpload}
                />
              </label>
            )}

            <div className="w-full border-t border-gray-100 my-4"></div>
            <button
              onClick={loadSampleNotes}
              className="text-xs font-semibold text-accent1 hover:text-accent2 hover:underline transition-all"
            >
              Try sample PDF
            </button>
          </div>
        ) : (
          <div className="flex-1 bg-gradient-to-br from-white to-bg/30 border border-accent3 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent3/40 text-accent1 rounded-lg">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary truncate">{fileName}</p>
                <p className="text-xs text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Ready
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-xs text-gray-600">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Total Words:</span>
                <span className="font-semibold text-primary">4,280</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Extracted Topics:</span>
                <span className="font-semibold text-primary">3 Areas</span>
              </div>
            </div>

            <button
              onClick={() => {
                setNotesLoaded(false);
                setFileName('');
              }}
              className="mt-6 w-full text-xs font-semibold py-2 px-3 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              Remove Document
            </button>
          </div>
        )}
      </div>

      {/* Right side: Chat client */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden border border-primary/5">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-bg/40 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent1/10 flex items-center justify-center text-accent1">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-bold text-primary">Chat with StudyGPT</h3>
              <p className="text-xs text-gray-500">Retrieval-Augmented Study Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent1 bg-accent3/30 px-2.5 py-1 rounded-full">
            <Sparkles size={14} /> AI Active
          </div>
        </div>

        {/* Message Panel */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${msg.sender === 'user'
                ? 'bg-gradient-to-r from-accent1 to-accent2'
                : 'bg-primary'
                }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${msg.sender === 'user'
                ? 'bg-gradient-to-r from-accent1 to-accent2 text-white rounded-tr-none'
                : 'bg-white border border-gray-100 text-primary rounded-tl-none'
                }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] mt-1.5 block text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                  }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-500 rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion list */}
        {notesLoaded && messages.length <= 3 && !isTyping && (
          <div className="px-6 py-2 bg-gray-50/50 flex flex-wrap gap-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="text-xs bg-white hover:bg-accent3/20 border border-gray-200 text-accent1 hover:border-accent1 font-medium px-3 py-1.5 rounded-full transition-all"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Message Input bar */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={notesLoaded ? "Ask a question about your notes..." : "Please upload a document to begin"}
              className="flex-1 bg-gray-50 focus:bg-white text-sm text-primary placeholder-gray-400 border border-gray-200 focus:border-accent1 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent1 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-primary hover:bg-gradient-to-r hover:from-accent1 hover:to-accent2 text-white p-3 rounded-xl disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
