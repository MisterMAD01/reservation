import type { Metadata } from "next";
import { QueueProvider } from "./context/QueueContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mistermad Queue | ระบบจองคิวออนไลน์",
  description: "ระบบจองคิวพรีเมียมผ่าน LINE LIFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <script src="https://static.line-scdn.net/liff/edge/2/sdk.js" async></script>
      </head>
      <body>
        <QueueProvider>
          {children}
        </QueueProvider>
      </body>
    </html>
  );
}
