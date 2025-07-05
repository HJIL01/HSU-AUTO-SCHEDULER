export function splitMajorCodeAndName(majorNameWithCode: string): string {
  // 공백이 두 개 이상 넣어졌을수도 있으니 혹시 몰라서 2개 이상을 1개로 치환
  majorNameWithCode = majorNameWithCode.replace(/\s+/g, " ");
  const [majorCode, ...majorName] = majorNameWithCode.split(" ");

  return majorName.join(" ");
}
