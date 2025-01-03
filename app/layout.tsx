import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { Provider } from "react-redux";
import store from "./redux/store";
import Script from "next/script";
import "react-day-picker/style.css";

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
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NEZBLNTKC1"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NEZBLNTKC1');
            `,
          }}
        ></script>
      </head>

      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
