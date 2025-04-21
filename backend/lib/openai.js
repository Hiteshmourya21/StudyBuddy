import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store securely in .env
});

export const generateQuizFromAI = async (subject, difficulty) => {
  const prompt = `
  Generate 10 multiple-choice questions on the subject "${subject}" with "${difficulty}" difficulty.
  Each question should have 4 options and indicate the correct answer.
  Format the result as a JSON array like:
  [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    },
    ...
  ]
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  try {
    const response = completion.choices[0].message.content;
    const questions = JSON.parse(response);
    return questions;
  } catch (err) {
    console.error("Failed to parse AI response:", err.message);
    return [];
  }
};
