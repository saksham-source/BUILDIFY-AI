import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buildify AI - Transform Ideas into Products",
  description: "Your AI-powered startup companion that transforms simple ideas into complete business plans and product specifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafafc] text-[#1a1a1c] relative font-sans w-full overflow-x-hidden">
        {/* Global Navigation */}
        <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-6 bg-white/40 backdrop-blur-md border-b border-white/20">
          <a href="/" className="font-bold text-2xl tracking-tight text-black flex items-center gap-2">
            Buildify AI
          </a>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-gray-800 tracking-wider">
            <a href="#" className="hover:text-black transition-colors">PLATFORM</a>
            <a href="#" className="hover:text-black transition-colors">DEVELOPERS</a>
            <a href="#" className="hover:text-black transition-colors">RESOURCES</a>
            <a href="#" className="hover:text-black transition-colors">COMPANY</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-full bg-[#1e1e20] text-white text-[13px] font-medium hover:bg-black transition-all shadow-md">
              Experience AI
            </button>
            <button className="hidden sm:block px-5 py-2.5 rounded-full bg-white text-black border border-gray-200 text-[13px] font-medium hover:bg-gray-50 transition-all shadow-sm">
              Talk to Sales
            </button>
          </div>
        </nav>

        {/* Global Background Gradient */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#fde6d8]/80 via-[#e0efff]/60 to-[#fafafc] blur-3xl opacity-80" />
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#fca5a5]/30 rounded-[100%] blur-[100px]" />
          <div className="absolute top-[100px] left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-[#93c5fd]/30 rounded-[100%] blur-[100px]" />
        </div>

        <div className="pt-24 relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}
