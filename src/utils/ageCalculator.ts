/**
 * Calculate age based on birth date
 * @param birthDate - Birth date in YYYY-MM-DD format or Date object
 * @returns Age in years
 */
export function calculateAge(birthDate: string | Date | null | undefined): number | null {
  if (!birthDate) return null;
  
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  
  // Validate date
  if (isNaN(birth.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // If birthday hasn't occurred this year yet, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= 0 ? age : null;
}

/**
 * Calculate age from birth year only
 * @param birthYear - Birth year
 * @returns Age in years
 */
export function calculateAgeFromYear(birthYear: number | null | undefined): number | null {
  if (!birthYear || birthYear <= 0) return null;
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  
  return age >= 0 ? age : null;
}
