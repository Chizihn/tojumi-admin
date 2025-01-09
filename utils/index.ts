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
export const capitalizeFirstChar = (string: any) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Capitalize all words
export const capitalizeWords = (string: any) => {
  return string.split(" ").map(capitalizeFirstChar).join(" ");
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
  return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
