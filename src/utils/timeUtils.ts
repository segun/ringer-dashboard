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
 */
export const calculateDurations = (data: StatusEntry[]): StatusEntryWithDuration[] => {
  return data.map((entry, index) => {
    // For the last entry, we don't have a next entry to compare with
    if (index === data.length - 1) {
      return { ...entry, duration: "N/A" };
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
