import {
  format,
  isToday,
  formatDistanceToNow,
  isYesterday,
  parseISO,
} from "date-fns";
import { ServiceType } from "@/types/user";

//calcuate age from date of birth
export const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // If birthday hasn't occurred yet this year, subtract 1 from age
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1;
  }
  return age;
};

//Capitalize first character of word
export const capitalizeFirstChar = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Capitalize all words
export const capitalizeWords = (string: string) => {
  return string.split(" ").map(capitalizeFirstChar).join(" ");
};

export const formatAmenity = (string: string): string => {
  return capitalizeFirstChar(string.replace(/_/g, " "));
};

//fuction to format duration
export function getDurationLabel(
  duration: number,
  serviceType: ServiceType
): string {
  switch (serviceType) {
    case ServiceType.HOURLY:
      return duration === 1 ? "hour" : "hours";
    case ServiceType.DAILY:
      return duration === 1 ? "day" : "days";
    case ServiceType.WEEKLY:
      return duration === 1 ? "week" : "weeks";
    case ServiceType.MONTHLY:
      return duration === 1 ? "month" : "months";
    case ServiceType.YEARLY:
      return duration === 1 ? "year" : "years";
    default:
      return "N/A";
  }
}

//format money
export const formatMoney = (amount: number): string => {
  return amount
    ?.toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatDateForFrontend = (dateString: string): string => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${month}-${day}-${year}`;
};

export const formatDateForBackend = (dateString: string): string => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

export const formattedTimestamp = (
  timestamp?: string | number | Date
): string => {
  if (!timestamp) return "Invalid Date";

  let date: Date;
  try {
    if (typeof timestamp === "string") {
      date = parseISO(timestamp);
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    if (isToday(date)) {
      const hoursDiff = Math.abs(new Date().getHours() - date.getHours());
      if (hoursDiff < 1) {
        // Less than an hour ago
        const minutes = Math.floor(
          (new Date().getTime() - date.getTime()) / 60000
        );
        if (minutes < 1) return "Just now";
        if (minutes === 1) return "1 minute ago";
        return `${minutes} minutes ago`;
      }
      return `${hoursDiff} ${hoursDiff === 1 ? "hour" : "hours"} ago`;
    }

    if (isYesterday(date)) {
      return "Yesterday";
    }

    // Use formatDistanceToNow for dates within the past year
    const distanceString = formatDistanceToNow(date, { addSuffix: true });

    // For dates more than a year ago, show the full date
    const yearsAgo = new Date().getFullYear() - date.getFullYear();
    if (yearsAgo > 1) {
      return format(date, "MMM d, yyyy");
    }

    return capitalizeFirstChar(distanceString);
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Invalid Date";
  }
};

export const formatScheduleDate = (date: Date | string): string => {
  // Convert string to Date if needed
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  // Format options for toLocaleDateString
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full day name (e.g., "Monday")
    month: "long", // Full month name (e.g., "February")
    day: "numeric", // Day of the month (e.g., "25")
    year: "numeric", // 4-digit year (e.g., "2025")
  };

  // Return the formatted date
  return dateObj.toLocaleDateString("en-US", options);
};

export const formatTimeForDisplay = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  let formattedHour = parseInt(hour, 10);
  const period = formattedHour >= 12 ? "PM" : "AM";

  if (formattedHour > 12) {
    formattedHour -= 12;
  } else if (formattedHour === 0) {
    formattedHour = 12;
  }

  return `${formattedHour}:${minute} ${period}`;
};

export const convertTo12HourFormat = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  let formattedHour = parseInt(hour, 10);
  const period = formattedHour >= 12 ? "PM" : "AM";

  if (formattedHour > 12) {
    formattedHour -= 12;
  } else if (formattedHour === 0) {
    formattedHour = 12;
  }

  return `${formattedHour}:${minute} ${period}`;
};

export const currencyFormatter = (amount: number, currency: string) => {
  if (currency === "NGN") {
    return `₦${amount.toLocaleString("en-NG")}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
