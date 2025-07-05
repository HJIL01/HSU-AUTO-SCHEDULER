import path from "path";
import fs from "fs/promises";
import { MajorType } from "types/majorType";

export async function logError(
  index: number,
  major: MajorType,
  message: string
): Promise<void> {
  const timestemp = new Date().toISOString();
  const logLine = `${timestemp} [index=${index}] [majorCode=${major.majorCode}] [majorName=${major.majorName}] [major] ${message}\n`;

  const logDir = path.resolve(__dirname, "../logs");
  const logFile = path.join(logDir, "errors.log");

  try {
    await fs.mkdir(logDir, { recursive: true });
    await fs.appendFile(logFile, logLine);
  } catch (err) {
    console.error("로그 파일 저장 실패:", err);
  }
}
