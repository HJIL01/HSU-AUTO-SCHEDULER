"use client";

type Props = {
  title?: string;
  description?: string;
};

export default function Head({ title, description }: Props) {
  const fullTitle = title || "HSU AUTO Schedulder";
  const fullDescription =
    description || "한성대학교 시간표를 자동으로 추천해주는 웹서비스입니다.";

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
    </>
  );
}
