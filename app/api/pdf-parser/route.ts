import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import PDFParser from "pdf2json";
import { v4 as uuidv4 } from "uuid";
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export async function POST(request: Request) {
  const formData = await request.formData();
  const parsedTexts: { fileName: string; parsedText: string }[] = [];

  const model = formData.get("model");
  if (!model || typeof model !== "string") {
    return NextResponse.json({ error: "Model is required" }, { status: 400 });
  }
  console.log("Model detected:", model);

  for (const [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      const file = value as File;
      console.log("File detected:", file.name, key);
      // Generate a unique file name
      const fileName = uuidv4();
      const tempFilePath = `/tmp/${fileName}.pdf`;
      // Convert the uploaded file into a temporary file
      const fileBuffer = Buffer.from(await value.arrayBuffer());
      await fs.writeFile(tempFilePath, fileBuffer);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParser = new (PDFParser as any)(null, 1);
      const parsingPromise = new Promise<string>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfParser.on("pdfParser_dataError", (errData: any) => {
          console.error(errData.parserError);
          reject(errData.parserError);
        });
        pdfParser.on("pdfParser_dataReady", () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parsedText = (pdfParser as any).getRawTextContent();
          resolve(parsedText); // Resolve with parsed text
        });
      });

      await pdfParser.loadPDF(tempFilePath);
      const parsedText = await parsingPromise;
      // console.log("Parsed text:", parsedText);
      parsedTexts.push({ fileName: file.name, parsedText });
    }
  }

  try {
    const gptResponse = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/gpt-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parsedTexts, model }),
    });

    if (!gptResponse.ok) {
      throw new Error("Failed to get GPT response");
    }

    const reader = gptResponse.body?.getReader();
    const decoder = new TextDecoder();
    const stream = new ReadableStream({
      start(controller) {
        async function push() {
          const { done, value } = await reader!.read();
          if (done) {
            controller.close();
            return;
          }
          const chunkText = decoder.decode(value, { stream: true });
          controller.enqueue(chunkText);
          push();
        }
        push();
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error querying GPT:", error);
    return NextResponse.json({ error: "Failed to query GPT." }, { status: 500 });
  }
}