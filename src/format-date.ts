const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', DATE_FORMAT);
}
