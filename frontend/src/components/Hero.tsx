import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-bg rounded-xl p-8 mb-8">
      <h1 className="text-4xl font-bold text-primary">Welcome back, Ishaani</h1>
      <p className="mt-2 text-lg text-primary/80">
        Your personalized AI study companion is ready.
      </p>
      <div className="mt-6 flex max-w-md">
        <input
          type="text"
          placeholder="Ask anything…"
          className="flex-1 rounded-l-lg border border-primary/20 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="rounded-r-lg bg-primary text-white px-4 flex items-center">
          <Search size={20} />
        </button>
      </div>
    </section>
  );
}
