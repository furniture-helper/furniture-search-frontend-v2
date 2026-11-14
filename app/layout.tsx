import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Where can I buy this?",
    description: "Price history tracking and cross-site product matching for Sri Lankan retailers",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <body className="min-h-screen flex flex-col bg-background font-sans">
        <Header/>
        <main className="flex min-h-[calc(100vh-72px)] flex-col p-10">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}
