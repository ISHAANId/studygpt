import { TrendingUp, Award, Calendar, CheckCircle2, Clock, Zap } from 'lucide-react';

interface TopicProgress {
  name: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
}

const topicsProgress: TopicProgress[] = [
  { name: 'Vector Spaces & Axioms', completed: 4, total: 4, percentage: 100, color: 'bg-green-500' },
  { name: 'Subspaces & Bases', completed: 3, total: 4, percentage: 75, color: 'bg-accent2' },
  { name: 'Linear Transformations', completed: 2, total: 5, percentage: 40, color: 'bg-accent1' },
  { name: 'Eigenvalues & Eigenvectors', completed: 0, total: 3, percentage: 0, color: 'bg-gray-200' }
];

export default function Progress() {
  return (
    <div className="space-y-8 min-h-[calc(100vh-100px)]">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <TrendingUp size={24} className="text-accent1" />
          Progress & Analytics
        </h2>
        <p className="text-sm text-gray-500 mt-1">Detailed evaluation of your study parameters.</p>
      </div>

      {/* Gamified Level & XP Block */}
      <div className="bg-gradient-to-r from-primary to-accent1 rounded-2xl p-6 shadow-md text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
            <Award size={36} className="text-accent3" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold">Level 4 Scholar</h3>
              <span className="text-xs bg-accent2 text-white px-2 py-0.5 rounded-full font-bold">PRO</span>
            </div>
            <p className="text-xs text-white/70 mt-1">You are in the top 8% of students studying linear algebra this week.</p>
          </div>
        </div>

        <div className="w-full md:w-80 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Experience Points (XP)</span>
            <span>2,450 / 3,000 XP</span>
          </div>
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden p-0.5">
            <div className="bg-accent3 h-full rounded-full transition-all duration-500" style={{ width: '81%' }}></div>
          </div>
          <p className="text-[10px] text-right text-white/60">550 XP needed to level up</p>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Topics Completed</p>
            <h4 className="text-2xl font-extrabold text-primary mt-0.5">9 / 16</h4>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent3/20 flex items-center justify-center text-accent1">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Average Score</p>
            <h4 className="text-2xl font-extrabold text-primary mt-0.5">85%</h4>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Zap size={24} className="fill-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Active Streak</p>
            <h4 className="text-2xl font-extrabold text-primary mt-0.5">7 Days</h4>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-primary/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Time Studied</p>
            <h4 className="text-2xl font-extrabold text-primary mt-0.5">23 Hours</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-primary/5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-primary flex items-center gap-2">
              <TrendingUp size={18} className="text-accent1" /> Study Activity Trend
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Average weekly accuracy percentage across quiz modes.</p>
          </div>

          <div className="my-6 relative h-48">
            {/* Custom SVG line chart */}
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C74E51" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#C74E51" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="30" y1="70" x2="480" y2="70" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="30" y1="120" x2="480" y2="120" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="30" y1="170" x2="480" y2="170" stroke="#f3f4f6" strokeWidth="1" />

              {/* Area map */}
              <path 
                d="M30 170 L80 140 L160 110 L240 120 L320 80 L400 50 L480 40 L480 170 Z" 
                fill="url(#chartGrad)" 
              />

              {/* Chart Line */}
              <path 
                d="M30 170 Q 80 140, 160 110 T 320 80 T 480 40" 
                fill="none" 
                stroke="#C74E51" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="80" cy="140" r="5" fill="#C74E51" stroke="#fff" strokeWidth="1.5" />
              <circle cx="160" cy="110" r="5" fill="#C74E51" stroke="#fff" strokeWidth="1.5" />
              <circle cx="240" cy="120" r="5" fill="#C74E51" stroke="#fff" strokeWidth="1.5" />
              <circle cx="320" cy="80" r="5" fill="#C74E51" stroke="#fff" strokeWidth="1.5" />
              <circle cx="400" cy="50" r="5" fill="#C74E51" stroke="#fff" strokeWidth="1.5" />
              <circle cx="480" cy="40" r="5" fill="#C74E51" stroke="#fff" strokeWidth="1.5" />

              {/* Labels */}
              <text x="70" y="192" fill="#9ca3af" fontSize="9px" fontWeight="bold">Mon</text>
              <text x="150" y="192" fill="#9ca3af" fontSize="9px" fontWeight="bold">Tue</text>
              <text x="230" y="192" fill="#9ca3af" fontSize="9px" fontWeight="bold">Wed</text>
              <text x="310" y="192" fill="#9ca3af" fontSize="9px" fontWeight="bold">Thu</text>
              <text x="390" y="192" fill="#9ca3af" fontSize="9px" fontWeight="bold">Fri</text>
              <text x="470" y="192" fill="#9ca3af" fontSize="9px" fontWeight="bold">Sat</text>
            </svg>
          </div>
        </div>

        {/* Breakdown by topics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/5">
          <div>
            <h3 className="font-bold text-primary flex items-center gap-2">
              <Calendar size={18} className="text-accent2" /> Topic Breakdown
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Syllabus breakdown and completion rate.</p>
          </div>

          <div className="mt-6 space-y-4">
            {topicsProgress.map((topic, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-primary truncate max-w-[70%]">{topic.name}</span>
                  <span className="font-bold text-gray-500">{topic.completed}/{topic.total} ({topic.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`${topic.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${topic.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
