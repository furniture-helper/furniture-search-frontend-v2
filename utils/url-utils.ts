export function normalizeUrl(url: string): string {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
        return trimmedUrl;
    }

    if (trimmedUrl.startsWith("//")) {
        return `https:${trimmedUrl}`;
    }

    if (trimmedUrl.startsWith("www.")) {
        return `https://${trimmedUrl}`;
    }

    if (trimmedUrl.startsWith("https://") || trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("/")) {
        return trimmedUrl;
    }

    return "";
}

export function getDomainFromUrl(url: string): string {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname.replace(/^www\./i, "");
    } catch (error) {
        console.error("Invalid URL:", url, error);
        return "";
    }
}