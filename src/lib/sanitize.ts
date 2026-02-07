/**
 * Simple HTML Sanitizer to prevent Basic XSS
 * Ideally, use 'dompurify' library in production.
 */
export function sanitizeHtml(html: string): string {
    if (!html) return '';

    // 1. Remove script tags completely
    let clean = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");

    // 2. Remove event handlers (onclick, onerror, etc.)
    clean = clean.replace(/ on\w+="[^"]*"/g, "");
    clean = clean.replace(/ on\w+='[^']*'/g, "");

    // 3. Remove javascript: protocol
    clean = clean.replace(/href="javascript:[^"]*"/g, 'href="#"');

    // 4. Remove iframe, object, embed
    clean = clean.replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, "");
    clean = clean.replace(/<object\b[^>]*>([\s\S]*?)<\/object>/gim, "");

    return clean;
}
