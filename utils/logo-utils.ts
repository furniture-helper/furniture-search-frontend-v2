const BRAND_LOGOS: Record<string, string> = {
    "idealz.lk": "/assets/logos/idealz.lk.png",
};

export function getBrandLogo(domain: string): string {
    return BRAND_LOGOS[domain] ?? "/assets/no_image_available.png";
}