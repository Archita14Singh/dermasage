
import { Message } from '@/types/chat';
import SkinConditionService from './SkinConditionService';

class ChatService {
  static processTextMessage(inputText: string): Promise<string> {
    return new Promise((resolve) => {
      // Simple rule-based responses for the prototype
      const lowercaseInput = inputText.toLowerCase();
      
      if (lowercaseInput.includes('acne') || lowercaseInput.includes('pimple')) {
        resolve("For acne concerns, I recommend:\n\n1. Use a gentle cleanser with salicylic acid\n2. Try a benzoyl peroxide spot treatment\n3. Don't pick or pop pimples\n4. Consider a non-comedogenic moisturizer\n\nWould you like product recommendations for any of these steps?");
      } 
      else if (lowercaseInput.includes('dry') || lowercaseInput.includes('flaky')) {
        resolve("For dry skin, I recommend:\n\n1. Use a hydrating cleanser without sulfates\n2. Apply hyaluronic acid serum on damp skin\n3. Use a rich moisturizer with ceramides\n4. Consider facial oils like squalane or rosehip\n5. Limit hot shower exposure\n\nDo you have any questions about these recommendations?");
      }
      else if (lowercaseInput.includes('oily') || lowercaseInput.includes('shine')) {
        resolve("For oily skin, I recommend:\n\n1. Use a gentle foaming cleanser\n2. Try niacinamide serum to regulate sebum\n3. Use oil-free, non-comedogenic moisturizers\n4. Consider clay masks once or twice weekly\n\nWould you like more specific advice?");
      }
      else if (lowercaseInput.includes('routine') || lowercaseInput.includes('regimen')) {
        resolve("A basic skincare routine should include:\n\n1. Cleansing (morning and night)\n2. Treatment (serums targeting specific concerns)\n3. Moisturizing\n4. Sunscreen (morning only, SPF 30+)\n\nFor a personalized routine, I'd need to know more about your skin type and concerns. Would you like to share more details or upload a photo for analysis?");
      }
      else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        resolve("Hello! I'm your AI skincare assistant. I can help analyze your skin, recommend products, or answer questions about skin concerns. How can I help you today?");
      }
      else {
        resolve("Thanks for your message. To provide the best recommendations, could you share more details about your skin concerns or upload a photo for analysis? I'm here to help with personalized skincare advice.");
      }
    });
  }

  static async processImageMessage(imageData: string): Promise<Message> {
    try {
      // Get the analysis results
      const results = await SkinConditionService.analyzeImage(imageData);
      
      // Format the response based on the analysis
      const response = SkinConditionService.formatAnalysisForChat(results);
      
      // Return the formatted bot message
      return {
        id: Date.now().toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error processing image:', error);
      
      // Return error message
      return {
        id: Date.now().toString(),
        content: "I'm sorry, I had trouble analyzing that image. Could you try uploading a clearer photo with good lighting?",
        sender: 'bot',
        timestamp: new Date(),
      };
    }
  }
}

export default ChatService;
