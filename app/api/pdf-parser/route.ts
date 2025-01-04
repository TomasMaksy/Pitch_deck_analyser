import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import PDFParser from "pdf2json";
import { v4 as uuidv4 } from "uuid";
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsedTexts: { fileName: string; parsedText: string }[] = [];

  // Retrieve the model from the form data
  const model = formData.get("model");
  if (!model || typeof model !== "string") {
    return NextResponse.json({ error: "Model is required" }, { status: 400 });
  }
  console.log("Model detected:", model);

  if (!formData) {
    return NextResponse.json({ error: "No files were uploaded." });
  }

  // Loop through each file in the formData
  for (let [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      const file = value as File;
      console.log("File detected:", file.name);

      // Generate a unique file name
      const fileName = uuidv4();
      const tempFilePath = `/tmp/${fileName}.pdf`;

      // Convert the uploaded file into a temporary file
      const fileBuffer = Buffer.from(await value.arrayBuffer());
      await fs.writeFile(tempFilePath, fileBuffer);

      const pdfParser = new (PDFParser as any)(null, 1);

      const parsingPromise = new Promise<string>((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData: any) => {
          console.error(errData.parserError);
          reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", () => {
          const parsedText = (pdfParser as any).getRawTextContent();
          resolve(parsedText); // Resolve with parsed text
        });
      });

      // Load and parse the PDF
      await pdfParser.loadPDF(tempFilePath);
      const parsedText = await parsingPromise;

      // Store parsed text with file name
      parsedTexts.push({ fileName: file.name, parsedText });
    }
  }

  try {
    // console.log("Sending parsedTexts to GPT query API:", parsedTexts);

    // Send the parsed results to GPT query API
    const gptResponse = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/gpt-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parsedTexts, model }), // Make sure it's an array
    });

    if (!gptResponse.ok) {
      throw new Error("Failed to get GPT response");
    }

    const reader = gptResponse.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    const stream = new ReadableStream({
      start(controller) {
        const push = async () => {
          const { done: chunkDone, value: chunk } = await reader!.read();
          done = chunkDone;
          if (done) {
            controller.close();
            return;
          }
          const chunkText = decoder.decode(chunk, { stream: true });
          controller.enqueue(chunkText); // Send each chunk to the client
          push(); // Recursively read the next chunk
        };

        push(); // Start streaming chunks
      }
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error querying GPT:", error);
    return NextResponse.json({ error: "Failed to query GPT." }, { status: 500 });
  }
}