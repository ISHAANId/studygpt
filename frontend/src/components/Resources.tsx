import { useState } from 'react';
import { Link as LinkIcon, Video, Globe, FileQuestion, ExternalLink } from 'lucide-react';

interface ResourceLink {
  title: string;
  desc: string;
  icon: React.ReactNode;
  getBaseUrl: (topic: string) => string;
}

const resources: ResourceLink[] = [
  {
    title: 'YouTube Lecture Video Search',
    desc: 'Watch animated concept reviews, geometric explanations, and step-by-step math solver lectures.',
    icon: <Video size={28} className="text-red-600" />,
    getBaseUrl: (topic: string) => `https://www.youtube.com/results?search_query=linear+algebra+${encodeURIComponent(topic)}`
  },
  {
    title: 'Text Tutorials & Articles',
    desc: 'Read structured tutorials on Wikipedia, LibreTexts, and university blog publications.',
    icon: <Globe size={28} className="text-blue-600" />,
    getBaseUrl: (topic: string) => `https://www.google.com/search?q=linear+algebra+${encodeURIComponent(topic)}+tutorial+filetype:html`
  },
  {
    title: 'Previous Year Exams & Questions',
    desc: 'Practice real exam questions with solutions collected from MIT, Stanford, and Berkeley.',
    icon: <FileQuestion size={28} className="text-emerald-600" />,
    getBaseUrl: (topic: string) => `https://www.google.com/search?q=linear+algebra+${encodeURIComponent(topic)}+exam+questions+solutions+pdf`
  }
];

const topicsList = [
  'Vector Spaces',
  'Basis and Dimension',
  'Linear Transformations',
  'Rank-Nullity Theorem',
  'Eigenvalues and Eigenvectors'
];

export default function Resources() {
  const [activeTopic, setActiveTopic] = useState(topicsList[0]);

  return (
    <div className="space-y-8 min-h-[calc(100vh-100px)]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <LinkIcon size={24} className="text-accent1" />
          Learning Resources
        </h2>
        <p className="text-sm text-gray-500 mt-1">Direct search portals matching your current study syllabus.</p>
      </div>

      {/* Topic filter bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/5 space-y-3">
        <h3 className="text-sm font-extrabold text-primary">Select Study Domain:</h3>
        <div className="flex flex-wrap gap-2">
          {topicsList.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTopic(t)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeTopic === t
                  ? 'bg-accent3/30 border-accent1 text-primary'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-accent2 hover:text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Resource cards list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((res, index) => {
          const destinationUrl = res.getBaseUrl(activeTopic);
          return (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-sm border border-primary/5 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 w-fit rounded-xl">
                  {res.icon}
                </div>
                <h4 className="font-extrabold text-primary text-base leading-snug">{res.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{res.desc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100">
                <a 
                  href={destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-bold text-accent1 hover:text-accent2 hover:underline transition-all"
                >
                  <span>Search for "{activeTopic}"</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested links box */}
      <div className="bg-bg/40 border border-primary/5 rounded-2xl p-6">
        <h4 className="font-extrabold text-primary text-sm flex items-center gap-1.5 mb-3">
          📚 Recommended Lecture Series
        </h4>
        <ul className="space-y-2 text-xs">
          <li>
            <a 
              href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-accent1 font-semibold flex items-center gap-1 hover:underline"
            >
              • Essence of Linear Algebra - 3Blue1Brown <ExternalLink size={12} className="inline text-gray-400" />
            </a>
          </li>
          <li>
            <a 
              href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-accent1 font-semibold flex items-center gap-1 hover:underline"
            >
              • MIT 18.06 Linear Algebra - Prof. Gilbert Strang <ExternalLink size={12} className="inline text-gray-400" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
