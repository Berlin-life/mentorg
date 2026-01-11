
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

const Scheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const timeSlots = ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'];

  const handleBook = () => {
    if (selectedDate && selectedSlot) {
      setBooked(true);
      setTimeout(() => setBooked(false), 3000);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Booking Calendar</h2>
        <p className="text-slate-500">Pick a time to connect with your mentor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-700">May 2024</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg"><ChevronLeft size={20} /></button>
              <button className="p-2 hover:bg-slate-50 rounded-lg"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">{d}</div>
            ))}
            {Array.from({ length: 3 }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                  selectedDate === day 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border p-6 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              Available Slots
            </h3>
            {selectedDate ? (
              <div className="space-y-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full py-3 rounded-xl border text-sm font-semibold transition-all ${
                      selectedSlot === slot 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic text-center py-8">Select a date to see available times</p>
            )}
          </div>

          <button 
            onClick={handleBook}
            disabled={!selectedDate || !selectedSlot}
            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              booked 
                ? 'bg-emerald-500 text-white' 
                : (!selectedDate || !selectedSlot)
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
            }`}
          >
            {booked ? (
              <><CheckCircle size={20} /> Session Booked!</>
            ) : (
              'Book Session'
            )}
          </button>
        </div>
      </div>

      <div className="mt-12 bg-indigo-50 p-6 rounded-3xl flex items-center gap-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900">Need a custom time?</h4>
          <p className="text-indigo-700/70 text-sm">You can message your mentor directly to arrange special sessions outside standard hours.</p>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
