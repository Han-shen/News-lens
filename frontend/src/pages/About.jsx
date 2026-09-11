import { useState, useEffect } from 'react';
import { getStats, getModelInfo } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Database, Brain, Code, Cpu } from 'lucide-react';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

const About = () => {
  const [stats, setStats] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
    getModelInfo().then(setModelInfo).catch(console.error);
  }, []);

  const chartData = stats ? Object.keys(stats.category_counts).map(key => ({
    name: key,
    count: stats.category_counts[key]
  })) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">About NewsLens</h1>
        <p className="text-lg text-slate-600">A full-stack NLP project demonstrating end-to-end machine learning deployment, from text preprocessing to a RESTful API and interactive React UI.</p>
      </div>

      {/* College Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Brain className="w-6 h-6" />
            <h2 className="text-xl font-bold">Methodology</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            <strong>Problem Statement:</strong> With the vast amount of news generated daily, categorizing articles manually is inefficient. We need an automated system to classify news into predefined categories based on content.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            <strong>NLP Techniques:</strong> Text lowercase, URL/HTML removal, punctuation removal, tokenization, stopword removal, and TF-IDF vectorization.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            <strong>ML Algorithm:</strong> Logistic Regression was chosen over LinearSVC because it provides calibrated probability estimates (confidence scores) which are essential for the user interface.
          </p>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Code className="w-6 h-6" />
            <h2 className="text-xl font-bold">System Architecture</h2>
          </div>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
            <li><strong>Frontend:</strong> React, Tailwind CSS, React Router, Recharts for dynamic visualizations.</li>
            <li><strong>Backend:</strong> FastAPI (Python) providing a REST API layer.</li>
            <li><strong>ML Pipeline:</strong> Scikit-learn, NLTK, Pandas, NumPy for text processing and inference.</li>
            <li><strong>Database:</strong> MongoDB via Motor async driver for storing prediction history.</li>
            <li><strong>Data Flow:</strong> React &rarr; FastAPI &rarr; NLP Preprocessing &rarr; TF-IDF &rarr; Logistic Regression &rarr; Response &rarr; MongoDB.</li>
          </ul>
        </div>
      </div>

      {/* Model Stats Section */}
      <div className="card bg-slate-900 text-slate-50 border-0">
        <div className="flex items-center gap-2 text-indigo-400 mb-6">
          <Cpu className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Model Performance Metrics</h2>
        </div>
        
        {modelInfo ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Accuracy</div>
              <div className="text-3xl font-mono text-indigo-400">{(modelInfo.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Precision</div>
              <div className="text-3xl font-mono text-indigo-400">{(modelInfo.precision * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Recall</div>
              <div className="text-3xl font-mono text-indigo-400">{(modelInfo.recall * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">F1 Score</div>
              <div className="text-3xl font-mono text-indigo-400">{(modelInfo.f1 * 100).toFixed(1)}%</div>
            </div>
            <div className="col-span-2 md:col-span-4 mt-2 text-sm text-slate-400 flex justify-between">
              <span>Model: {modelInfo.model_name}</span>
              <span>Training Samples: {modelInfo.training_samples} | Test Samples: {modelInfo.test_samples}</span>
            </div>
          </div>
        ) : (
          <div className="text-slate-400">Loading model metrics...</div>
        )}
      </div>

      {/* DB Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card flex flex-col justify-center items-center text-center">
          <Database className="w-12 h-12 text-indigo-500 mb-4" />
          <h3 className="text-4xl font-extrabold text-slate-900 mb-2">{stats ? stats.total_articles : '-'}</h3>
          <p className="text-slate-500 font-medium">Total Articles Processed</p>
          <p className="text-sm text-slate-400 mt-4 max-w-xs">Data securely stored and retrieved from local MongoDB instance.</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Category Distribution</h3>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No data to display</div>
            )}
          </div>
        </div>
      </div>

      {/* Future Scope */}
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Future Scope & Limitations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Limitations</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Limited vocabulary due to max_features constraint in TF-IDF.</li>
              <li>Struggles with nuanced or highly sarcastic text.</li>
              <li>Cannot comprehend semantic relationships beyond n-grams (1,2).</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Future Scope</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Implement BERT or other Transformer models for better contextual understanding.</li>
              <li>Add fake-news detection capabilities.</li>
              <li>Multilingual support using cross-lingual embeddings.</li>
              <li>Real-time classification using streaming news APIs.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
