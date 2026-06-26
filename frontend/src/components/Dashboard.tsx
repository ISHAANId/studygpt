import Hero from './Hero';
import StatsCard from './StatsCard';
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Hero />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Topics Covered"
          value={12}
          icon={<BookOpen size={24} />}
        />
        <StatsCard
          title="Quiz Accuracy"
          value="85%"
          icon={<CheckCircle size={24} />}
        />
        <StatsCard
          title="Study Streak"
          value="7 days"
          icon={<Clock size={24} />}
        />
        <StatsCard
          title="Hours Studied"
          value={23}
          icon={<TrendingUp size={24} />}
        />
      </div>
    </div>
  );
}
