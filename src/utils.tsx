import { Schedule } from './types';
import { format, addMinutes } from 'date-fns';

export const getNextActivation = (schedules: Schedule[], currentDate: Date = new Date()): string | null => {
  // Your logic to calculate the next activation time
  // This is a simplified example, it should be adjusted according to the exact requirements
  for (const schedule of schedules) {
    for (const weekday of schedule.weekdays) {
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
      const nextDate = addMinutes(new Date(), startHour * 60 + startMinute);
      console.log("@@@@nextDate",schedules,nextDate,currentDate);
      
      if (nextDate > currentDate) {
        return format(nextDate, 'yyyy-MM-dd HH:mm');
      }
    }
  }
  return null;
};
