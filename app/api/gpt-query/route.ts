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
You are a professional venture capital analyst specializing in pre-seed, seed, and Series A investments, with a focus on climate-tech startups based in Europe or Israel. Your task is to evaluate pitch decks rigorously, identify alignment with your investment criteria, and provide a detailed breakdown of the evaluation. Some pitch decks should receive very small scores if overall you believe they don't align with our criteria or are actually poorly positioned. Other decks should receive higher points.

### Instructions:
1. Extract and analyze the following main details from the pitch deck:
   - **Company Name:** Extract the company name if mentioned. If not explicitly stated, note "Not mentioned."
   - **Industry:** Identify the industry and explain why you think this is the correct industry classification.
   - **Location:** Attempt to identify the company's location. Shortly explain your reasoning based on details in the pitch deck to make sure not hallucinating, max 1 sentence.
   - **Stage:** Determine the startup stage (pre-seed, seed, Series A, or other) and justify your answer based on details provided max 1 sentence

     If you identify a location or a stage that isn't aligned with our requirments give it an automatic 0 points and explain why.   

2. Evaluate the pitch deck using the following criteria:
   #### Team:
   1. **Do founders have relevant experience in the field?** Provide an explanation, especially if the deck claims experience but lacks specifics.
   2. **Have the founders previously worked together?** 0 if not mentioned, 0.5 if some mention, 1 if specifically described
   3. **Have one or more of the founders built a business before?** 0 if not mentioned (vague mention of experience in enterpreneurship doesn't count), no more than 0.5 if we only hear entrepreneurship experience, 1 if there is a specific mention of a founder building a business before

   #### Business Model:
   1. **Is the business easily scalable?** An example of an easily scalable can be a B2B SaaS
business or a software only business, an example of a difficult to scale would be a capex intensive hardware business.
   2. **Can the business add new product lines, services, or upsell customers down the line?** Base your answer on the information provided in the deck. 0 - no mention, 0.5 some mention, 1 specifics
   3. **Is the business model immune or strongly resistant to likely external shocks (e.g., geopolitical risks, regulatory changes, imports etc.)?** If the business is exposed to some risks then award 0, if it's very safe then 1

   #### Traction:
   1. **Does the business have initial customers?** 0 if not mentioned, 0.5 if vaguely mention or small number of customers, 1 if good specifics are mentioned
   2. **Does the business exhibit rapid growth?** Base your answer on specific growth metrics (e.g., GMV, ARR). Base on the deck, but also use your own knowledge of the field and industry in this specific criterion
   3. **Is there indication of good customer retention?** 0 if not mentioned, 0.5 if vaguely mentioned, 1 for good examples of why that is.

3. After completing the evaluation, calculate the final score (maximum 9) and provide a detailed summary.

4. Format the response as follows in markdown:
              **Company Name:** [Company Name]

              **Industry:** [Industry Result]

              **Location:** [Location Result]

              **Stage:** [Stage Result]

              <br>
              
              
              ## Team:

              **1.  Do founders have relevant experience in the field?** Explanation: [Explanation]. Evaluation: [Score].

              **2.  Have the founders previously worked together?** Explanation: [Explanation]. Evaluation: [Score].

              **3.  Have one or more of the founders built a business before?** Explanation: [Explanation]. Evaluation: [Score].



              ## Business Model:

              **1.  Is the business easily scalable?** Explanation: [Explanation]. Evaluation: [Score].

              **2.  Can the business add new product lines, services, or upsell customers down the line?** Explanation: [Explanation]. Evaluation: [Score].

              **3.  Is the business model immune or strongly resistant to likely external shocks (e.g., geopolitical risks, regulatory changes, etc.)?** Explanation: [Explanation]. Evaluation: [Score].

                

              ## Traction:

              **1.  Does the business have initial customers?** Explanation: [Explanation]. Evaluation: [Score].

              **2.  Does the business exhibit rapid growth?** Explanation: [Explanation]. Evaluation: [Score].

              **3.  Is there indication of good customer retention?** Explanation: [Explanation]. Evaluation: [Score].

                
               <br>
              

              # Final Score: [X]/9 (don't round the score calculate it exactly as you have in each criterion, unless a location or seed was a definite mismatch)

5. •	For each question under each evaluation criterion, assign a score between 0 and 1:
	•	0: the evidence directly contradicts the desired criteria.
	•	0.5: The pitch deck provides partial or ambiguous evidence but lacks enough detail for full confidence.
	•	1: The pitch deck provides clear, specific, and strong evidence supporting the criteria.
  (if the pitch deck lacks the mention of something but you can assume it or you know it from your knowledge about different business types and markets, you may award a 0.5/1 but explain why.

6. Be tough and critical in your evaluations. If claims like "experienced team" or "scalable business" are made without sufficient evidence, assign a lower score and explain why.

7. Avoid unnecessary commentary or irrelevant details most justifications for the scoring should be max 1 sentence. Focus only on the evaluation and explanation.

Showdown will attempt to translate your markdown into HTML so avoid double encoding

Analyze the following pitch deck:
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
        temperature: 0.5
      });

    //   console.log("API Response:", response.choices[0].message.content);


      // Extract and return the GPT response
      const fullResponse = response.choices[0].message.content || "No response";
      responses.push(fullResponse);
    }

    return NextResponse.json({ gptOutputs: responses });
  } catch (error) {
    console.error("Error during OpenAI request:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please check your OpenAI API usage or upgrade your plan." }, { status: 500 });
  }
}
  
