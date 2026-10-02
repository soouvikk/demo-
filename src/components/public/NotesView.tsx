import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Pin, 
  Calendar, 
  User, 
  ArrowRight,
  Bell
} from 'lucide-react';

export const NotesView: React.FC = () => {
  const { notes, setActivePublicPage } = useApp();

  const publicNotes = notes.filter((n) => n.visibility === 'PUBLIC');

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'ANNOUNCEMENT':
        return <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">Depot Dispatch</span>;
      case 'OFFER':
        return <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Trade Incentive</span>;
      case 'POLICY':
        return <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">Operating Policy</span>;
      default:
        return <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">Notice</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Depot Logistics Desk
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Official Wholesale Bulletins & Notices
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Consignment arrivals, price schedule revisions, and territory guidelines for regional retailers.
        </p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {publicNotes.length > 0 ? (
          publicNotes.map((note) => (
            <div
              key={note.id}
              className={`p-6 bg-white rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md ${
                note.isPinned
                  ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getCategoryBadge(note.category)}
                  {note.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Pin className="w-3 h-3 text-emerald-600" />
                      Priority Notice
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono ml-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(note.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                  {note.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Author: <strong>{note.authorName}</strong></span>
                </div>

                <button
                  onClick={() => setActivePublicPage('contact')}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Connect with Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No public bulletins active at this time.
          </div>
        )}
      </div>
    </div>
  );
};
