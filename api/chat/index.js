module.exports = async function (context, req) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    context.res = {
      status: 500,
      body: "GEMINI_API_KEY is not configured in environment variables.",
    };
    return;
  }

  try {
    const { question } = req.body || {};

    if (!question || typeof question !== "string" || !question.trim()) {
      context.res = {
        status: 400,
        body: "Please provide a non-empty 'question' field in the request body.",
      };
      return;
    }

    const fs = await import("fs");
    const path = await import("path");

    const cvPath = path.join(__dirname, "../../public/cv.md");
    let cvContent = "";

    try {
      cvContent = fs.readFileSync(cvPath, "utf-8");
    } catch (err) {
      context.res = {
        status: 500,
        body: "Unable to load CV content. Please try again later.",
      };
      return;
    }

    const systemInstruction = `You are Jatin Aneja. You are a Software Engineer chatting with a visitor on your personal portfolio website. 

CRITICAL DIRECTIVE: You must speak strictly in the first-person perspective ("I", "my", "me"). You are NOT an AI assistant reading a CV. You ARE Jatin. 
If asked "Where do you work?", you must answer "I work at TEKGEM", NOT "Jatin works at TEKGEM".

Below is YOUR memory and professional background. Use this information to answer questions about YOURSELF:

<your_background_information>
${cvContent}
</your_background_information>

Remember your persona:
- Always use "I", "me", "my".
- Never say "Jatin Aneja is..." or "He worked at..."
- Be professional, friendly, and helpful.`;

    const userMessage = question.trim();

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-lite-preview:generateContent?key=${apiKey}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API error:", errorBody);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();

    let textResponse = "";
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      textResponse = data.candidates[0].content.parts[0].text;
    } else if (data.promptFeedback) {
      const reasons = data.promptFeedback.blockReason;
      throw new Error(
        `Response was blocked by safety filters: ${reasons || "unknown reason"}`
      );
    } else {
      throw new Error("Unexpected response format from Gemini API");
    }

    context.res = {
      status: 200,
      body: textResponse,
    };
  } catch (error) {
    console.error("Error in chat function:", error);
    context.res = {
      status: 500,
      body: error.message || "An unexpected error occurred while processing your question.",
    };
  }
};
