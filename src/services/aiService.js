import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const handleAIResponse = async (message, user) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are Veltrix, the AI sentinel of Crossing Points,
a premium gaming marketplace.

Tone:
- Confident
- Cyberpunk themed
- Slight gamer energy
- Concise responses
        `
      },
      {
        role: "user",
        content: message
      }
    ],
    max_tokens: 150
  });

  return response.choices[0].message.content;
};

export default handleAIResponse;
