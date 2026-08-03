import { Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "NipeKazi",
  description: "Tanzania's Premier Freelance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
