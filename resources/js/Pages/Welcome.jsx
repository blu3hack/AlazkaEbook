import { Link } from "@inertiajs/react";
import React from "react";

export default function Welcome({
    auth,
    laravelVersion = "11.x",
    phpVersion = "8.3",
}) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-gray-800 antialiased">
            {/* Header */}
            <header className="relative z-10 border-b border-green-500/40 py-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">
                            <svg
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            Alazka Ebook
                        </h2>
                    </div>
                    {auth?.user ? (
                        <a
                            href="/dashboard"
                            className="rounded-lg bg-white px-5 py-2 font-semibold text-green-700 shadow-md transition hover:bg-green-50"
                        >
                            Dashboard
                        </a>
                    ) : (
                        <div className="flex space-x-4"></div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 py-2 sm:py-24 lg:py-10">
                <div className="text-center">
                    {/* Hero Section */}
                    <div className="group relative mb-1 transform overflow-hidden rounded-3xl border border-gray-200 bg-white p-1 shadow-lg transition-all duration-500 hover:border-green-400 hover:shadow-2xl">
                        {/* Logo */}
                        <div className="mb-8 flex justify-center">
                            <div className="group relative">
                                <img
                                    src="/img/alazka-logo.png"
                                    alt="Logo Alazka"
                                    className="h-auto w-32 transform drop-shadow-xl filter transition-all duration-300 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        {/* Title & Subtitle */}
                        <h1 className="animate-fade-in mb-4 bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-center text-4xl font-bold text-transparent">
                            Welcome to Alazka Ebook
                        </h1>
                        <p className="mx-auto mb-8 max-w-md text-center text-lg leading-relaxed text-gray-600">
                            <span className="block">
                                Platform Interaktif Penunjang
                            </span>
                            <span className="mt-1 inline-block transform font-semibold text-green-700 transition-transform duration-200 hover:scale-105">
                                Skills dan Pembelajaran
                            </span>
                        </p>

                        {/* Login Button */}
                        <div className="flex justify-center">
                            <Link
                                href="/login"
                                className="group relative transform overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl"
                            >
                                <span className="relative flex items-center gap-2">
                                    Login
                                    <svg
                                        className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 translate-x-[-100%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]"></div>
                            </Link>
                        </div>

                        {/* Features Section */}
                        <div className="mt-1 grid gap-8 md:grid-cols-3">
                            {/* Card 1 */}
                            <FeatureCard
                                title="Cepat & Efisien"
                                description="Teknologi terdepan dengan optimisasi maksimal untuk memberikan performa luar biasa dalam setiap interaksi."
                                iconPath="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                            {/* Card 2 */}
                            <FeatureCard
                                title="100% Terpercaya"
                                description="Keamanan tingkat enterprise dengan enkripsi end-to-end menjamin data Anda selalu aman dan terlindungi."
                                iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                            {/* Card 3 */}
                            <FeatureCard
                                title="Intuitif & Mudah"
                                description="Desain yang memukau dengan UX yang sempurna, memungkinkan siapa saja langsung produktif."
                                iconPath="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// FeatureCard Component
const FeatureCard = ({ title, description, iconPath }) => (
    <div className="group relative transform overflow-hidden rounded-3xl border border-green-200 bg-green-50 p-8 shadow-lg transition-all duration-500 hover:scale-105 hover:border-green-400 hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-green-700">
                <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={iconPath}
                    />
                </svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-green-800">
                {title}
            </h3>
            <p className="leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                {description}
            </p>
        </div>
    </div>
);
