import { useState } from 'react';
import { BookOpen, HelpCircle, CheckCircle2, Send, GraduationCap } from 'lucide-react';

interface Lesson {
  title: string;
  summary: string;
  content: string;
  keyTakeaways: string[];
}

const lessonsData: Record<string, Lesson> = {
  'Vector Spaces': {
    title: 'Vector Spaces & Fields',
    summary: 'An algebraic structure formed by a collection of vectors, which may be added together and multiplied by scalars.',
    content: `A vector space V over a field F is a set of elements (vectors) together with two operations: vector addition and scalar multiplication. 

For V to be a vector space, it must satisfy the following axioms for all vectors u, v, w in V and scalars c, d in F:

1. **Closure under addition**: u + v is in V.
2. **Associativity of addition**: (u + v) + w = u + (v + w).
3. **Commutativity of addition**: u + v = v + u.
4. **Additive identity**: There exists a zero vector 0 such that u + 0 = u.
5. **Additive inverse**: There exists an element -u such that u + (-u) = 0.
6. **Closure under scalar multiplication**: c * u is in V.
7. **Distributivity of scalar sum**: (c + d) * u = c*u + d*u.
8. **Distributivity of vector sum**: c * (u + v) = c*u + c*v.
9. **Associativity of scalar multiplication**: c * (d * u) = (c * d) * u.
10. **Multiplicative identity**: 1 * u = u, where 1 is the multiplicative identity in F.`,
    keyTakeaways: [
      'Must satisfy all 10 algebraic axioms.',
      'Scalar multiplication elements come from a defined field F.',
      'R^n is the standard example of a vector space over the field R.'
    ]
  },
  'Subspaces & Bases': {
    title: 'Subspaces, Span, & Bases',
    summary: 'Understanding subspaces, generating sets, linear independence, and coordinate foundations.',
    content: `A subset W of a vector space V is called a subspace if W is itself a vector space under the addition and scalar multiplication defined on V.

To prove W is a subspace of V, we only need to verify three properties (the Subspace Criteria):
1. **Non-emptiness**: The zero vector 0 of V is in W.
2. **Closure under addition**: If u and v are in W, then u + v is in W.
3. **Closure under scalar multiplication**: If u is in W and c is a scalar, then c * u is in W.

**Bases and Dimension**:
A set of vectors B in V is a basis if:
- B is linearly independent (no vector in B can be written as a linear combination of the others).
- B spans V (every vector in V can be written as a linear combination of vectors in B).

The number of vectors in a basis B is called the dimension of V.`,
    keyTakeaways: [
      'Subspaces must contain the zero vector.',
      'A basis is a minimal spanning set and a maximal linearly independent set.',
      'All bases for a given vector space have the exact same number of vectors (dimension).'
    ]
  },
  'Linear Transformations': {
    title: 'Linear Transformations & Matrices',
    summary: 'Mapping vectors between vector spaces while preserving addition and scaling structures.',
    content: `Let V and W be vector spaces over the same field F. A mapping T: V -> W is called a linear transformation if it preserves the vector space operations:

1. **Additivity**: T(u + v) = T(u) + T(v) for all vectors u, v in V.
2. **Homogeneity**: T(c * u) = c * T(u) for all vectors u in V and scalar c in F.

**Matrix Representation**:
Every linear transformation T between finite-dimensional spaces can be represented uniquely by a matrix A such that:
T(x) = A * x

**Kernel and Range**:
- The **Kernel** (or null space) of T is the set of all vectors in V that map to 0 in W.
- The **Range** (or column space) of T is the set of all vectors in W that are images of vectors in V.`,
    keyTakeaways: [
      'Linear transformations map zero vector to zero vector: T(0) = 0.',
      'The Rank-Nullity Theorem states: dim(Ker T) + dim(Range T) = dim(V).',
      'Matrices act as coordinates for transformations in finite dimensions.'
    ]
  }
};

import { useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Tutor() {
  const [topics, setTopics] = useState<string[]>(Object.keys(lessonsData));
  const [selectedTopic, setSelectedTopic] = useState<string>('Vector Spaces');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [doubtText, setDoubtText] = useState('');
  const [doubtAnswers, setDoubtAnswers] = useState<Array<{ q: string; a: string }>>([]);
  const [isSolving, setIsSolving] = useState(false);

  const [dynamicContent, setDynamicContent] = useState<string | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);

  const currentLesson = lessonsData[selectedTopic] || {
    title: selectedTopic,
    summary: 'Custom study topic from notes',
    content: dynamicContent || 'No notes loaded.',
    keyTakeaways: ['Focus on definitions', 'Review core formulas', 'Ask doubts if stuck']
  };

  useEffect(() => {
    // Fetch state on mount to load custom topics if available
    fetch(`${API_BASE}/api/state`)
      .then(res => res.json())
      .then(data => {
        if (data.notesLoaded && data.topics && data.topics.length > 0) {
          setTopics(data.topics);
          setSelectedTopic(data.topics[0]);
        }
      })
      .catch(err => console.log("Backend not active, using default topics.", err));
  }, []);

  useEffect(() => {
    setLoadingLesson(true);
    fetch(`${API_BASE}/api/tutor/teach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: selectedTopic })
    })
      .then(res => {
        if (!res.ok) throw new Error("API down");
        return res.json();
      })
      .then(data => {
        setDynamicContent(data.lesson);
        setLoadingLesson(false);
      })
      .catch(() => {
        // Fallback to local static lesson if backend is down/not processing
        const local = lessonsData[selectedTopic];
        setDynamicContent(local ? local.content : `No notes loaded yet. Please upload a PDF in the Chat tab first to study the custom topic "${selectedTopic}".`);
        setLoadingLesson(false);
      });
  }, [selectedTopic]);

  const toggleCompleted = (topic: string) => {
    if (completedTopics.includes(topic)) {
      setCompletedTopics(completedTopics.filter(t => t !== topic));
    } else {
      setCompletedTopics([...completedTopics, topic]);
    }
  };

  const handleAskDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    const query = doubtText;
    setDoubtText('');
    setIsSolving(true);

    fetch(`${API_BASE}/api/tutor/doubt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: selectedTopic,
        lesson: dynamicContent || currentLesson.content,
        doubt: query
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("API down");
        return res.json();
      })
      .then(data => {
        setDoubtAnswers(prev => [...prev, { q: query, a: data.answer }]);
        setIsSolving(false);
      })
      .catch(() => {
        // Fallback simulated doubt answers
        let explanation = '';
        const q = query.toLowerCase();
        if (q.includes('why') && q.includes('zero')) {
          explanation = `Great doubt! A subspace must contain the zero vector because of the closure axiom under scalar multiplication. If W is a subspace and contains any vector 'v', multiplying 'v' by the scalar 0 must also land in W. Since 0 * v = 0, the zero vector must reside in W. Otherwise, W would not be closed under scaling.`;
        } else {
          explanation = `Regarding your doubt: In the context of ${selectedTopic}, remember that linear algebra is built around linear combinations. Every algebraic relation is scaled and added.`;
        }
        setDoubtAnswers(prev => [...prev, { q: query, a: explanation }]);
        setIsSolving(false);
      });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-100px)]">
      {/* Left panel: Learning path */}
      <div className="xl:w-96 bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-6 border border-primary/5 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <GraduationCap size={24} className="text-accent1" />
            Learning Path
          </h2>
          <p className="text-sm text-gray-500 mt-1">Select a topic to study with AI guidance.</p>
        </div>

        <div className="space-y-3">
          {topics.map((topic, idx) => {
            const isSelected = selectedTopic === topic;
            const isCompleted = completedTopics.includes(topic);
            return (
              <div 
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 ${
                  isSelected 
                    ? 'border-accent1 bg-accent3/20 shadow-sm' 
                    : 'border-gray-100 hover:border-accent2 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 ${
                    isSelected ? 'bg-accent1 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-primary">{topic}</h4>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{lessonsData[topic]?.summary || 'Custom study topic from notes'}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompleted(topic);
                  }}
                  className={`p-1 rounded-full transition-colors shrink-0 ${
                    isCompleted ? 'text-green-600 bg-green-50' : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <CheckCircle2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-bg/40 rounded-xl p-4 border border-gray-100 mt-auto">
          <div className="flex justify-between items-center text-xs font-semibold text-primary mb-2">
            <span>Syllabus Progress</span>
            <span>{Math.round((completedTopics.length / (topics.length || 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-accent1 to-accent2 h-full transition-all duration-500" 
              style={{ width: `${(completedTopics.length / (topics.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Right panel: Lesson and doubt box */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-primary/5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 flex-wrap border-b border-gray-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-accent1 tracking-wider uppercase">Active Lesson</span>
                <h1 className="text-2xl font-extrabold text-primary mt-1">{currentLesson.title}</h1>
              </div>
              <button
                onClick={() => toggleCompleted(selectedTopic)}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                  completedTopics.includes(selectedTopic)
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-primary border-primary hover:bg-gradient-to-r hover:from-accent1 hover:to-accent2 text-white'
                }`}
              >
                <CheckCircle2 size={16} />
                {completedTopics.includes(selectedTopic) ? 'Completed' : 'Mark as Completed'}
              </button>
            </div>

            <div className={`prose prose-sm max-w-none text-primary/90 leading-relaxed whitespace-pre-wrap transition-opacity duration-200 ${loadingLesson ? 'opacity-50' : 'opacity-100'}`}>
              {currentLesson.content}
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="font-bold text-primary flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-accent1" />
                Key Takeaways
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentLesson.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="p-3 bg-bg/30 border border-primary/5 rounded-xl text-xs text-gray-700 leading-normal flex items-start gap-2">
                    <span className="text-accent2 font-bold shrink-0 mt-0.5">•</span>
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Doubt solving block */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-primary/5">
          <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
            <HelpCircle size={20} className="text-accent2" />
            Doubt Solver
          </h3>

          {/* Doubt logs */}
          {doubtAnswers.length > 0 && (
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto border-b border-gray-100 pb-4">
              {doubtAnswers.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex gap-2 items-start justify-end">
                    <div className="bg-accent1/10 text-accent1 font-medium text-xs py-2 px-3 rounded-xl rounded-tr-none max-w-[80%]">
                      <strong>Q: </strong> {item.q}
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full bg-accent2 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">T</div>
                    <div className="bg-bg/40 text-primary text-xs py-2 px-3 rounded-xl rounded-tl-none max-w-[80%] leading-relaxed">
                      <strong>AI Tutor: </strong> {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAskDoubt} className="flex gap-2">
            <input
              type="text"
              value={doubtText}
              onChange={(e) => setDoubtText(e.target.value)}
              placeholder="Ask a doubt about this lesson (e.g. 'Why must zero vector be included?')"
              className="flex-1 bg-gray-50 text-sm text-primary placeholder-gray-400 border border-gray-200 focus:border-accent2 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent2 transition-all"
            />
            <button
              type="submit"
              disabled={isSolving || !doubtText.trim()}
              className="bg-accent2 hover:bg-accent1 text-white p-3 rounded-xl disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-sm flex items-center justify-center"
            >
              {isSolving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
