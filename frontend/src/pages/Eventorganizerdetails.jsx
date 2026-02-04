import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function EventOrganizerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [stats, setStats] = useState({});
  const [toast, setToast] = useState({ open: false, type: 'info', message: '' });

  const showToast = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast({ open: false, type: 'info', message: '' }), 3000);
  };

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      const [eventRes, partsRes] = await Promise.all([
        api.get(`/api/events/${id}`),
        api.get(`/api/registrations/${id}/participants`)
      ]);

      setEvent(eventRes.data.event);
      const parts = partsRes.data.participants || [];
      setParticipants(parts);

      // Calculate stats
      const total = parts.length;
      const attended = parts.filter(p => p.status === 'attended').length;
      const capacity = eventRes.data.event.capacity || 100;

      setStats({
        total,
        attended,
        capacity,
        occupancy: capacity > 0 ? ((total / capacity) * 100).toFixed(1) : 0,
        remaining: capacity - total
      });
    } catch (err) {
      console.error('Error loading event details:', err);
      showToast('error', 'Failed to load event details');
    }
  }

  async function exportCsv() {
    try {
      if (participants.length === 0) {
        showToast('error', 'No participants to export');
        return;
      }

      const res = await api.get(`/api/registrations/${id}/participants.csv`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event?.title?.replace(/[^a-zA-Z0-9]/g, '_')}_participants.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('success', 'CSV exported successfully');
    } catch (err) {
      showToast('error', 'Failed to export CSV');
    }
  }

  if (!event) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      {toast.open && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white ${toast.type==='error'?'bg-red-600':toast.type==='success'?'bg-green-600':'bg-blue-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Back button */}
      <button onClick={() => navigate('/dashboard')} className="btn-outline text-sm">
        ← Back to Dashboard
      </button>

      {/* Event header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
            <p className="text-slate-600 dark:text-slate-300">{event.description}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border shrink-0 ${
            event.status === 'approved' ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300' :
            event.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300' :
            'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300'
          }`}>
            {event.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Date & Time</div>
            <div className="font-semibold">{new Date(event.date).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Location</div>
            <div className="font-semibold">{event.location}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Category</div>
            <div className="font-semibold">{event.category}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Rating</div>
            <div className="font-semibold">⭐ {event.averageRating?.toFixed?.(1) || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 dark:text-blue-300 font-medium">Total Registrations</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-200 mt-1">{stats.total}</div>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-green-600 dark:text-green-300 font-medium">Attended</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-200 mt-1">{stats.attended}</div>
            </div>
            <div className="text-3xl">✓</div>
          </div>
        </div>

        <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-purple-600 dark:text-purple-300 font-medium">Capacity</div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-200 mt-1">{stats.capacity}</div>
            </div>
            <div className="text-3xl">🎫</div>
          </div>
        </div>

        <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-orange-600 dark:text-orange-300 font-medium">Occupancy</div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-200 mt-1">{stats.occupancy}%</div>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="mt-2 bg-white dark:bg-slate-700 rounded-full h-1.5">
            <div
              className="bg-orange-600 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(stats.occupancy, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Participants table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-lg">Participants</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats.total} registered • {stats.remaining} spots remaining
            </p>
          </div>
          <button onClick={exportCsv} className="btn text-sm" disabled={participants.length === 0}>
            📥 Export CSV
          </button>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <div className="text-4xl mb-3">📋</div>
            <p>No registrations yet</p>
            <p className="text-xs mt-1">Participants will appear here once they register</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">#</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Registration Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {participants.map((p, idx) => (
                  <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{p.user?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.user?.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        p.status === 'attended' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300' :
                        p.status === 'registered' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}