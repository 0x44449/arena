export function formatDate(format: string, date: Date = new Date()): string {
  const pad = (n: number, len = 2) => n.toString().padStart(len, '0');

  const map: Record<string, string> = {
    'YYYY': date.getFullYear().toString(),
    'MM': pad(date.getMonth() + 1),
    'DD': pad(date.getDate()),
    'HH': pad(date.getHours()),
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds()),
    'SSS': pad(date.getMilliseconds(), 3),
  };

  return Object.entries(map).reduce(
    (acc, [token, value]) => acc.replace(new RegExp(token, 'g'), value),
    format
  );
}