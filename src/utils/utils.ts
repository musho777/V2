/**
 * Converts an array or object of configurations to Select options array
 * @param data - Array or object with value, label, and optional properties
 * @returns Array of {value, label} for Select component
 */
type SelectOptionItem = {
  id?: string | number;
  value?: string | number;
  label?: string;
  name?: string;
  typeName?: string;
  firstName?: string;
  lastName?: string;
  userId?: string | number;
  user?: string;
};

type ResponseWithContent = {
  content: SelectOptionItem[];
};

export const toSelectOptions = (
  data:
    | Array<SelectOptionItem>
    | Record<string, SelectOptionItem>
    | ResponseWithContent,
): Array<{ value: string | number; label: string }> => {
  const items =
    'content' in data
      ? data.content
      : Array.isArray(data)
        ? data
        : Object.values(data);

  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const value = item.value ?? item.id ?? item.typeName ?? item.userId ?? '';
    const label =
      item.label ??
      item.typeName ??
      item.name ??
      item.user ??
      (item.firstName && item.lastName
        ? `${item.firstName} ${item.lastName}`
        : item.firstName) ??
      '';
    return { value, label };
  });
};

/**
 * Format date and time for display
 * @param date - Date string or Date object
 * @param dateOnly - If true, only return date without time
 * @returns Formatted date string
 */
export const formatDateTime = (
  date: string | Date | number | null | undefined,
  dateOnly = false,
): string => {
  if (!date) return '-';

  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  if (!dateObj || isNaN(dateObj.getTime())) return '-';

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  if (dateOnly) {
    return `${year}-${month}-${day}`;
  }

  return `${year}.${month}.${day}`;
};

/**
 * Strips HTML tags from a string
 * @param html - HTML string to strip tags from
 * @returns Plain text content without HTML tags
 */
export const stripHtmlTags = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};
