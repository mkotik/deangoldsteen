import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { Provider } from "react-redux";
import store from "./redux/store";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Open Mic Directory - Find Open Mics Near You",
  description:
    "Find open mic events in your city across the US, Canada, and Europe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/react-day-picker@8.7.1/dist/style.min.css"
        />
      </head>

      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
