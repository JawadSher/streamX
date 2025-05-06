import fs from "fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { imageFileConfigs } from "@/constants/fileConfig";

export const imageFileTypeChecker = async (filePath: string): Promise<boolean> => {
  try {
    const FILE_TYPE_CHECK_SIZE = 4100;

    const fileBuffer = await fs.readFile(filePath);
    const detected = await fileTypeFromBuffer(fileBuffer.slice(0, FILE_TYPE_CHECK_SIZE));

    if (!detected) return false;

    const normalizedExt = detected.ext === "jpeg" ? "jpg" : detected.ext;

    return imageFileConfigs.ALLOWED_FILE_TYPES.includes(normalizedExt as any);
  } catch (err: unknown) {
    console.error("Error checking file type:", err instanceof Error ? err.message : String(err));
    return false;
  }
};
