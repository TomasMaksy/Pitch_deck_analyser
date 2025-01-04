import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const maxDuration = 60;
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
  try {
    // Log the raw request body to debug what is coming in
    const requestBody = await request.json();

    // Get the parsedTexts from the request body
    const { parsedTexts, model } = requestBody;

    if (!Array.isArray(parsedTexts)) {
      console.error("parsedTexts is not an array or is missing.");
      return NextResponse.json({ error: "Invalid input: parsedTexts must be an array." }, { status: 400 });
    }

    const responses: string[] = [];

    // Loop through each parsedText and process them
    for (const parsedText of parsedTexts) {
      
        // console.log("Parsed Text:", parsedText.parsedText);
        // console.log("Model used in the query:", model);

      const prompt = `
You are an investor looking at companies to invest in. You are provided with a pitch deck from a company and you need to check whether it meets your requirements.

The first thing you should do is identify:
- the industry
- their geography (location - Please highlight this issue since we cannot invest in companies outside of Europe or Israel.)
If you can't find this information

You are an investor reviewing a company's pitch deck. The goal is to check if the company meets your investment criteria. The first thing you should do is identify:

- **Industry:** [Industry Result]
- **Location:** [Location Result]
- **Stage:** [Stage Result] 

If you can’t find any of these details, set them to unknown.

For the stage we mainly invest in Pre-seed Seed, Series A, etc.
Please check if the company is incorporated in Europe or Israel. If yes, return a tick (✔️) with the location. If no, return a cross (❌) with the location. If you can’t determine the location leave 'unknown'.

### Team:
**1. Do founders have relevant experience in the field?**
**2. Have the founders previously worked together?**
**3. Have one or more of the founders built a business before?**

### Business Model:
**1. Is the business easily scalable?**
**2. Can the business add new product lines, services, or upsell the customer down the line?**
**3. Is the business model immune or strongly resistant to likely external shocks?**

### Traction:
**1. Does the business have initial customers?**
**2. Does the business exhibit rapid growth?**
**3. Is there indication of good customer retention?**

Please answer these questions based on the pitch deck you have been provided. Be concise and rigorous, avoiding vagueness. Do not add any commentary other than the answers to these questions.

Return the results in markdown format with the questions as shown above. Use ## for Team/Business Model/Traction headings. Do not add a title or extra commentary.
${parsedText.parsedText}
      `;

      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
      });


      // Get the response for each parsedText
      const response = await openai.chat.completions.create({
        model: model, // Ensure the model ID is correct
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: false,
      });

    //   console.log("API Response:", response.choices[0].message.content);


      // Extract and return the GPT response
      const fullResponse = response.choices[0].message.content || "No response";
      responses.push(fullResponse);
    }

    return NextResponse.json({ gptOutputs: responses });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}