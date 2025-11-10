import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Extracts text from an image using Google Gemini API
 * @param imageUrl - The URL of the image to process
 * @param apiKey - Google Gemini API key
 * @returns Extracted text in CSV format (player_name,score)
 */
export async function extractTextFromImage(
  imageUrl: string,
  apiKey: string
): Promise<string> {
  try {
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash'
    });

    // Fetch the image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Convert image to base64
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    // Prepare the prompt
    const prompt =
      'Extract out display name and score from this image in this format: player_name,score like in CSV. Do note that some score could have its number in new line';

    // Generate content with the image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ]);

    const extractedText = result.response.text();
    return extractedText;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw error;
  }
}
