import fs from "fs/promises";
import path from "path";

/**
 * @param filePath
 * @returns
 * @throws
 */
export async function deleteFromLocalServer(
  filePath: string
): Promise<boolean> {
  try {
    if (!filePath || typeof filePath !== "string") {
      console.error("Invalid file path: Path must be a non-empty string");
      return false;
    }
    const absolutePath = path.resolve(filePath);
    const allowedDirectory = path.resolve(process.cwd(), "public");
    if (!absolutePath.startsWith(allowedDirectory)) {
      console.error(
        "Security error: Attempted to delete file outside allowed directory"
      );
      return false;
    }

    try {
      await fs.access(absolutePath, fs.constants.F_OK);
    } catch {
      console.warn(`File does not exist: ${absolutePath}`);
      return false;
    }

    await fs.unlink(absolutePath);
    console.log(`Successfully deleted file: ${absolutePath}`);
    return true;
  } catch (err: any) {
    console.error(
      "Error deleting file:",
      err instanceof Error ? err.message : String(err)
    );
    return false;
  }
}
