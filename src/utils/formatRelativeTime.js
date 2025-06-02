import { format, parseISO } from 'date-fns';

export function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = parseISO(dateString);
        return format(date, 'yyyy.MM.dd');
    } catch {
        return '';
    }
}