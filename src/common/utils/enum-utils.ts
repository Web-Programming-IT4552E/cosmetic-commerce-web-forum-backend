/**
 * Get enum keys
 * @param en Input enum
 * @returns Array of enum keys
 */
export function getEnumKeys(en: Record<string, string | number>): string[] {
  return Object.keys(en).filter((key) => Number.isNaN(+key));
}

/**
 * Get enum values
 * @param en Input enum
 * @returns Array of enum values
 */
export function getEnumValues(
  en: Record<string, string | number>,
): (string | number)[] {
  const set = new Set<string | number>();
  const keys = getEnumKeys(en);
  const values = keys
    .map((key) => en[key])
    .filter((value) => {
      if (set.has(value)) return false;
      set.add(value);
      return true;
    });

  return values;
}
