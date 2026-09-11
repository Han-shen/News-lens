import { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../services/api';
import { Search, Trash2, Filter } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(filter === 'All' ? null : filter || null);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const handleClear = async () => {
    if (confirm("Are you sure you want to clear all history?")) {
      await clearHistory();
      fetchHistory();
    }
  };

  const categories = ['All', 'Sports', 'Politics', 'Technology', 'Business', 'Entertainment'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Prediction History</h1>
          <p className="text-slate-500 mt-1">Review past classifications stored in MongoDB.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <select 
              className="pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer text-slate-700"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
            </select>
          </div>
          <button onClick={handleClear} className="btn-secondary flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Article Preview</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8">Loading history...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No history found.</td></tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 max-w-md truncate" title={item.text_preview}>{item.text_preview}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: `${item.confidence * 100}%` }}></div>
                        </div>
                        <span className="text-xs">{(item.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
