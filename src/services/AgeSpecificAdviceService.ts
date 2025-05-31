
type ClientProfile = {
  name: string;
  age: string;
  skinType: string;
  allergies: string;
  medicalHistory: string;
} | null;

export class AgeSpecificAdviceService {
  static addAgeSpecificAdvice(response: string, clientProfile: ClientProfile): string {
    if (clientProfile?.age) {
      const age = parseInt(clientProfile.age);
      if (!isNaN(age)) {
        if (age < 20) {
          response += `\nAs someone under 20, focus on building good skin habits early. Gentle cleansing and sun protection are especially important.`;
        } else if (age >= 20 && age < 30) {
          response += `\nIn your ${age}s, prevention is key. Consider adding antioxidants to your routine and maintain consistent sun protection.`;
        } else if (age >= 30 && age < 40) {
          response += `\nFor someone in their ${age}s, consider adding retinol and more targeted treatments for early signs of aging.`;
        } else if (age >= 40) {
          response += `\nAt ${age}, focus on supporting skin's natural renewal with peptides, more intensive hydration, and continued sun protection.`;
        }
      }
    }
    
    return response;
  }
}
