import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<!DOCTYPE html>');
const domPurify = DOMPurify(window);

function trim(text: string): string {
    return text ? text.trim() : text;
}

function normalize(text: string): any {
    if (text === 'true') return true;
    if (text === 'false') return false;
    return text;
}

function sanitize(unsafeText: string): string {
    return normalize(trim(domPurify.sanitize(unsafeText)));
}

function sanitizeObject(object: Record<string, any>): Record<string, any> {
    Object.keys(object).forEach(key => {
        const value = object[key];

        if (!value) {
            return;
        }

        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                object[key] = value.map(item => {
                    if (typeof item === 'string') {
                        return sanitize(item);
                    }
                    return sanitizeObject(item);
                });
            } else {
                sanitizeObject(value as Record<string, unknown>);
            }
            return;
        }

        if (typeof value === 'string') {
            object[key] = sanitize(value);
        }
    });

    return object;
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, ' ');
}

function stripPrepositions(text: string): string {
    return text.replace(/( das )|( des )|( dos )|( da )|( do )|( de )|( a )/gi, '');
}

function stripAddressWords(text: string): string {
    return text.replace(/(rua )|(avenida )|(rodovia )/gi, '');
}

export default function stripSpecialCharacters(text: string): string {
    return text.replace(/[^a-zA-Z0-9]/g, '');
}

function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function stripLineBreaks(text: string): string {
    return text.replace(/(\\n)|(<br>)|(<br\/>)/gi, '');
}

function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength);
}

export {
    sanitize,
    sanitizeObject,
    stripHtml,
    stripPrepositions,
    stripAddressWords,
    stripSpecialCharacters,
    capitalize,
    stripLineBreaks,
    truncate,
};
