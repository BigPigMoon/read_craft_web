import type { Tokens } from "../types/tokens"

const ACCESS = 'access';
const REFRESH = 'refresh';

export const getTokens = (): Tokens | null => {
    const access = localStorage.getItem(ACCESS);
    const refresh = localStorage.getItem(REFRESH);

    if (!access || !refresh)
        return null;

    return { access, refresh }
}

export const setTokens = (tokens: Tokens) => {
    localStorage.setItem(ACCESS, tokens.access);
    localStorage.setItem(REFRESH, tokens.refresh)
}

export const clearTokens = () => {
    localStorage.setItem(ACCESS, '');
    localStorage.setItem(REFRESH, '');
}