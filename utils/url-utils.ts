export function normalizeUrl(url: string): string {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
        return trimmedUrl;
    }

    if (trimmedUrl.startsWith("//")) {
        return `https:${trimmedUrl}`;
    }

    if (trimmedUrl.startsWith("https://") || trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("/")) {
        return trimmedUrl;
    }

    return "";
}