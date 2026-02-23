// Shared utility for resolving localized strings from commercetools objects
// Usage: getLocalizedString(localizedField)

export function getLocalizedString(localized?: Record<string, string>): string {
  if (!localized) return "";
  return (
    localized["en-US"] ||
    localized["en"] ||
    Object.values(localized)[0] ||
    ""
  );
}
