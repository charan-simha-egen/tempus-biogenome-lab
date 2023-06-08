import { Storage } from "@google-cloud/storage";
import * as _path from "path";

// Create a GCS client
const storage = new Storage({
  projectId: "poc-lab-389020",
  keyFilename: `./poc-lab-key.json`,
});
const downloadFilePath = _path.join(__dirname, "../downloads/");

export async function filesList(bucketName: string): Promise<any> {
  try {
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles();
    return files.map((o: any) => o.metadata.name);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function uploadFile(
  bucketName: string,
  sourcefilePath: string,
  destinationFileName: string
): Promise<void> {
  try {
    const options = {
      destination: destinationFileName,
      preconditionOpts: { ifGenerationMatch: 0 },
    };
    await storage.bucket(bucketName).upload(sourcefilePath, options);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function downloadFile(
  bucketName: string,
  fileName: string,
  destinationFileName = _path.join(
    downloadFilePath,
    `downloaded_file_${Date.now()}.csv`
  )
): Promise<any> {
  try {
    const options = {
      destination: destinationFileName,
    };
    return await storage.bucket(bucketName).file(fileName).download(options);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function deleteFile(
  bucketName: string,
  fileName: string
): Promise<void> {
  try {
    const options = {
      preconditionOpts: { ifGenerationMatch: 0 },
    };
    await storage.bucket(bucketName).file(fileName).delete(options);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function processCsvFile(bucketName: string, fileName: string) {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    // Read the CSV file as a stream
    const stream = file.createReadStream();

    // Process the CSV data
    // ...

    console.log(`Processing file ${bucketName}/${fileName}`);
    // Write the modified data to a new stream
    const modifiedStream = stream;

    // Create a new file in the same bucket with the modified data
    const modifiedFileName = `modified_${fileName}`;
    const modifiedFile = bucket.file(modifiedFileName);
    modifiedStream.pipe(modifiedFile.createWriteStream());

    return modifiedFileName;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}
