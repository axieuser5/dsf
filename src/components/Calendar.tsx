import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (time: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, onTimeSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const monthNames = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
  ];

  const weekDays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

  const availableTimes = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    onDateSelect?.(selected);
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    onTimeSelect?.(time);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-2 text-sm rounded-lg transition-colors hover:bg-blue-100 hover:text-blue-600 ${
            isSelected 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : isToday 
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-slate-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 max-w-md mx-auto">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Välj datum och tid</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700 min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-xs font-medium text-slate-500 p-2 text-center">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-slate-600" />
            <h4 className="font-medium text-slate-700">Tillgängliga tider:</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availableTimes.map(time => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={`p-2 text-sm border rounded-lg transition-colors ${
                  selectedTime === time
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation */}
      {selectedDate && selectedTime && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Valt datum:</strong> {selectedDate.toLocaleDateString('sv-SE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-sm text-green-800">
            <strong>Vald tid:</strong> {selectedTime}
          </p>
          <button className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            Bekräfta bokning
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;