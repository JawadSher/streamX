import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export const uploadToLocalServer = async (file: File) => {
  if (!file) {
    return ({
      statusCode: 400,
      status: false, 
      message: "Failed to upload file.",
    });
  }
  if (file.size === 0) {
    return ({
      statusCode: 400,
      status: false, 
      message: "File is required.",
    });
  }

  try {
    const id = await uuidv4();
    const fileName = `${id}.jpg` || file.name;
    const data = await file.arrayBuffer();
    await fs.writeFile(
      `${process.cwd()}/public/${fileName}`,
      Buffer.from(data)
    );

    return ({
      statusCode: 200,
      status: true, 
      message: "File saved locally successfull",
      filePath: `D:/streamx/public/${fileName}`,
    });
  } catch (error: any) {
     return ({
      statusCode: 400,
      status: false, 
      message: "Failed to upload file.",
    });
  }
};
