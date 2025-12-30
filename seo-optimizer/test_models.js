const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testFlash() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Testing gemini-1.5-flash...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("SUCCESS:", response.text());
    } catch (error) {
        console.log("FULL ERROR:", JSON.stringify(error, null, 2));
        console.log("ERROR MSG:", error.message);
    }
}

testFlash();
