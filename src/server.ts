import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import * as _gcService from "./gcp-module/gcp.service";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// POST API endpoint
app.get("/api/files", async (req: Request, res: Response) => {
  try {
    const { bucketName } = req.body;
    const response = await _gcService.filesList(bucketName);
    console.log(`Files in bucket ${bucketName}:`, response);
    res.json({
      message: "Files list fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/download-file", async (req: Request, res: Response) => {
  try {
    const { bucketName, fileName } = req.body;
    console.log(`Downloading file ${bucketName}/${fileName}`);
    const response = await _gcService.downloadFile(bucketName, fileName);
    res.json({ message: "File downloaded successfully", response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/upload-file", async (req: Request, res: Response) => {
  try {
    const { bucketName, sourcefilePath, destinationFileName } = req.body;
    console.log(
      `Uploading file from ${sourcefilePath} to ${bucketName}/${destinationFileName}`
    );
    const response = await _gcService.uploadFile(
      bucketName,
      sourcefilePath,
      destinationFileName
    );
    res.json({ message: "File uploaded successfully", response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/delete-file", async (req: Request, res: Response) => {
  try {
    const { bucketName, fileName } = req.body;
    console.log(`Deleting file ${bucketName}/${fileName}`);
    const response = await _gcService.deleteFile(bucketName, fileName);
    res.json({ message: "File deleted successfully", response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port}`);
});
