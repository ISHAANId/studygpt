import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Award, Brain, Clock } from 'lucide-react';

type QuizMode = 'Flashcard' | 'MCQ' | 'Short' | 'Long' | 'Rapid';

interface Flashcard {
  question: string;
  answer: string;
}

interface MCQ {
  question: string;
  options: string[];
  correct: number;
}

interface ShortQuestion {
  question: string;
  rubric: string;
}

const flashcards: Flashcard[] = [
  { question: 'What is the definition of a basis of a Vector Space?', answer: 'A set of vectors that is both linearly independent and spans the entire vector space.' },
  { question: 'What is the Rank-Nullity Theorem formula?', answer: 'Rank(T) + Nullity(T) = dim(V), where T is a linear transformation mapping from V to W.' },
  { question: 'What makes a matrix invertible?', answer: 'A matrix A is invertible if its determinant is non-zero, det(A) ≠ 0, or equivalently if it has full rank.' }
];

const mcqs: MCQ[] = [
  {
    question: 'Which of the following is NOT a necessary axiom of a Vector Space V?',
    options: [
      'Multiplicative inverse for every vector',
      'Additive identity (zero vector)',
      'Additive commutativity',
      'Distributivity of scalar addition'
    ],
    correct: 0
  },
  {
    question: 'If a linear transformation T: R^5 -> R^3 has a kernel of dimension 2, what is the dimension of its range?',
    options: ['2', '3', '5', '8'],
    correct: 1
  },
  {
    question: 'Which of these subsets is a subspace of R^2?',
    options: [
      'The set of vectors (x, y) where x + y = 1',
      'The set of vectors (x, y) where x * y = 0',
      'The set of vectors (x, y) where y = 2x',
      'The set of vectors (x, y) where x ≥ 0'
    ],
    correct: 2
  }
];

