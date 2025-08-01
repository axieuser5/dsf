"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "../lib/utils"

// Button variants for the calendar
const buttonVariants = {
  outline: "border border-slate-300 bg-white hover:bg-slate-50 hover:text-slate-900",
  ghost: "hover:bg-slate-100 hover:text-slate-900",
}

interface CalendarProps extends React.ComponentProps<typeof DayPicker> {
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (time: string) => void;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDateSelect,
  onTimeSelect,
  ...props
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  const availableTimes = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    if (onTimeSelect) {
      onTimeSelect(time);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-800 mb-4">Välj datum och tid</h3>
        
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          showOutsideDays={showOutsideDays}
          className={cn("p-3", className)}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-slate-300 rounded-md hover:bg-slate-50"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-slate-500 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-blue-100/50 [&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md transition-colors"
            ),
            day_range_end: "day-range-end",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
            day_today: "bg-blue-50 text-blue-600 font-semibold",
            day_outside: "day-outside text-slate-400 aria-selected:bg-blue-100/50 aria-selected:text-slate-400",
            day_disabled: "text-slate-400 opacity-50",
            day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-600",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            IconLeft: ({ className, ...props }) => (
              <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
            ),
            IconRight: ({ className, ...props }) => (
              <ChevronRight className={cn("h-4 w-4", className)} {...props} />
            ),
          }}
          {...props}
        />
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
                className={cn(
                  "p-2 text-sm border rounded-lg transition-colors",
                  selectedTime === time
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                )}
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
}

Calendar.displayName = "Calendar"

export { Calendar }

export default Calendar