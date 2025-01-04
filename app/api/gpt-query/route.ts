import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
    for (let parsedText of parsedTexts) {
      
        // console.log("Parsed Text:", parsedText.parsedText);
        // console.log("Model used in the query:", model);

      const prompt = `
        You are an investor looking at companies to invest in. You are provided with a pitch deck from a company and you need to check whether it meets your requirements. Please provide the response in a well-formatted manner with clear sections, bullet points, and newlines.

        The questions you need to answer are:
        Team:
        1. Do founders have relevant experience in the field?
        2. Have the founders previously worked together?
        3. Have one or more of the founders built a business before?

        Business Model:
        1. Is the business easily scalable?
        2. Can the business add new product lines, services, or upsell the customer down the line?
        3. Is the business model immune or strongly resistant to likely external shocks?

        Traction:
        1. Does the business have initial customers?
        2. Does the business exhibit rapid growth?
        3. Is there indication of good customer retention?

        Please answer these questions based on the pitch deck you have been provided. Avoid any other comments discussing what you have done. Be concise and show where you get your information from. 
        
        Return output in markdown fotmat with ## for Team/Business Model/Traction (keep it as it is here without adding words like evaluation) and ** for questions 1,2,3. Also avoid giving a title for your response
        The pitch deck is as follows:
        ${parsedText.parsedText}
      `;

      const openai = new OpenAI({
        // apiKey: OPENAI_API_KEY,
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