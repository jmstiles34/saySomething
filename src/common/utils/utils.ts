export const convertToMinutesAndSeconds = (totalSeconds: number) => {
  // Handle negative numbers and non-numeric inputs
  if (typeof totalSeconds !== "number" || isNaN(totalSeconds)) {
    throw new Error("Input must be a valid number");
  }

  // Ensure we're working with a positive integer
  totalSeconds = Math.floor(Math.abs(totalSeconds));

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Return formatted object
  return {
    minutes,
    seconds,
    formatted: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    totalSeconds,
  };
};

export const formatCallDuration = (totalSeconds: number) => {
  const minutesAndSeconds = convertToMinutesAndSeconds(totalSeconds);

  if (totalSeconds < 60) {
    return `${minutesAndSeconds.seconds}sec`;
  }

  return `${minutesAndSeconds.minutes}min ${minutesAndSeconds.seconds}sec`;
};

export const formatCamelCase =(str:string) => {
  return str
      .replace(/([A-Z])/g, ' $1')  // Insert space before capital letters
      .replace(/^./, char => char.toUpperCase());  // Capitalize first letter
}

export const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  // Remove non-digit characters
  const phoneNumber = value.replace(/\D/g, "");

  // Break into segments based on length
  if (phoneNumber.length < 4) {
    return phoneNumber;
  } else if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6)}`;
  } else {
    // Handle international or extended numbers
    return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(
      1,
      4
    )}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 11)}`;
  }
};


export const getOrdinalSuffix = (n:number) => {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};