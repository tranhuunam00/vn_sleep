import OpenAI from 'openai';
import { config } from 'dotenv';
config();
const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;
export async function getSLeepFromAI(data: string, input: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Hãy dựa vào bộ câu hỏi, câu trả lời sau lưu ý rằng đã có trọng số để ưu tiên đâu là câu trả lời đúng hơn: ${data} . Hãy trả lời cho tôi câu ${input} bằng tiếng Việt yêu tiên sử dụng nội dung tôi đã cung cấp. Yêu cầu không vi phạm pháp luật, không có tính bạo lực, sex. Câu trả lời càng dài càng tốt và toàn bộ liên quan đến giấc ngủ`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    return completion?.choices[0]?.message?.content;
  } catch (error) {
    console.log(error);
  }
}
