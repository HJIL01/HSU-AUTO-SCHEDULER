import type { Metadata } from "next";
import "./../styles/globals.css";

export const metadata: Metadata = {
  title: "HSU Auto Scheduler",
  description: "한성대학교 시간표를 자동으로 추천해주는 웹서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
