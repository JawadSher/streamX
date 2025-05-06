"use server";
import { actionError } from "@/lib/actions-templates/ActionError";
import { actionResponse } from "@/lib/actions-templates/ActionResponse";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export const uploadToLocalServer = async (file: File) => {
  if (!file) {
    return actionError(400, "File not found", null);
  }
  if (file.size === 0) {
    return actionError(400, "File is empty", null);
  }

  try {
    const id = await uuidv4();
    const fileName = `${id}.jpg` || file.name;
    const data = await file.arrayBuffer();
    await fs.writeFile(
      `${process.cwd()}/public/${fileName}`,
      Buffer.from(data)
    );

    return actionResponse(200, "File saved locally successfull", {
      filePath: `D:/streamx/public/${fileName}`,
    });
  } catch (error: any) {
    return actionError(400, "Failed to save file", error);
  }
};
