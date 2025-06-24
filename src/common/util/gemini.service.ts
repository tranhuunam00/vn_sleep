import axios from 'axios';

const apiKey = process.env.GEMINI_API_KEY || 'YOUR_DEFAULT_API_KEY';
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

/**
 * Gọi Gemini để trả lời câu hỏi liên quan đến giấc ngủ từ dữ liệu có trọng số.
 */
export async function getSleepFromGemini(
  data: string,
  input: string,
): Promise<string> {
  const prompt = `
Bạn là một chuyên gia trí tuệ nhân tạo chuyên về **y tế giấc ngủ**. 
Dưới đây là một bộ câu hỏi và câu trả lời liên quan đến giấc ngủ. Mỗi câu trả lời đã được gán trọng số để thể hiện mức độ phù hợp.

Bộ dữ liệu tham khảo:
${data}

Hãy sử dụng các nội dung đã cung cấp ở trên để trả lời cho câu hỏi sau bằng tiếng Việt:

"${input}"

⚠️ Lưu ý bắt buộc:
- Chỉ trả lời nếu câu hỏi liên quan đến giấc ngủ hoặc sức khỏe giấc ngủ.
- Nếu câu hỏi nằm ngoài chủ đề này, hãy từ chối một cách lịch sự: 
  "Xin lỗi, tôi chỉ có thể hỗ trợ các câu hỏi liên quan đến giấc ngủ và sức khỏe giấc ngủ."
- Câu trả lời phải đúng, dài, có chiều sâu, mang tính tư vấn sức khỏe hoặc hướng dẫn cải thiện giấc ngủ.
- Tuyệt đối không đưa nội dung vi phạm pháp luật, nhạy cảm, hoặc không phù hợp.

Bắt đầu trả lời:
`;

  return generateFromPrompt(prompt);
}

/**
 * Chat đơn giản với Gemini bằng một prompt đầu vào.
 */
export async function chatWithGemini(input: string): Promise<string> {
  const prompt = `
Bạn là một chuyên gia trí tuệ nhân tạo được huấn luyện đặc biệt trong lĩnh vực **y tế giấc ngủ**. 
Nhiệm vụ của bạn là **chỉ trả lời các câu hỏi liên quan đến giấc ngủ và sức khỏe giấc ngủ** như:
- mất ngủ, khó ngủ
- rối loạn giấc ngủ (ngáy, ngưng thở khi ngủ, mộng du,...)
- thời lượng, chất lượng giấc ngủ
- thói quen tốt để cải thiện giấc ngủ
- ảnh hưởng của giấc ngủ đến sức khỏe thể chất và tinh thần

Bạn **không được trả lời bất kỳ câu hỏi nào không thuộc lĩnh vực y tế giấc ngủ**. Nếu nhận được câu hỏi ngoài phạm vi, hãy từ chối một cách lịch sự như sau:
"Xin lỗi, tôi chỉ có thể hỗ trợ các câu hỏi liên quan đến giấc ngủ và sức khỏe giấc ngủ."

Bây giờ, người dùng đang hỏi:
"${input}"
`;

  return generateFromPrompt(prompt);
}

/**
 * Gọi API Gemini với prompt đầu vào.
 */
async function generateFromPrompt(prompt: string): Promise<string> {
  try {
    const response = await axios.post(apiUrl, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    return text;
  } catch (error: any) {
    const msg = error.response?.data?.error?.message || error.message;
    throw new Error(`Gemini API Error: ${msg}`);
  }
}
