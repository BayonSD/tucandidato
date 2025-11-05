import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCVxvWYfyYT85T_zo5zDPYu35_9X4fztEE", {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1"
});

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = "Hola Gemini desde Node.js con endpoint forzado a v1.";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

run();
