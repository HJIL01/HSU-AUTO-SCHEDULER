import type { Metadata } from "next";
import "./../styles/globals.css";
import RQProvider from "@/components/RQProvider";
import RHFProvider from "@/components/RHFProvider";
import ResponsiveProvider from "@/components/ResponsiveProvider";

export const metadata: Metadata = {
  title: "HSU Auto Scheduler",
  description: "한성대학교 시간표를 자동으로 추천해주는 웹서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <html lang="ko">
      <body>
        <RQProvider>
          <RHFProvider>
            <ResponsiveProvider initialDevice={isMobile ? "mobile" : "desktop"}>
              {children}
            </ResponsiveProvider>
          </RHFProvider>
        </RQProvider>
      </body>
    </html>
  );
}
