import { action } from 'satcheljs';
export const setQuery = action('setQuery', (query: string) => ({
    query
}));

