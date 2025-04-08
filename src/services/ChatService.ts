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
      // More interactive, conversational responses
      const lowercaseInput = inputText.toLowerCase();
      
      // Personalization based on profile
      const name = clientProfile?.name ? `, ${clientProfile.name}` : '';
      const personalizedIntro = clientProfile ? 
        `Based on your profile (${clientProfile.skinType} skin, age: ${clientProfile.age}), ` : '';
      
      // Check for allergies mentioned in the profile
      const allergiesWarning = clientProfile?.allergies ? 
        `Note: Given your allergies to ${clientProfile.allergies}, I've excluded products containing these ingredients. ` : '';
      
      // Diet and nutrition related questions
      if (lowercaseInput.includes('diet') || lowercaseInput.includes('food') || lowercaseInput.includes('nutrition') || lowercaseInput.includes('eat')) {
        resolve(`${personalizedIntro}Diet plays a crucial role in skin health${name}! Here are some recommendations:\n\n1. Stay hydrated with at least 8 glasses of water daily\n2. Consume foods rich in omega-3 fatty acids (salmon, walnuts)\n3. Eat antioxidant-rich fruits and vegetables (berries, leafy greens)\n4. Limit sugar and dairy if you notice they trigger breakouts\n5. Consider foods high in zinc (pumpkin seeds, chickpeas)\n\n${allergiesWarning}Would you like me to suggest a specific diet plan based on your skin concerns?`);
      }
      // Exercise related questions
      else if (lowercaseInput.includes('exercise') || lowercaseInput.includes('workout') || lowercaseInput.includes('yoga')) {
        resolve(`${personalizedIntro}Exercise can improve circulation and help your skin glow${name}! Here's what I suggest:\n\n1. Moderate cardio (walking, jogging) increases blood flow to the skin\n2. Yoga can reduce stress, which often triggers skin issues\n3. Be sure to wash your face after sweating to prevent clogged pores\n4. Stay hydrated during workouts\n5. Consider exercises that promote relaxation, as stress can exacerbate skin conditions\n\nHow often do you currently exercise, and have you noticed any correlation with your skin condition?`);
      }
      // Specific product recommendations
      else if (lowercaseInput.includes('recommend') && (lowercaseInput.includes('cleanser') || lowercaseInput.includes('moisturizer') || lowercaseInput.includes('sunscreen'))) {
        let productType = '';
        let recommendations = '';
        
        if (lowercaseInput.includes('cleanser')) {
          productType = 'cleanser';
          if (clientProfile?.skinType === 'oily') {
            recommendations = "1. CeraVe Foaming Facial Cleanser\n2. La Roche-Posay Toleriane Purifying Facial Cleanser\n3. Paula's Choice CLEAR Pore Normalizing Cleanser";
          } else if (clientProfile?.skinType === 'dry') {
            recommendations = "1. CeraVe Hydrating Facial Cleanser\n2. La Roche-Posay Toleriane Hydrating Gentle Cleanser\n3. Fresh Soy Face Cleanser";
          } else {
            recommendations = "1. CeraVe Hydrating Facial Cleanser\n2. Cetaphil Gentle Skin Cleanser\n3. Neutrogena Ultra Gentle Hydrating Cleanser";
          }
        } else if (lowercaseInput.includes('moisturizer')) {
          productType = 'moisturizer';
          if (clientProfile?.skinType === 'oily') {
            recommendations = "1. Neutrogena Hydro Boost Water Gel\n2. La Roche-Posay Effaclar Mat Oil-Free Moisturizer\n3. CeraVe PM Facial Moisturizing Lotion";
          } else if (clientProfile?.skinType === 'dry') {
            recommendations = "1. CeraVe Moisturizing Cream\n2. First Aid Beauty Ultra Repair Cream\n3. Weleda Skin Food Original Ultra-Rich Cream";
          } else {
            recommendations = "1. CeraVe Daily Moisturizing Lotion\n2. Neutrogena Hydro Boost Water Gel\n3. Aveeno Calm + Restore Oat Gel Moisturizer";
          }
        } else if (lowercaseInput.includes('sunscreen')) {
          productType = 'sunscreen';
          if (clientProfile?.skinType === 'oily') {
            recommendations = "1. Supergoop! Unseen Sunscreen SPF 40\n2. EltaMD UV Clear Broad-Spectrum SPF 46\n3. La Roche-Posay Anthelios Clear Skin Oil Free Sunscreen SPF 60";
          } else if (clientProfile?.skinType === 'dry') {
            recommendations = "1. EltaMD UV Daily Broad-Spectrum SPF 40\n2. CeraVe Hydrating Sunscreen SPF 50\n3. MISSHA Essence Sun Milk SPF 50+";
          } else {
            recommendations = "1. EltaMD UV Clear Broad-Spectrum SPF 46\n2. La Roche-Posay Anthelios Melt-in Milk SPF 100\n3. CeraVe Hydrating Sunscreen Face Lotion SPF 50";
          }
        }
        
        resolve(`${personalizedIntro}Based on your request for a ${productType}${name}, here are my top recommendations:\n\n${recommendations}\n\n${allergiesWarning}Would you like me to explain why these would work well for your skin type?`);
      }
      // Detect questions about products without recommendations
      else if ((lowercaseInput.includes('product') || lowercaseInput.includes('recommend')) && 
          !clientProfile && 
          !lowercaseInput.includes('acne') && 
          !lowercaseInput.includes('dry') && 
          !lowercaseInput.includes('oily')) {
        resolve(`Before I recommend specific products${name}, I'd like to understand your skin better. Could you tell me about your skin type (dry, oily, combination, sensitive)? Also, do you have any specific skin concerns or allergies I should be aware of?`);
      }
      // Specific skin conditions - eczema
      else if (lowercaseInput.includes('eczema')) {
        resolve(`${personalizedIntro}Eczema requires gentle care${name}. Here's my advice:\n\n1. Use fragrance-free, gentle cleansers\n2. Moisturize immediately after bathing with a thick cream\n3. Consider products with colloidal oatmeal or ceramides\n4. Avoid hot water and harsh soaps\n5. Keep a trigger journal to identify what makes your eczema flare up\n\n${allergiesWarning}Have you identified any specific triggers for your eczema? I can help you develop a personalized management plan.`);
      }
      // Specific skin conditions - rosacea
      else if (lowercaseInput.includes('rosacea')) {
        resolve(`${personalizedIntro}For rosacea management${name}, I recommend:\n\n1. Use gentle, non-foaming cleansers\n2. Apply mineral-based sunscreen daily (zinc oxide/titanium dioxide)\n3. Consider products with anti-inflammatory ingredients like niacinamide\n4. Avoid known triggers: spicy foods, alcohol, extreme temperatures\n5. Look for products labeled for sensitive skin\n\n${allergiesWarning}What triggers have you noticed worsen your rosacea symptoms?`);
      }
      // Anti-aging questions
      else if (lowercaseInput.includes('aging') || lowercaseInput.includes('wrinkle') || lowercaseInput.includes('fine lines')) {
        resolve(`${personalizedIntro}For anti-aging skincare${name}, here's what I recommend:\n\n1. Retinol or retinoids are gold-standard for reducing wrinkles\n2. Vitamin C serums help with collagen production and brightness\n3. Peptides can help firm the skin\n4. Hyaluronic acid for hydration and plumping\n5. Always use SPF 30+ daily (this is the best anti-aging product!)\n\n${allergiesWarning}What specific aging concerns would you like to address? I can provide more targeted recommendations.`);
      }
      // Sunscreen questions
      else if (lowercaseInput.includes('spf') || lowercaseInput.includes('sunscreen') || lowercaseInput.includes('sun protection')) {
        resolve(`${personalizedIntro}Sun protection is essential for skin health${name}! Here's what you need to know:\n\n1. Use broad-spectrum SPF 30+ daily, even on cloudy days\n2. Apply approximately a quarter-sized amount for the face\n3. Reapply every 2 hours when outdoors\n4. Consider mineral sunscreens (zinc oxide, titanium dioxide) if you have sensitive skin\n5. Don't forget frequently missed areas: ears, neck, hands\n\n${allergiesWarning}Do you prefer chemical or mineral sunscreens? I can recommend specific products based on your preference.`);
      }
      // Ingredient questions
      else if (lowercaseInput.includes('ingredient') || lowercaseInput.includes('retinol') || lowercaseInput.includes('niacinamide') || lowercaseInput.includes('vitamin c') || lowercaseInput.includes('hyaluronic')) {
        let information = '';
        if (lowercaseInput.includes('retinol')) {
          information = "Retinol is a vitamin A derivative that increases cell turnover, boosts collagen, and helps with acne and wrinkles. Start with a low concentration (0.25-0.5%) 2-3 times weekly, gradually increasing frequency. Always use at night followed by moisturizer and sunscreen during the day.";
        } else if (lowercaseInput.includes('niacinamide')) {
          information = "Niacinamide (vitamin B3) strengthens the skin barrier, reduces inflammation, helps with acne, and evens skin tone. It's well-tolerated at 2-10% concentration and can be used morning and night. It pairs well with most ingredients, making it versatile for most routines.";
        } else if (lowercaseInput.includes('vitamin c')) {
          information = "Vitamin C is a powerful antioxidant that brightens skin, protects from UV damage, and stimulates collagen. L-ascorbic acid (15-20%) is the most potent form but can be unstable. Store in an opaque container away from light and heat. Best used in the morning under sunscreen.";
        } else if (lowercaseInput.includes('hyaluronic')) {
          information = "Hyaluronic acid is a humectant that draws moisture into the skin, holding up to 1000x its weight in water. Apply to damp skin for best results. It works at multiple skin layers for hydration without clogging pores. Safe for all skin types, including acne-prone skin.";
        } else {
          information = "Skincare ingredients serve different purposes: humectants (glycerin, hyaluronic acid) attract moisture, occlusives (petrolatum, shea butter) seal in moisture, emollients (oils) soften skin, antioxidants (vitamins C, E) protect from damage, and actives (retinoids, AHAs) address specific concerns.";
        }
        resolve(`${personalizedIntro}${information}\n\n${allergiesWarning}Do you have questions about any other specific ingredients or how to incorporate them into your routine?`);
      }
      // Detect general questions about skin care
      else if (lowercaseInput.includes('what') && lowercaseInput.includes('skin') && lowercaseInput.includes('care')) {
        resolve(`Great question${name}! Skincare is highly personal and depends on your skin type and concerns. A basic routine includes cleansing, treating specific concerns, moisturizing, and sun protection. Would you like me to suggest a routine specifically for your skin type? If so, could you share what type of skin you have?`);
      }
      // Handle acne concerns with more conversation
      else if (lowercaseInput.includes('acne') || lowercaseInput.includes('pimple') || lowercaseInput.includes('breakout')) {
        resolve(`${personalizedIntro}I understand dealing with acne can be frustrating${name}. Let me help!\n\n1. Use a gentle cleanser with salicylic acid\n2. Try a benzoyl peroxide spot treatment\n3. Don't pick or pop pimples\n4. Consider a non-comedogenic moisturizer\n5. Check if makeup or hair products are clogging pores\n\n${allergiesWarning}How severe is your acne, and have you tried any treatments before? This would help me give more tailored recommendations.`);
      } 
      // Handle dry skin with more conversation
      else if (lowercaseInput.includes('dry') || lowercaseInput.includes('flaky')) {
        resolve(`${personalizedIntro}I understand how uncomfortable dry skin can be${name}. Let's address that!\n\n1. Use a hydrating cleanser without sulfates\n2. Apply hyaluronic acid serum on damp skin\n3. Use a rich moisturizer with ceramides\n4. Consider facial oils like squalane or rosehip\n5. Limit hot shower exposure\n\n${allergiesWarning}Is your dryness seasonal or year-round? This would help me recommend more specific products for your situation.`);
      }
      // Handle oily skin with more conversation
      else if (lowercaseInput.includes('oily') || lowercaseInput.includes('shine')) {
        resolve(`${personalizedIntro}I understand that dealing with oily skin can be challenging${name}. Here are my recommendations:\n\n1. Use a gentle foaming cleanser\n2. Try niacinamide serum to regulate sebum\n3. Use oil-free, non-comedogenic moisturizers\n4. Consider clay masks once or twice weekly\n5. Don't skip moisturizer - dehydration can increase oil production\n\n${allergiesWarning}Do you notice your skin gets oilier during certain times of day or in specific seasons? This would help me tailor my advice further.`);
      }
      // Handle routines with more conversation
      else if (lowercaseInput.includes('routine') || lowercaseInput.includes('regimen')) {
        const skinTypeRecommendation = clientProfile?.skinType ? 
          `For your ${clientProfile.skinType} skin type${name}, a good routine would be: ` : 
          'A basic skincare routine should include: ';
        
        resolve(`${skinTypeRecommendation}\n\n1. Cleansing (morning and night)\n2. Treatment (serums targeting specific concerns)\n3. Moisturizing\n4. Sunscreen (morning only, SPF 30+)\n\n${allergiesWarning}What part of your current routine would you like to improve? Or are you starting fresh? I'd love to help you build a routine that works for your specific needs.`);
      }
      // Handle greetings more conversationally
      else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        const greeting = clientProfile ? 
          `Hello ${clientProfile.name}! I'm your AI skincare assistant. ` : 
          "Hello! I'm your AI skincare assistant. ";
        
        resolve(`${greeting}I can help analyze your skin, recommend products, or answer questions about skin concerns. What's on your mind today? If you're looking for personalized recommendations, I'd love to know more about your skin type and concerns.`);
      }
      // Handle thank you messages
      else if (lowercaseInput.includes('thank') || lowercaseInput.includes('thanks')) {
        resolve(`You're welcome${name}! I'm happy to help. Is there anything else you'd like to know about skincare or specific products?`);
      }
      // Handle goodbye messages
      else if (lowercaseInput.includes('bye') || lowercaseInput.includes('goodbye')) {
        resolve(`Goodbye${name}! Feel free to come back anytime you have skincare questions. Take care of your skin!`);
      }
      // Handle questions about ingredients
      else if (lowercaseInput.includes('ingredient') || lowercaseInput.includes('what') && lowercaseInput.includes('in')) {
        resolve(`Great question about ingredients${name}! To give you the most accurate information, could you specify which ingredient or product you're curious about? Different ingredients serve different purposes in skincare, from hydration to exfoliation to anti-aging.`);
      }
      // Default response that asks follow-up questions
      else {
        const response = clientProfile ? 
          `Thanks for your message${name}. To provide the best recommendations for your ${clientProfile.skinType} skin, could you share more details about your specific concerns? What areas of skincare are you most interested in improving? Or you can upload a photo for analysis.` : 
          "Thanks for your message. To provide the best personalized recommendations, could you share a bit about your skin type (dry, oily, combination, sensitive) and your main skin concerns? This would help me give you more tailored advice. You can also upload a photo for analysis.";
        
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
