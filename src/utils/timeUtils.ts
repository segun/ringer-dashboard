export interface StatusEntry {
  time: string;
  date: string;
  power: number;
  status: string;
  location?: string;
  manualLocation?: boolean;
}

export interface StatusEntryWithDuration extends StatusEntry {
  duration: string;
  durationMinutes?: number;
}

/**
 * Calculate durations between status entries.
 * For each entry, the duration represents the time until the next entry.
 * If currentTime is provided, it will be used to calculate the duration
 * for the last entry instead of showing "N/A".
 */
export const calculateDurations = (data: StatusEntry[], currentTime?: Date): StatusEntryWithDuration[] => {
  return data.map((entry, index) => {
    // For the last entry, use currentTime if provided
    if (index === data.length - 1) {
      if (!currentTime) {
        return { ...entry, duration: "N/A" };
      }
      
      try {
        // Convert last entry time to Date
        const [day, month, year] = entry.date.split('/');
        const [hour, minute, second] = entry.time.split(':');
        
        // Create Date object with explicit parameters
        const entryDateTime = new Date(
          parseInt(year), parseInt(month) - 1, parseInt(day), 
          parseInt(hour), parseInt(minute), parseInt(second || '0')
        );
        
        if (isNaN(entryDateTime.getTime())) {
          return { ...entry, duration: "Invalid date" };
        }
        
        const diffMs = currentTime.getTime() - entryDateTime.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        let duration = "";
        if (diffHours > 0) {
          duration += `${diffHours}h `;
        }
        duration += `${diffMinutes}m`;
        
        // Also include the raw duration in minutes for sorting/graphing
        const durationMinutes = diffHours * 60 + diffMinutes;

        return { ...entry, duration, durationMinutes };
      } catch (error) {
        console.error("Error calculating duration for last entry:", error);
        return { ...entry, duration: "Error" };
      }
    }

    try {
      // Current entry time
      const [day, month, year] = entry.date.split('/');
      const [hour, minute, second] = entry.time.split(':');
      
      // Next entry time
      const [nextDay, nextMonth, nextYear] = data[index + 1].date.split('/');
      const [nextHour, nextMinute, nextSecond] = data[index + 1].time.split(':');
      
      // Create Date objects with explicit parameters to avoid parsing issues
      const currentDateTime = new Date(
        parseInt(year), parseInt(month) - 1, parseInt(day), 
        parseInt(hour), parseInt(minute), parseInt(second || '0')
      );
      
      const nextDateTime = new Date(
        parseInt(nextYear), parseInt(nextMonth) - 1, parseInt(nextDay), 
        parseInt(nextHour), parseInt(nextMinute), parseInt(nextSecond || '0')
      );
      
      if (isNaN(currentDateTime.getTime()) || isNaN(nextDateTime.getTime())) {
        return { ...entry, duration: "Invalid date" };
      }
      
      const diffMs = nextDateTime.getTime() - currentDateTime.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let duration = "";
      if (diffHours > 0) {
        duration += `${diffHours}h `;
      }
      duration += `${diffMinutes}m`;
      
      // Also include the raw duration in minutes for sorting/graphing
      const durationMinutes = diffHours * 60 + diffMinutes;

      return { ...entry, duration, durationMinutes };
    } catch (error) {
      console.error("Error calculating duration:", error);
      return { ...entry, duration: "Error" };
    }
  });
};
