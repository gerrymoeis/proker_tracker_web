'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pilih tanggal',
  disabled = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'dd MMMM yyyy') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 bg-background border rounded-md shadow-md">
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            <SimpleCalendar
              value={value}
              onChange={onChange}
            />
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange?.(undefined)}
              >
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange?.(new Date())}
              >
                Hari Ini
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface SimpleCalendarProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

function SimpleCalendar({ value, onChange }: SimpleCalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = React.useState(() => value || today);
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  // Get the number of days in the month
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  
  // Create an array of days to display
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
  }
  
  const previousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  
  const isSelectedDate = (date: Date) => {
    return value && 
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear();
  };
  
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={previousMonth}
        >
          &lt;
        </Button>
        <div className="font-medium">
          {format(viewDate, 'MMMM yyyy')}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
        >
          &gt;
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }
          
          return (
            <Button
              key={day.toISOString()}
              variant={isSelectedDate(day) ? 'default' : 'ghost'}
              className={cn(
                'h-8 w-8 p-0 font-normal',
                isToday(day) && 'border border-primary',
                isSelectedDate(day) && 'bg-primary text-primary-foreground'
              )}
              onClick={() => onChange?.(day)}
            >
              {day.getDate()}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