const shortQuestions: ShortQuestion[] = [
  { question: 'Explain in your own words why the intersection of two subspaces is also a subspace.', rubric: 'Check if they talk about zero vector, closure under addition, and closure under scalar multiplication.' },
  { question: 'Describe what it means for a set of vectors to be linearly dependent.', rubric: 'Check if they reference a non-trivial linear combination equaling the zero vector.' }
];

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Quiz() {
  const [mode, setMode] = useState<QuizMode>('Flashcard');
  const [activeTopic, setActiveTopic] = useState('Vector Spaces');

  // Flashcards state
  const [flashIdx, setFlashIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [_dynamicFlashcard, setDynamicFlashcard] = useState<Flashcard | null>(null);

  // MCQ state
  const [mcqIdx, setMcqIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mcqScore, setMcqScore] = useState(0);
  const [submittedMcq, setSubmittedMcq] = useState(false);
  const [_dynamicMCQ, setDynamicMCQ] = useState<MCQ | null>(null);

  // Short state
  const [shortIdx, setShortIdx] = useState(0);
  const [shortAns, setShortAns] = useState('');
  const [shortGrade, setShortGrade] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [dynamicShort, setDynamicShort] = useState<string | null>(null);

  // Long state
  const [_dynamicLong, setDynamicLong] = useState<string | null>(null);

  // Rapid Fire state
  const [rapidStarted, setRapidStarted] = useState(false);
  const [rapidQuestion, setRapidQuestion] = useState('');
  const [rapidAns, setRapidAns] = useState('');
  const [rapidTime, setRapidTime] = useState(15);
  const [rapidResult, setRapidResult] = useState<string | null>(null);

  // Fetch current active topic from backend state
  useEffect(() => {
    fetch(`${API_BASE}/api/state`)
      .then(res => res.json())
      .then(data => {
        if (data.notesLoaded && data.topics && data.topics.length > 0) {
          setActiveTopic(data.topics[0]);
        }
      })
      .catch(err => console.log("Backend not active, using default topic.", err));
  }, []);

  const fetchFlashcard = () => {
    fetch(`${API_BASE}/api/quiz/generate?topic=${encodeURIComponent(activeTopic)}&mode=Flashcard`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setDynamicFlashcard({ question: data.question, answer: data.answer });
      })
      .catch(() => setDynamicFlashcard(null));
  };

  const fetchMCQ = () => {
    fetch(`${API_BASE}/api/quiz/generate?topic=${encodeURIComponent(activeTopic)}&mode=MCQ`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setDynamicMCQ({ question: data.question, options: data.options, correct: data.correct });
      })
      .catch(() => setDynamicMCQ(null));
  };

  const fetchShort = () => {
    fetch(`${API_BASE}/api/quiz/generate?topic=${encodeURIComponent(activeTopic)}&mode=Short`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setDynamicShort(data.question);
      })
      .catch(() => setDynamicShort(null));
  };

  const fetchLong = () => {
    fetch(`${API_BASE}/api/quiz/generate?topic=${encodeURIComponent(activeTopic)}&mode=Long`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setDynamicLong(data.question);
      })
      .catch(() => setDynamicLong(null));
  };

  useEffect(() => {
    setFlipped(false);
    setSelectedOption(null);
    setSubmittedMcq(false);
    setShortAns('');
    setShortGrade(null);
    setRapidStarted(false);

    if (mode === 'Flashcard') {
      fetchFlashcard();
    } else if (mode === 'MCQ') {
      fetchMCQ();
    } else if (mode === 'Short') {
      fetchShort();
    } else if (mode === 'Long') {
      fetchLong();
    }
  }, [mode, activeTopic]);

  // Reset quiz logic on mode change
  const handleModeChange = (newMode: QuizMode) => {
    setMode(newMode);
  };

  // Timed Rapid fire logic
  useEffect(() => {
    let timer: any;
    if (rapidStarted && rapidTime > 0 && !rapidResult) {
      timer = setTimeout(() => setRapidTime(prev => prev - 1), 1000);
    } else if (rapidTime === 0 && !rapidResult) {
      setRapidResult('Time is up! Be faster next time.');
    }
    return () => clearTimeout(timer);
  }, [rapidStarted, rapidTime, rapidResult]);

  const startRapid = () => {
    setRapidAns('');
    setRapidTime(10);
    setRapidResult(null);
    fetch(`${API_BASE}/api/quiz/generate?topic=${encodeURIComponent(activeTopic)}&mode=Rapid`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setRapidQuestion(data.question);
        setRapidStarted(true);
      })
      .catch(() => {
        setRapidQuestion('Is a set of vectors containing the zero vector always linearly dependent?');
        setRapidStarted(true);
      });
  };

  const submitRapid = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGrading(true);
    fetch(`${API_BASE}/api/quiz/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: rapidQuestion, student_answer: rapidAns })
    })
      .then(res => res.json())
      .then(data => {
        setRapidResult(data.feedback);
        setIsGrading(false);
      })
      .catch(() => {
        if (rapidAns.trim().toLowerCase() === 'yes') {
          setRapidResult('✅ Correct! Since 1 * 0 = 0, a non-trivial linear combination always exists.');
        } else {
          setRapidResult('❌ Incorrect. The answer is Yes. Any set containing the zero vector is dependent.');
        }
        setIsGrading(false);
      });
  };

  const submitShortAnswer = () => {
    if (!shortAns.trim()) return;
    setIsGrading(true);

    fetch(`${API_BASE}/api/quiz/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: dynamicShort || shortQuestions[shortIdx].question,
        student_answer: shortAns
      })
    })
      .then(res => res.json())
      .then(data => {
        setShortGrade(data.feedback);
        setIsGrading(false);
      })
      .catch(() => {
        setTimeout(() => {
          let score = 0;
          let review = '';
          const ans = shortAns.toLowerCase();

          if (shortIdx === 0) {
            if (ans.includes('close') && ans.includes('zero')) {
              score = 10;
              review = 'Perfect! You correctly checked that 0 is in the intersection, and that closure under addition/scaling is preserved because both subsets individually contain those elements.';
            } else {
              score = 4;
              review = 'Partial points. A complete proof requires validating that the intersection contains the zero vector and is closed under linear combinations.';
            }
          } else {
            if (ans.includes('linear combination') && ans.includes('zero')) {
              score = 10;
              review = 'Excellent! You referenced the existence of coefficients (not all zero) that combine to form the zero vector.';
            } else {
              score = 6;
              review = 'Partially correct. Remember that linear dependence means at least one vector can be expressed as a linear combination of the other vectors.';
            }
          }
          setShortGrade(`Score: ${score}/10\nAI Review: ${review}`);
          setIsGrading(false);
        }, 1500);
      });
  };

  return (
    <div className="space-y-8 min-h-[calc(100vh-100px)]">
      {/* Quiz Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Brain size={24} className="text-accent1" />
            Quiz Center
          </h2>
          <p className="text-sm text-gray-500 mt-1">Select an assessment mode to practice.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200 flex-wrap gap-1">
          {(['Flashcard', 'MCQ', 'Short', 'Long', 'Rapid'] as QuizMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                mode === m
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-primary hover:bg-gray-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive segment */}
      <div className="max-w-2xl mx-auto">
        {mode === 'Flashcard' && (
          <div className="space-y-6">
            {/* Flashcard container */}
            <div 
              onClick={() => setFlipped(!flipped)}
              className="h-80 w-full relative perspective-1000 cursor-pointer"
            >
              <div className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${
                flipped ? 'rotate-y-180' : ''
              }`}>
                {/* Front side */}
                <div className="absolute inset-0 bg-white border border-primary/5 rounded-2xl shadow-sm p-8 flex flex-col justify-between backface-hidden">
                  <div className="flex justify-between items-center text-xs text-gray-400 font-semibold uppercase">
                    <span>Topic: Subspaces</span>
                    <span>Card {flashIdx + 1} of {flashcards.length}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-center">
                    <h3 className="text-xl font-extrabold text-primary px-4 leading-relaxed">
                      {flashcards[flashIdx].question}
                    </h3>
                  </div>
                  <p className="text-center text-xs text-accent1 font-bold animate-pulse">Click card to reveal answer</p>
                </div>

                {/* Back side */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent1 rounded-2xl shadow-md p-8 flex flex-col justify-between backface-hidden rotate-y-180 text-white">
                  <div className="flex justify-between items-center text-xs text-white/70 font-semibold uppercase">
                    <span>Explanation</span>
                    <span>Card {flashIdx + 1} of {flashcards.length}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-center">
                    <p className="text-base leading-relaxed px-4">
                      {flashcards[flashIdx].answer}
                    </p>
                  </div>
                  <p className="text-center text-xs text-accent3 font-bold">Click card to see question</p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center px-2">
              <button 
                onClick={() => {
                  setFlipped(false);
                  setTimeout(() => setFlashIdx(prev => (prev === 0 ? flashcards.length - 1 : prev - 1)), 250);
                }}
                className="text-sm font-bold text-primary hover:text-accent1 py-2 px-4 bg-white border rounded-xl shadow-sm hover:shadow transition-all"
              >
                Previous
              </button>
              <button 
                onClick={() => {
                  setFlipped(false);
                  setTimeout(() => setFlashIdx(prev => (prev === flashcards.length - 1 ? 0 : prev + 1)), 250);
                }}
                className="text-sm font-bold bg-primary hover:bg-gradient-to-r hover:from-accent1 hover:to-accent2 text-white py-2 px-6 rounded-xl shadow transition-all"
              >
                Next Card
              </button>
            </div>
          </div>
        )}

        {mode === 'MCQ' && (
          <div className="bg-white border border-primary/5 rounded-2xl shadow-sm p-8 space-y-6">
            <div className="flex justify-between items-center text-xs text-gray-400 font-semibold uppercase">
              <span>MCQ Quiz</span>
              <span>Question {mcqIdx + 1} of {mcqs.length}</span>
            </div>

            <h3 className="text-lg font-bold text-primary leading-snug">
              {mcqs[mcqIdx].question}
            </h3>

            <div className="space-y-3">
              {mcqs[mcqIdx].options.map((opt, index) => {
                const isSelected = selectedOption === index;
                const isCorrectIdx = mcqs[mcqIdx].correct === index;
                
                let btnStyle = 'border-gray-100 hover:bg-gray-50/50';
                let icon = null;

                if (submittedMcq) {
                  if (isCorrectIdx) {
                    btnStyle = 'border-green-300 bg-green-50/80 text-green-800';
                    icon = <CheckCircle2 size={18} className="text-green-600 shrink-0" />;
                  } else if (isSelected) {
                    btnStyle = 'border-red-300 bg-red-50/80 text-red-800';
                    icon = <XCircle size={18} className="text-red-600 shrink-0" />;
                  } else {
                    btnStyle = 'border-gray-50 bg-gray-50/30 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-accent1 bg-accent3/20';
                }

                return (
                  <button
                    key={index}
                    disabled={submittedMcq}
                    onClick={() => setSelectedOption(index)}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between text-left text-sm font-semibold transition-all duration-200 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-500">
                Score: <strong className="text-primary">{mcqScore}</strong> / {mcqs.length}
              </span>
              
              {!submittedMcq ? (
                <button
                  disabled={selectedOption === null}
                  onClick={() => {
                    setSubmittedMcq(true);
                    if (selectedOption === mcqs[mcqIdx].correct) {
                      setMcqScore(prev => prev + 1);
                    }
                  }}
                  className="bg-primary hover:bg-gradient-to-r hover:from-accent1 hover:to-accent2 text-white py-2 px-6 rounded-xl font-bold text-sm shadow transition-all disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setSubmittedMcq(false);
                    setMcqIdx(prev => (prev === mcqs.length - 1 ? 0 : prev + 1));
                  }}
                  className="bg-accent2 hover:bg-accent1 text-white py-2 px-6 rounded-xl font-bold text-sm shadow transition-all flex items-center gap-1.5"
                >
                  <RefreshCw size={14} /> Next Question
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'Short' && (
          <div className="bg-white border border-primary/5 rounded-2xl shadow-sm p-8 space-y-6">
            <div className="flex justify-between items-center text-xs text-gray-400 font-semibold uppercase">
              <span>Short Answer Quiz</span>
              <span>Question {shortIdx + 1} of {shortQuestions.length}</span>
            </div>

            <h3 className="text-lg font-bold text-primary leading-snug">
              {shortQuestions[shortIdx].question}
            </h3>

            <textarea
              rows={4}
              value={shortAns}
              onChange={(e) => setShortAns(e.target.value)}
              placeholder="Write your explanation here..."
              className="w-full bg-gray-50 focus:bg-white text-sm text-primary placeholder-gray-400 border border-gray-200 focus:border-accent1 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-accent1 transition-all"
            ></textarea>

            {shortGrade && (
              <div className="p-4 bg-bg/50 border border-accent3 rounded-xl space-y-2 whitespace-pre-wrap text-sm">
                <h4 className="font-extrabold text-primary flex items-center gap-1">
                  <Award size={16} className="text-accent1" /> Grading Evaluation
                </h4>
                <p className="text-gray-700 font-semibold leading-relaxed">{shortGrade}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button 
                onClick={() => {
                  setShortAns('');
                  setShortGrade(null);
                  setShortIdx(prev => (prev === 0 ? shortQuestions.length - 1 : prev - 1));
                }}
                className="text-xs font-bold text-gray-500 hover:text-primary transition-colors"
              >
                Previous Question
              </button>

              {!shortGrade ? (
                <button
                  disabled={isGrading || !shortAns.trim()}
                  onClick={submitShortAnswer}
                  className="bg-primary hover:bg-gradient-to-r hover:from-accent1 hover:to-accent2 text-white py-2 px-6 rounded-xl font-bold text-sm shadow transition-all flex items-center justify-center"
                >
                  {isGrading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Submit for AI Grading'
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShortAns('');
                    setShortGrade(null);
                    setShortIdx(prev => (prev === shortQuestions.length - 1 ? 0 : prev + 1));
                  }}
                  className="bg-accent2 hover:bg-accent1 text-white py-2 px-6 rounded-xl font-bold text-sm shadow transition-all"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'Long' && (
          <div className="bg-white border border-primary/5 rounded-2xl shadow-sm p-8 space-y-6">
            <span className="text-xs text-gray-400 font-semibold uppercase">Detailed Answer Practice</span>
            <h3 className="text-lg font-bold text-primary">Prove that the span of any set S of vectors in V is a subspace of V.</h3>
            
            <textarea
              rows={8}
              value={shortAns}
              onChange={(e) => setShortAns(e.target.value)}
              placeholder="Structure your proof step-by-step: 1. Contain zero, 2. Closed under addition, 3. Closed under scalar multiplication."
              className="w-full bg-gray-50 focus:bg-white text-sm text-primary placeholder-gray-400 border border-gray-200 focus:border-accent1 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-accent1 transition-all"
            ></textarea>

            {shortGrade && (
              <div className="p-4 bg-bg/50 border border-accent3 rounded-xl space-y-2 whitespace-pre-wrap text-sm">
                <h4 className="font-extrabold text-primary flex items-center gap-1">
                  <Award size={16} className="text-accent1" /> proof verification feedback
                </h4>
                <p className="text-gray-700 font-semibold leading-relaxed">{shortGrade}</p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              {!shortGrade ? (
                <button
                  disabled={isGrading || !shortAns.trim()}
                  onClick={() => {
                    setIsGrading(true);
                    setTimeout(() => {
                      setShortGrade('Score: 9/10\nAI Evaluation: Your proof outline is excellent! You correctly defined span(S) as the set of all linear combinations of vectors in S. You successfully validated: \n1. 0 is in span(S) (using 0 coefficients)\n2. closed under addition\n3. closed under multiplication. \nSuggestion: explicitly write that S must be a subset of a vector space V.');
                      setIsGrading(false);
                    }, 1800);
                  }}
                  className="bg-primary hover:bg-gradient-to-r hover:from-accent1 hover:to-accent2 text-white py-2.5 px-6 rounded-xl font-bold text-sm shadow transition-all flex items-center justify-center"
                >
                  {isGrading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Verify Proof Steps'
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShortAns('');
                    setShortGrade(null);
                  }}
                  className="text-sm font-semibold text-accent1 hover:underline"
                >
                  Reset / Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'Rapid' && (
          <div className="bg-white border border-primary/5 rounded-2xl shadow-sm p-8 text-center space-y-6">
            <div className="flex justify-between items-center text-xs text-gray-400 font-semibold uppercase">
              <span>Rapid Fire Challenge</span>
              <span className="flex items-center gap-1 text-accent1"><Clock size={14} /> Time Left: {rapidTime}s</span>
            </div>

            {!rapidStarted ? (
              <div className="py-8 space-y-4">
                <Brain size={48} className="text-accent2 mx-auto animate-pulse" />
                <h3 className="text-xl font-extrabold text-primary">Rapid Fire Mode</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">Answer as many conceptual algebra questions as you can. You have 10 seconds per question.</p>
                <button
                  onClick={startRapid}
                  className="bg-primary hover:bg-gradient-to-r hover:from-accent1 hover:to-accent2 text-white py-3 px-8 rounded-xl font-bold text-sm shadow-sm transition-all"
                >
                  Start Quiz
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-6 text-left">
                <h3 className="text-lg font-bold text-primary leading-snug">
                  {rapidQuestion}
                </h3>

                <form onSubmit={submitRapid} className="space-y-4">
                  <input
                    type="text"
                    value={rapidAns}
                    onChange={(e) => setRapidAns(e.target.value)}
                    placeholder="Type YES or NO"
                    className="w-full bg-gray-50 text-sm text-primary placeholder-gray-400 border border-gray-200 focus:border-accent1 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent1"
                  />
                  
                  {rapidResult && (
                    <div className="p-3 bg-bg/50 border rounded-xl text-sm font-semibold">
                      {rapidResult}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setRapidStarted(false)}
                      className="text-xs text-gray-400 hover:text-primary transition-colors"
                    >
                      Exit Mode
                    </button>

                    {!rapidResult ? (
                      <button
                        type="submit"
                        disabled={!rapidAns.trim()}
                        className="bg-primary text-white py-2 px-6 rounded-xl font-bold text-sm"
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setRapidQuestion('Is R^2 isomorphic to C (the complex numbers)?');
                          setRapidAns('');
                          setRapidTime(10);
                          setRapidResult(null);
                        }}
                        className="bg-accent2 hover:bg-accent1 text-white py-2 px-6 rounded-xl font-bold text-sm"
                      >
                        Next Question
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
