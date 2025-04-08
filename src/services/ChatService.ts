
import { Message } from '@/types/chat';
import SkinConditionService from './SkinConditionService';
import { AnalysisResult } from '@/utils/skinAnalysisUtils';

type ClientProfile = {
  name: string;
  age: string;
  skinType: string;
  allergies: string;
  medicalHistory: string;
} | null;

class ChatService {
  static processTextMessage(inputText: string, clientProfile: ClientProfile = null): Promise<string> {
    return new Promise((resolve) => {
      // Simple rule-based responses for the prototype
      const lowercaseInput = inputText.toLowerCase();
      const personalizedIntro = clientProfile ? `Based on your profile (${clientProfile.skinType} skin, age: ${clientProfile.age}), ` : '';
      
      // Check for allergies mentioned in the profile
      const allergiesWarning = clientProfile?.allergies ? 
        `Note: Given your allergies to ${clientProfile.allergies}, I've excluded products containing these ingredients. ` : '';
      
      if (lowercaseInput.includes('acne') || lowercaseInput.includes('pimple')) {
        resolve(`${personalizedIntro}for acne concerns, I recommend:\n\n1. Use a gentle cleanser with salicylic acid\n2. Try a benzoyl peroxide spot treatment\n3. Don't pick or pop pimples\n4. Consider a non-comedogenic moisturizer\n\n${allergiesWarning}Would you like product recommendations for any of these steps?`);
      } 
      else if (lowercaseInput.includes('dry') || lowercaseInput.includes('flaky')) {
        resolve(`${personalizedIntro}for dry skin, I recommend:\n\n1. Use a hydrating cleanser without sulfates\n2. Apply hyaluronic acid serum on damp skin\n3. Use a rich moisturizer with ceramides\n4. Consider facial oils like squalane or rosehip\n5. Limit hot shower exposure\n\n${allergiesWarning}Do you have any questions about these recommendations?`);
      }
      else if (lowercaseInput.includes('oily') || lowercaseInput.includes('shine')) {
        resolve(`${personalizedIntro}for oily skin, I recommend:\n\n1. Use a gentle foaming cleanser\n2. Try niacinamide serum to regulate sebum\n3. Use oil-free, non-comedogenic moisturizers\n4. Consider clay masks once or twice weekly\n\n${allergiesWarning}Would you like more specific advice?`);
      }
      else if (lowercaseInput.includes('routine') || lowercaseInput.includes('regimen')) {
        const skinTypeRecommendation = clientProfile?.skinType ? 
          `For your ${clientProfile.skinType} skin type, a good routine would be: ` : 
          'A basic skincare routine should include: ';
        
        resolve(`${skinTypeRecommendation}\n\n1. Cleansing (morning and night)\n2. Treatment (serums targeting specific concerns)\n3. Moisturizing\n4. Sunscreen (morning only, SPF 30+)\n\n${allergiesWarning}Would you like me to suggest specific products that would work well for you?`);
      }
      else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        const greeting = clientProfile ? 
          `Hello ${clientProfile.name}! I'm your AI skincare assistant. ` : 
          "Hello! I'm your AI skincare assistant. ";
        
        resolve(`${greeting}I can help analyze your skin, recommend products, or answer questions about skin concerns. How can I help you today?`);
      }
      else {
        const response = clientProfile ? 
          `Thanks for your message, ${clientProfile.name}. To provide the best recommendations for your ${clientProfile.skinType} skin, could you share more details about your specific concerns? Or you can upload a photo for analysis.` : 
          "Thanks for your message. To provide the best recommendations, could you share more details about your skin concerns or upload a photo for analysis? I'm here to help with personalized skincare advice.";
        
        resolve(response);
      }
    });
  }

  static async processImageMessage(imageData: string, clientProfile: ClientProfile = null): Promise<Message> {
    try {
      console.log('Processing image message with ChatService...');
      // Get the analysis results
      const results = await SkinConditionService.analyzeImage(imageData);
      
      // Format the response based on the analysis and client profile
      const response = SkinConditionService.formatAnalysisForChat(results, clientProfile);
      
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

  static async processAnalysisResults(analysisResults: AnalysisResult, clientProfile: ClientProfile = null): Promise<Message> {
    try {
      console.log('Processing analysis results with ChatService...', analysisResults);
      // Format the response based on the analysis and client profile
      const response = SkinConditionService.formatAnalysisForChat(analysisResults, clientProfile);
      
      // Return the formatted bot message
      return {
        id: Date.now().toString(),
        content: `I see you've just completed a skin analysis! ${response}\n\nIs there anything specific about these results you'd like me to explain in more detail?`,
        sender: 'bot',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error processing analysis results:', error);
      
      // Return error message
      return {
        id: Date.now().toString(),
        content: "I noticed you've completed a skin analysis, but I'm having trouble processing the results. Could you tell me what specific skin concerns you'd like help with?",
        sender: 'bot',
        timestamp: new Date(),
      };
    }
  }
  
  static processQuestionnaireResults(profile: {
    name: string;
    age: string;
    skinType: string;
    allergies: string;
    medicalHistory: string;
  }): Promise<Message> {
    return new Promise((resolve) => {
      // Generate personalized response based on questionnaire
      let response = `Thank you for providing your information, ${profile.name}! `;
      
      // Add personalized response based on skin type
      switch (profile.skinType.toLowerCase()) {
        case 'dry':
          response += `For your dry skin, I'll focus on hydrating ingredients and recommend products that strengthen your skin barrier. `;
          break;
        case 'oily':
          response += `For your oily skin, I'll suggest products that help balance sebum production without over-drying. `;
          break;
        case 'combination':
          response += `For your combination skin, I'll recommend products that balance your T-zone while providing appropriate hydration to drier areas. `;
          break;
        case 'sensitive':
          response += `For your sensitive skin, I'll focus on gentle, fragrance-free formulations that minimize potential irritation. `;
          break;
        default:
          response += `I'll tailor my recommendations to your normal skin type, focusing on maintaining your skin's health and addressing any specific concerns you have. `;
      }
      
      // Address allergies if mentioned
      if (profile.allergies && profile.allergies.trim() !== '') {
        response += `I've noted your allergies to ${profile.allergies} and will avoid recommending products with these ingredients. `;
      }
      
      // Address medical history if provided
      if (profile.medicalHistory && profile.medicalHistory.trim() !== '') {
        response += `I've also taken note of your medical history and will consider this when making recommendations. `;
      }
      
      response += `\n\nHow can I help with your skincare today? You can ask me specific questions, upload a photo for analysis, or tell me about any skin concerns you're experiencing.`;
      
      resolve({
        id: Date.now().toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      });
    });
  }
}

export default ChatService;
