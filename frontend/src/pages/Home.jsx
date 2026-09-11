import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Briefcase, MonitorPlay, Trophy, Landmark } from 'lucide-react';

const categories = [
  { name: 'Sports', icon: <Trophy className="w-8 h-8 text-orange-500" />, desc: 'Scores, games, and athlete news.' },
  { name: 'Politics', icon: <Landmark className="w-8 h-8 text-blue-500" />, desc: 'Elections, policies, and government affairs.' },
  { name: 'Technology', icon: <Activity className="w-8 h-8 text-indigo-500" />, desc: 'Gadgets, software, and tech trends.' },
  { name: 'Business', icon: <Briefcase className="w-8 h-8 text-green-500" />, desc: 'Markets, finance, and corporate news.' },
  { name: 'Entertainment', icon: <MonitorPlay className="w-8 h-8 text-purple-500" />, desc: 'Movies, music, and celebrity gossip.' },
];

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-8 border border-indigo-100">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Powered by Logistic Regression & TF-IDF
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Turn News Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Insights</span> With AI
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          NewsLens understands every story. Automatically classify articles into relevant categories using our custom-trained Natural Language Processing model.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/classifier" className="btn-primary text-lg flex items-center justify-center gap-2 px-8 py-3">
            Classify Article <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/about" className="btn-secondary text-lg px-8 py-3">
            Explore Project
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Supported Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="card hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">{cat.name}</h3>
              <p className="text-sm text-slate-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
