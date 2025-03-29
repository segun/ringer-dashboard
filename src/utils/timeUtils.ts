export interface StatusEntry {
  time: string;
  date: string;
  timestamp?: number; // Add the original timestamp
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
 * Safely get a timestamp from either the timestamp property or parsed from date/time strings
 */
function getEntryTimestamp(entry: StatusEntry): number {
  if (entry.timestamp !== undefined) {
    return entry.timestamp;
  }
  return parseDate(entry.date, entry.time).getTime();
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
        // Get timestamp using our safe helper function
        const entryTime = getEntryTimestamp(entry);
        
        if (isNaN(entryTime)) {
          return { ...entry, duration: "Invalid date" };
        }
        
        const diffMs = currentTime.getTime() - entryTime;
        
        // Ensure we don't show negative durations
        if (diffMs < 0) {
          return { ...entry, duration: "0m", durationMinutes: 0 };
        }
        
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
      // Get timestamps using our safe helper function
      const currentTime = getEntryTimestamp(entry);
      const nextTime = getEntryTimestamp(data[index + 1]);
      
      if (isNaN(currentTime) || isNaN(nextTime)) {
        return { ...entry, duration: "Invalid date" };
      }
      
      const diffMs = nextTime - currentTime;
      
      // Ensure we don't show negative durations
      if (diffMs < 0) {
        return { ...entry, duration: "0m", durationMinutes: 0 };
      }
      
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

/**
 * Parse date and time strings into a Date object
 * This is a fallback for when timestamps aren't available
 */
function parseDate(dateStr: string, timeStr: string): Date {
  try {
    // Extract components
    const [day, month, year] = dateStr.split('/').map(n => parseInt(n, 10));
    const [hour, minute, secondStr] = timeStr.split(':');
    const second = secondStr ? parseInt(secondStr, 10) : 0;
    
    // Create date using UTC to avoid timezone issues
    return new Date(Date.UTC(year, month - 1, day, parseInt(hour, 10), parseInt(minute, 10), second));
  } catch (e) {
    console.error("Error parsing date:", e);
    return new Date(NaN); // Invalid date
  }
}
