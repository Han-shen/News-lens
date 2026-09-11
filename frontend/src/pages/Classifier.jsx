import { useState } from 'react';
import { classifyArticle } from '../services/api';
import { Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const samples = {
  Sports: "The national team secured a dramatic 3-2 victory in the final minutes of the championship match, sparking wild celebrations across the city.",
  Politics: "The senate passed the comprehensive infrastructure bill today, marking a significant legislative victory for the administration after months of debate.",
  Technology: "The tech giant unveiled its latest quantum processor, promising exponential leaps in computational power for complex AI models.",
  Business: "Global markets rallied as inflation data came in lower than expected, with tech stocks leading the surge on Wall Street.",
  Entertainment: "The highly anticipated sci-fi epic shattered box office records opening weekend, earning praise from both audiences and critics."
};

const Classifier = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleClassify = async () => {
    if (text.length < 10) {
      setError("Please enter at least 10 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await classifyArticle(text);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to classify article. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
    setExpanded(false);
  };

  const loadSample = (cat) => {
    setText(samples[cat]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card shadow-md border-0 bg-white ring-1 ring-slate-200">
            <div className="mb-4 flex justify-between items-end">
              <h2 className="text-2xl font-bold text-slate-900">Analyze Text</h2>
              <div className="text-sm text-slate-500 font-medium">
                {text.length} chars | {text.split(/\s+/).filter(w => w.length > 0).length} words
              </div>
            </div>
            
            <textarea
              className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-slate-700 leading-relaxed shadow-inner mb-4"
              placeholder="Paste news article text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            {error && <div className="text-red-500 text-sm mb-4 px-2 font-medium">{error}</div>}
            
            <div className="flex gap-3">
              <button 
                onClick={handleClassify} 
                disabled={loading || text.length === 0}
                className="btn-primary flex-1 py-3 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : 'Classify Article'}
              </button>
              <button onClick={handleClear} disabled={loading} className="btn-secondary px-6">
                Clear
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="card border-0 bg-gradient-to-br from-indigo-50 to-purple-50 ring-1 ring-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Prediction</h3>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-5xl font-extrabold text-indigo-700">{result.category}</span>
                <span className="text-lg font-medium text-slate-600">
                  in {result.processing_time}s
                </span>
              </div>
              
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span className="text-slate-700">Confidence Score</span>
                <span className="text-indigo-700">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-indigo-100 rounded-full h-3 mb-6 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>

              {/* Pipeline Details */}
              <div className="bg-white rounded-lg border border-indigo-100 overflow-hidden">
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="w-full px-4 py-3 flex justify-between items-center text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  How the Model Processed Your Article
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expanded && (
                  <div className="p-4 border-t border-indigo-50 text-sm text-slate-600 space-y-4">
                    <div>
                      <span className="font-semibold text-slate-900">Pipeline:</span> Raw Text &rarr; Cleaning &rarr; Tokenization &rarr; Stopword Removal &rarr; TF-IDF &rarr; ML Classifier
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                        <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Original Words</div>
                        <div className="font-mono text-lg text-slate-800">{result.pipeline_details.original_length}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                        <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Cleaned Words</div>
                        <div className="font-mono text-lg text-slate-800">{result.pipeline_details.cleaned_length}</div>
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block mb-1">Top Extracted Terms:</span>
                      <div className="flex flex-wrap gap-2">
                        {result.pipeline_details.extracted_terms.map((t, i) => (
                          <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-mono">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Samples */}
        <div className="space-y-4">
          <div className="card bg-white border-slate-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-500" />
              Sample Articles
            </h3>
            <p className="text-sm text-slate-500 mb-4">Click a category to load a representative sample text.</p>
            <div className="space-y-2">
              {Object.keys(samples).map(cat => (
                <button 
                  key={cat}
                  onClick={() => loadSample(cat)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group flex justify-between items-center"
                >
                  <span className="font-medium text-slate-700 group-hover:text-indigo-700">{cat}</span>
                  <span className="text-xs text-slate-400 group-hover:text-indigo-500">Load</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Classifier;
