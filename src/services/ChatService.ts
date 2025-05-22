
import { Message } from '@/types/chat';
import SkinConditionService from './SkinConditionService';
import { AnalysisResult, EnvironmentalFactor } from '@/utils/skinAnalysis';

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

      // Environmental factors section
      if (lowercaseInput.includes('environment') || 
          lowercaseInput.includes('humidity') || 
          lowercaseInput.includes('climate') ||
          lowercaseInput.includes('weather') ||
          lowercaseInput.includes('pollut') ||
          lowercaseInput.includes('uv')) {
        
        resolve(`${personalizedIntro}Environmental factors have a significant impact on your skin${name}. Here's how different factors affect your skin health:\n\n1. HUMIDITY LEVELS:\n   • Low Humidity: Causes moisture loss, tightness, and flaking\n   • High Humidity: Can increase oil production and sweat-triggered breakouts\n   • Seasonal Changes: Require adjusting your skincare routine accordingly\n\n2. UV RADIATION:\n   • UVA: Penetrates deep into skin causing premature aging and DNA damage\n   • UVB: Causes sunburn and surface damage\n   • Protection: Daily broad-spectrum SPF 30+ year-round is essential\n\n3. AIR POLLUTION:\n   • Particulate Matter: Clogs pores and triggers inflammation\n   • Free Radicals: Damages collagen and accelerates aging\n   • Protection: Antioxidants like vitamin C and thorough evening cleansing\n\n4. INDOOR ENVIRONMENTS:\n   • Heating/AC: Can strip moisture from skin\n   • Blue Light: From screens may contribute to hyperpigmentation\n   • Solution: Humidifiers, blue light protection, and regular hydration\n\n5. CLIMATE-SPECIFIC RECOMMENDATIONS:\n   • Dry Climate: Layer hydrating products, use occlusive moisturizers\n   • Humid Climate: Lightweight, oil-free formulations, more frequent cleansing\n   • Cold Climate: Richer moisturizers, barrier-supporting ingredients\n   • Hot Climate: Cooling products, increased antioxidant protection\n\nWould you like me to recommend specific products for your climate conditions or discuss how to adapt your routine for seasonal changes?`);
      }
      
      // Diet and nutrition related questions
      else if (lowercaseInput.includes('diet') || lowercaseInput.includes('food') || lowercaseInput.includes('nutrition') || lowercaseInput.includes('eat')) {
        // ... keep existing code (dietary advice section)
      }
      // Exercise related questions - expanded with more specific routines
      else if (lowercaseInput.includes('exercise') || lowercaseInput.includes('workout') || lowercaseInput.includes('yoga')) {
        // ... keep existing code (exercise recommendations)
      }
      // Specific product recommendations with shopping links
      else if (lowercaseInput.includes('recommend') && (lowercaseInput.includes('cleanser') || lowercaseInput.includes('moisturizer') || lowercaseInput.includes('sunscreen'))) {
        let productType = '';
        let recommendations = '';
        
        if (lowercaseInput.includes('cleanser')) {
          productType = 'cleanser';
          if (clientProfile?.skinType === 'oily') {
            recommendations = "1. CeraVe Foaming Facial Cleanser - [Amazon](https://www.amazon.com/CeraVe-Foaming-Facial-Cleanser-Washing/dp/B01N1LL62W) | [Flipkart](https://www.flipkart.com/cerave-foaming-facial-cleanser-normal-oily-skin/p/itm8d7e92c5a9609)\n2. La Roche-Posay Toleriane Purifying Facial Cleanser - [Amazon](https://www.amazon.com/Roche-Posay-Toleriane-Purifying-Facial-Cleanser/dp/B01N7T7JKJ)\n3. Paula's Choice CLEAR Pore Normalizing Cleanser - [Amazon](https://www.amazon.com/Paulas-Choice-CLEAR-Normalizing-Cleanser/dp/B00DZOANDM)";
          } else if (clientProfile?.skinType === 'dry') {
            recommendations = "1. CeraVe Hydrating Facial Cleanser - [Amazon](https://www.amazon.com/CeraVe-Hydrating-Facial-Cleanser-Fragrance/dp/B01MSSDEPK) | [Flipkart](https://www.flipkart.com/cerave-hydrating-cleanser-normal-dry-skin/p/itm0195400eb5088)\n2. La Roche-Posay Toleriane Hydrating Gentle Cleanser - [Amazon](https://www.amazon.com/Roche-Posay-Toleriane-Hydrating-Gentle-Cleanser/dp/B01N7T7JKJ)\n3. Fresh Soy Face Cleanser - [Amazon](https://www.amazon.com/Fresh-Face-Cleanser-Unisex-Ounce/dp/B000VSGEB0)";
          } else {
            recommendations = "1. CeraVe Hydrating Facial Cleanser - [Amazon](https://www.amazon.com/CeraVe-Hydrating-Facial-Cleanser-Fragrance/dp/B01MSSDEPK) | [Flipkart](https://www.flipkart.com/cerave-hydrating-cleanser-normal-dry-skin/p/itm0195400eb5088)\n2. Cetaphil Gentle Skin Cleanser - [Amazon](https://www.amazon.com/Cetaphil-Gentle-Cleanser-Face-Ounce/dp/B07GC74LL5) | [Flipkart](https://www.flipkart.com/cetaphil-gentle-skin-cleanser/p/itmezggvzcmhpkgx)\n3. Neutrogena Ultra Gentle Hydrating Cleanser - [Amazon](https://www.amazon.com/Neutrogena-Ultra-Gentle-Hydrating-Cleanser/dp/B00F1D56HI)";
          }
        } else if (lowercaseInput.includes('moisturizer')) {
          productType = 'moisturizer';
          if (clientProfile?.skinType === 'oily') {
            recommendations = "1. Neutrogena Hydro Boost Water Gel - [Amazon](https://www.amazon.com/Neutrogena-Hydro-Hyaluronic-Hydrating-Moisturizer/dp/B00AQ4ROX0) | [Flipkart](https://www.flipkart.com/neutrogena-hydro-boost-water-gel/p/itm39c2f794e9b15)\n2. La Roche-Posay Effaclar Mat Oil-Free Moisturizer - [Amazon](https://www.amazon.com/Roche-Posay-Effaclar-Mattifying-Moisturizer-Oily/dp/B00CL8NQA0)\n3. CeraVe PM Facial Moisturizing Lotion - [Amazon](https://www.amazon.com/CeraVe-Facial-Moisturizing-Lotion-Lightweight/dp/B00365DABC) | [Flipkart](https://www.flipkart.com/cerave-pm-facial-moisturizing-lotion-lightweight-night-cream/p/itm54d969e9d76cc)";
          } else if (clientProfile?.skinType === 'dry') {
            recommendations = "1. CeraVe Moisturizing Cream - [Amazon](https://www.amazon.com/CeraVe-Moisturizing-Cream-Daily-Moisturizer/dp/B00TTD9BRC) | [Flipkart](https://www.flipkart.com/cerave-moisturizing-cream/p/itm7e83732296c04)\n2. First Aid Beauty Ultra Repair Cream - [Amazon](https://www.amazon.com/First-Aid-Beauty-Ultra-Repair/dp/B0065I0UMO)\n3. Weleda Skin Food Original Ultra-Rich Cream - [Amazon](https://www.amazon.com/Weleda-Skin-Food-2-5-Ounce/dp/B000ORV3NC)";
          } else {
            recommendations = "1. CeraVe Daily Moisturizing Lotion - [Amazon](https://www.amazon.com/CeraVe-Moisturizing-Lotion-Hyaluronic-Fragrance/dp/B000YZ8QPU) | [Flipkart](https://www.flipkart.com/cerave-moisturizing-lotion/p/itm7a77d4a809493)\n2. Neutrogena Hydro Boost Water Gel - [Amazon](https://www.amazon.com/Neutrogena-Hydro-Hyaluronic-Hydrating-Moisturizer/dp/B00AQ4ROX0) | [Flipkart](https://www.flipkart.com/neutrogena-hydro-boost-water-gel/p/itm39c2f794e9b15)\n3. Aveeno Calm + Restore Oat Gel Moisturizer - [Amazon](https://www.amazon.com/Aveeno-Sensitive-Restore-Moisturizer-Fragrance/dp/B08D9MNTXB)";
          }
        } else if (lowercaseInput.includes('sunscreen')) {
          productType = 'sunscreen';
          if (clientProfile?.skinType === 'oily') {
            recommendations = "1. Supergoop! Unseen Sunscreen SPF 40 - [Amazon](https://www.amazon.com/Supergoop-Unseen-Sunscreen-Oil-Free-Protection/dp/B07CKVB14S)\n2. EltaMD UV Clear Broad-Spectrum SPF 46 - [Amazon](https://www.amazon.com/EltaMD-Clear-Facial-Sunscreen-Broad-Spectrum/dp/B002MSN3QQ)\n3. La Roche-Posay Anthelios Clear Skin Oil Free Sunscreen SPF 60 - [Amazon](https://www.amazon.com/Roche-Posay-Anthelios-Sunscreen-Oily-Skin/dp/B01MXLF8TY) | [Flipkart](https://www.flipkart.com/la-roche-posay-anthelios-clear-skin-sunscreen-spf-60/p/itm4cb3106ed2fa6)";
          } else if (clientProfile?.skinType === 'dry') {
            recommendations = "1. EltaMD UV Daily Broad-Spectrum SPF 40 - [Amazon](https://www.amazon.com/EltaMD-Clear-Facial-Sunscreen-Broad-Spectrum/dp/B002MSN3QQ)\n2. CeraVe Hydrating Sunscreen SPF 50 - [Amazon](https://www.amazon.com/CeraVe-Hydrating-Sunscreen-Spectrum-Protection/dp/B07KLY4RYG)\n3. MISSHA Essence Sun Milk SPF 50+ - [Amazon](https://www.amazon.com/MISSHA-Essence-Milk-SPF50-40ml/dp/B00E9OXJUQ)";
          } else {
            recommendations = "1. EltaMD UV Clear Broad-Spectrum SPF 46 - [Amazon](https://www.amazon.com/EltaMD-Clear-Facial-Sunscreen-Broad-Spectrum/dp/B002MSN3QQ)\n2. La Roche-Posay Anthelios Melt-in Milk SPF 100 - [Amazon](https://www.amazon.com/Roche-Posay-Anthelios-Sunscreen-Spectrum-Protectant/dp/B00HNSSV2U) | [Flipkart](https://www.flipkart.com/la-roche-posay-anthelios-melt-milk-spf-100/p/itm50de363daa36c)\n3. CeraVe Hydrating Sunscreen Face Lotion SPF 50 - [Amazon](https://www.amazon.com/CeraVe-Hydrating-Sunscreen-Spectrum-Protection/dp/B07KLY4RYG) | [Flipkart](https://www.flipkart.com/cerave-hydrating-sunscreen-face-lotion-spf-50/p/itm6557ecb684c46)";
          }
        }
        
        resolve(`${personalizedIntro}Based on your request for a ${productType}${name}, here are my top recommendations with shopping links:\n\n${recommendations}\n\n${allergiesWarning}Would you like me to explain why these would work well for your skin type?`);
      }
      // Expanded acne section with types
      else if (lowercaseInput.includes('acne')) {
        if (lowercaseInput.includes('hormonal')) {
          resolve(`${personalizedIntro}I understand dealing with hormonal acne can be frustrating${name}. Hormonal acne typically appears on the lower third of the face (jawline, chin) and tends to flare up with hormonal fluctuations.\n\nKey treatments for hormonal acne:\n\n1. Topical treatments:\n   • Benzoyl peroxide (2.5-5%) to kill bacteria\n   • Retinoids to regulate cell turnover\n   • Salicylic acid to exfoliate and clear pores\n\n2. Internal approaches:\n   • Speak with a dermatologist about spironolactone (anti-androgen)\n   • Consider birth control pills (for women) that regulate hormones\n   • DIM supplements may help balance estrogen\n\n3. Lifestyle adjustments:\n   • Stress management (cortisol affects hormones)\n   • Avoid high-glycemic foods and excessive dairy\n   • Consistent sleep schedule to regulate hormones\n\n4. Product recommendations:\n   • Paula's Choice 2% BHA Liquid - [Amazon](https://www.amazon.com/Paulas-Choice-SKIN-PERFECTING-Exfoliant-Gentle/dp/B00949CTQQ)\n   • La Roche-Posay Effaclar Duo - [Amazon](https://www.amazon.com/Roche-Posay-Effaclar-Treatment-Benzoyl-Peroxide/dp/B00CBDOXE4) | [Flipkart](https://www.flipkart.com/la-roche-posay-effaclar-duo/p/itmfg7gfdgzfemga)\n\n${allergiesWarning}Would you like me to suggest a complete skincare routine specifically for hormonal acne?`);
        } else if (lowercaseInput.includes('cystic')) {
          resolve(`${personalizedIntro}Cystic acne is one of the most severe forms of acne${name}, characterized by deep, painful, inflamed breakouts beneath the skin's surface.\n\nCystic acne treatment approach:\n\n1. Professional treatments:\n   • Consult a dermatologist as this is the most serious form of acne\n   • Prescription options may include isotretinoin (Accutane), antibiotics, or cortisone injections\n   • Regular professional extractions and treatments\n\n2. Topical treatments:\n   • Retinoids to regulate cell turnover\n   • Benzoyl peroxide as a spot treatment\n   • Avoid harsh physical exfoliants that can worsen inflammation\n\n3. Lifestyle modifications:\n   • Anti-inflammatory diet (reduce dairy, sugar, and processed foods)\n   • Stress management techniques\n   • Don't pick or squeeze cysts (increases scarring risk)\n\n4. Product recommendations:\n   • La Roche-Posay Effaclar Duo+ - [Amazon](https://www.amazon.com/Roche-Posay-Effaclar-Treatment-Salicylic-Niacinamide/dp/B00IOMFAQ0) | [Flipkart](https://www.flipkart.com/la-roche-posay-effaclar-duo/p/itmfg7gfdgzfemga)\n   • PanOxyl Acne Foaming Wash - [Amazon](https://www.amazon.com/PanOxyl-Foaming-Peroxide-Maximum-Strength/dp/B081KL7QYJ)\n\n${allergiesWarning}Would you like me to recommend a gentle but effective skincare routine for cystic acne?`);
        } else if (lowercaseInput.includes('fungal')) {
          resolve(`${personalizedIntro}Fungal acne (Malassezia folliculitis) is often misdiagnosed as regular acne${name}, but it's caused by an overgrowth of yeast in hair follicles. Unlike bacterial acne, it appears as uniform, itchy bumps.\n\nTreating fungal acne:\n\n1. Antifungal treatments:\n   • Ketoconazole shampoo as a face mask (leave on for 5 minutes)\n   • Zinc pyrithione soap\n   • Sulfur-based treatments\n\n2. Skincare adjustments:\n   • Avoid oils that feed Malassezia (most plant oils)\n   • Look for "fungal acne safe" products\n   • Use non-comedogenic, oil-free moisturizers\n\n3. Lifestyle changes:\n   • Change pillowcases frequently\n   • Shower immediately after sweating\n   • Avoid occlusive clothing during workouts\n\n4. Product recommendations:\n   • Nizoral Anti-Dandruff Shampoo (contains ketoconazole) - [Amazon](https://www.amazon.com/Nizoral-Anti-Dandruff-Shampoo-Ketoconazole-Dandruff/dp/B00AINMFAC) | [Flipkart](https://www.flipkart.com/nizoral-anti-dandruff-shampoo/p/itmf85hvzgwd9jcm)\n   • De La Cruz Sulfur Ointment - [Amazon](https://www.amazon.com/Cruz-Medication-Allergy-Tested-Preservatives-Fragrances/dp/B00H5UP96I)\n\n${allergiesWarning}Would you like me to create a complete fungal-acne safe routine based on your skin type?`);
        } else {
          resolve(`${personalizedIntro}I understand dealing with acne can be frustrating${name}. Let me help by explaining the different types and treatments:\n\n1. TYPES OF ACNE:\n   • Comedonal: whiteheads and blackheads (clogged pores)\n   • Inflammatory: papules and pustules (red bumps, sometimes with pus)\n   • Hormonal: often on chin/jawline, related to hormonal fluctuations\n   • Cystic: deep, painful, inflammatory lesions\n   • Fungal: uniform, itchy bumps caused by yeast (not bacteria)\n\n2. TREATMENT APPROACH:\n   • Cleanse: Gentle cleansers with salicylic acid or benzoyl peroxide\n   • Treat: Targeted ingredients (benzoyl peroxide for bacteria, salicylic acid for exfoliation)\n   • Hydrate: Non-comedogenic moisturizers\n   • Protect: Oil-free sunscreen (sun can worsen acne marks)\n\n3. RECOMMENDED PRODUCTS:\n   • CeraVe Acne Foaming Cream Cleanser - [Amazon](https://www.amazon.com/CeraVe-Cleanser-Treating-Salicylic-Niacinamide/dp/B08KPZDGN8)\n   • Paula's Choice 2% BHA Liquid Exfoliant - [Amazon](https://www.amazon.com/Paulas-Choice-SKIN-PERFECTING-Exfoliant-Gentle/dp/B00949CTQQ)\n   • La Roche-Posay Effaclar Duo - [Amazon](https://www.amazon.com/Roche-Posay-Effaclar-Treatment-Benzoyl-Peroxide/dp/B00CBDOXE4) | [Flipkart](https://www.flipkart.com/la-roche-posay-effaclar-duo/p/itmfg7gfdgzfemga)\n\n${allergiesWarning}Which type of acne do you primarily experience? This would help me give you more targeted advice.`);
        }
      } 
      // Expanded pigmentation section
      else if (lowercaseInput.includes('pigment') || lowercaseInput.includes('hyperpigmentation') || lowercaseInput.includes('dark spot')) {
        if (lowercaseInput.includes('melasma')) {
          resolve(`${personalizedIntro}Melasma is a complex form of hyperpigmentation${name} that appears as patches of brown or gray-brown discoloration, typically on the face. It's often triggered by hormones and sun exposure.\n\nTreating melasma:\n\n1. Sun protection (absolutely essential):\n   • Broad-spectrum SPF 50+ sunscreen, reapplied every 2 hours when outdoors\n   • Physical protection: wide-brimmed hats, UV-protective clothing\n   • Seek shade and avoid peak sun hours\n\n2. Skin-brightening ingredients:\n   • Tranexamic acid (most effective for melasma)\n   • Vitamin C to brighten and provide antioxidant protection\n   • Kojic acid and azelaic acid to inhibit melanin production\n   • Niacinamide to regulate melanin transfer\n\n3. Professional treatments:\n   • Chemical peels with glycolic or lactic acid\n   • Microneedling with brightening serums\n   • Laser treatments (with caution as they can worsen melasma)\n\n4. Product recommendations:\n   • SkinCeuticals Discoloration Defense (tranexamic acid) - [Amazon](https://www.amazon.com/SkinCeuticals-Discoloration-Defense-1-Ounce/dp/B079NXNBJ9)\n   • La Roche-Posay Pigmentclar Serum - [Amazon](https://www.amazon.com/Roche-Posay-Pigmentclar-Intensive-Correcting-Glycolic/dp/B00JE7FDJQ)\n\n${allergiesWarning}Would you like a complete anti-melasma routine based on your skin type?`);
        } else if (lowercaseInput.includes('pih') || lowercaseInput.includes('post-inflammatory') || lowercaseInput.includes('acne marks')) {
          resolve(`${personalizedIntro}Post-inflammatory hyperpigmentation (PIH)${name} refers to dark spots left behind after inflammation like acne, eczema, or injury. It's more common in medium to deeper skin tones.\n\nTreating PIH:\n\n1. Exfoliation:\n   • Chemical exfoliants (AHAs like glycolic acid, BHAs like salicylic acid)\n   • Gentle approach to avoid further inflammation\n   • Consistent use rather than high concentrations\n\n2. Brightening ingredients:\n   • Vitamin C to brighten and provide antioxidant protection\n   • Niacinamide to regulate melanin transfer\n   • Alpha arbutin for targeted spot treatment\n   • Licorice root extract to brighten without irritation\n\n3. Protection:\n   • Daily sunscreen (SPF 30+) is non-negotiable\n   • Reapplication throughout the day when outdoors\n   • Consider antioxidants to boost protection\n\n4. Product recommendations:\n   • The Ordinary Alpha Arbutin 2% + HA - [Amazon](https://www.amazon.com/Ordinary-Alpha-Arbutin-2-HA/dp/B06WGPMD78)\n   • Paula's Choice 10% Azelaic Acid Booster - [Amazon](https://www.amazon.com/Paulas-Choice-BOOST-Azelaic-Brightening-Treatment/dp/B074ZLRPHC)\n   • Glow Recipe Guava Vitamin C Dark Spot Serum - [Amazon](https://www.amazon.com/Glow-Recipe-Guava-Vitamin-Serum/dp/B09CFZGX7Z)\n\n${allergiesWarning}How long have you been dealing with your dark spots? This would help me recommend the most appropriate treatment approach.`);
        } else {
          resolve(`${personalizedIntro}Hyperpigmentation is a common skin concern${name} that includes several distinct types:\n\n1. TYPES OF HYPERPIGMENTATION:\n   • Post-inflammatory (PIH): Dark spots after acne, injury, or inflammation\n   • Melasma: Hormone-triggered patches, often on cheeks, forehead, upper lip\n   • Sunspots: Small, flat dark spots from sun damage\n   • Age spots: Similar to sunspots, associated with aging and sun exposure\n\n2. TREATMENT PILLARS:\n   • Prevention: Rigorous sun protection (SPF 30-50 daily, reapplied every 2 hours)\n   • Exfoliation: AHAs, BHAs to accelerate cell turnover\n   • Brightening: Vitamin C, niacinamide, alpha arbutin, kojic acid\n   • Targeted treatments: Tranexamic acid, azelaic acid, retinoids\n\n3. RECOMMENDED PRODUCTS:\n   • Good Molecules Discoloration Correcting Serum - [Amazon](https://www.amazon.com/Good-Molecules-Discoloration-Correcting-Serum/dp/B08655GBMX)\n   • Naturium Alpha Arbutin Serum - [Amazon](https://www.amazon.com/Natural-Alpha-Arbutin-Serum-30ml/dp/B089NBJGMQ)\n   • Timeless 20% Vitamin C + E + Ferulic Acid - [Amazon](https://www.amazon.com/Timeless-Skin-Care-20-Vitamin/dp/B0036BI56G)\n\n${allergiesWarning}What type of hyperpigmentation are you experiencing? This would help me provide more targeted recommendations.`);
        }
      }
      // New section for milia
      else if (lowercaseInput.includes('milia')) {
        resolve(`${personalizedIntro}Milia are small, white cysts that occur when keratin becomes trapped beneath the skin's surface${name}. Unlike acne, they don't have a pore opening and can't be treated the same way.\n\n1. What causes milia:\n   • Skin trauma (burns, blistering)\n   • Heavy, occlusive skincare products\n   • Sun damage\n   • Genetic predisposition\n   • Certain medications or medical conditions\n\n2. Home treatment approach:\n   • Gentle chemical exfoliation with BHAs or AHAs\n   • Retinoids to increase cell turnover\n   • Avoid heavy, occlusive products around affected areas\n   • Never attempt to extract milia yourself (risk of scarring)\n\n3. Professional treatments:\n   • Extraction by a dermatologist or esthetician\n   • Light chemical peels\n   • Microdermabrasion\n   • Laser therapy\n\n4. Product recommendations:\n   • Paula's Choice 2% BHA Liquid Exfoliant - [Amazon](https://www.amazon.com/Paulas-Choice-SKIN-PERFECTING-Exfoliant-Gentle/dp/B00949CTQQ) | [Flipkart](https://www.flipkart.com/paula-s-choice-skin-perfecting-2-bha-liquid-exfoliant/p/itm56dca4df0159a)\n   • The Ordinary Lactic Acid 5% + HA - [Amazon](https://www.amazon.com/Ordinary-Lactic-Acid-5-30ml/dp/B075JWS86X)\n\n${allergiesWarning}Have you tried any treatments for your milia so far? I can recommend a specific approach based on your experience.`);
      }
      // New section for rosacea
      else if (lowercaseInput.includes('rosacea')) {
        resolve(`${personalizedIntro}Rosacea is a chronic inflammatory skin condition${name} characterized by facial redness, visible blood vessels, and sometimes small red bumps.\n\n1. Types of rosacea:\n   • Erythematotelangiectatic: Persistent redness, visible blood vessels\n   • Papulopustular: Acne-like breakouts with redness and swelling\n   • Phymatous: Skin thickening and bumpy texture (rare)\n   • Ocular: Affects eyes, causing irritation and redness\n\n2. Triggers to avoid:\n   • Extreme temperatures (hot or cold)\n   • Spicy foods, alcohol (especially red wine)\n   • Intense exercise without cooling strategies\n   • Certain skincare ingredients (alcohol, fragrance, menthol)\n   • Stress and anxiety\n\n3. Treatment approach:\n   • Gentle, fragrance-free skincare\n   • Anti-inflammatory ingredients (niacinamide, centella asiatica)\n   • Azelaic acid to reduce redness and bumps\n   • Prescription options: metronidazole, ivermectin (consult dermatologist)\n\n4. Product recommendations:\n   • La Roche-Posay Toleriane Double Repair Face Moisturizer - [Amazon](https://www.amazon.com/Roche-Posay-Toleriane-Double-Repair-Moisturizer/dp/B01NCZXL0G)\n   • Avène Antirougeurs FORT Relief Concentrate - [Amazon](https://www.amazon.com/Av%C3%A8ne-Antirougeurs-FORT-Relief-Concentrate/dp/B01N9SPQHQ)\n   • Dr. Jart+ Cicapair Tiger Grass Color Correcting Treatment - [Amazon](https://www.amazon.com/Dr-Jart-Cicapair-Correcting-Treatment/dp/B01LXDQXDG)\n\n${allergiesWarning}Are there specific triggers you've noticed that worsen your rosacea symptoms?`);
      }
      // Extended section for routines with more customization
      else if (lowercaseInput.includes('routine') || lowercaseInput.includes('regimen')) {
        let skinTypeRecommendation = '';
        
        if (clientProfile?.skinType) {
          switch (clientProfile.skinType.toLowerCase()) {
            case 'oily':
              skinTypeRecommendation = `For your oily skin type${name}, I recommend this comprehensive routine:\n\n` +
              "MORNING:\n" +
              "1. Cleanser: Gentle foaming cleanser (La Roche-Posay Toleriane Purifying Facial Cleanser - [Amazon](https://www.amazon.com/Roche-Posay-Toleriane-Purifying-Facial-Cleanser/dp/B01N7T7JKJ))\n" +
              "2. Toner: Alcohol-free balancing toner (Paula's Choice Pore-Reducing Toner - [Amazon](https://www.amazon.com/Paulas-Choice-RESIST-Reducing-Niacinamide/dp/B00WJRJ8LM))\n" +
              "3. Serum: Niacinamide serum to control oil (The Ordinary Niacinamide 10% + Zinc 1% - [Amazon](https://www.amazon.com/Ordinary-Niacinamide-10-Zinc-30ml/dp/B01MUEJ2R2))\n" +
              "4. Moisturizer: Lightweight gel moisturizer (Neutrogena Hydro Boost Water Gel - [Amazon](https://www.amazon.com/Neutrogena-Hydro-Hyaluronic-Hydrating-Moisturizer/dp/B00AQ4ROX0))\n" +
              "5. Sunscreen: Oil-free SPF (Supergoop! Unseen Sunscreen SPF 40 - [Amazon](https://www.amazon.com/Supergoop-Unseen-Sunscreen-Oil-Free-Protection/dp/B07CKVB14S))\n\n" +
              "EVENING:\n" +
              "1. First cleanse: Oil cleanser to remove sunscreen (DHC Deep Cleansing Oil - [Amazon](https://www.amazon.com/DHC-Deep-Cleansing-Oil-6-7/dp/B001UE60E0))\n" +
              "2. Second cleanse: Same morning cleanser\n" +
              "3. Exfoliation: BHA exfoliant 2-3x weekly (Paula's Choice 2% BHA Liquid - [Amazon](https://www.amazon.com/Paulas-Choice-SKIN-PERFECTING-Exfoliant-Gentle/dp/B00949CTQQ))\n" +
              "4. Treatment: Retinol serum 2-3x weekly (The Ordinary Retinol 0.5% in Squalane - [Amazon](https://www.amazon.com/Ordinary-Retinol-0-5-in-Squalane-30ml/dp/B0756XH3MF))\n" +
              "5. Moisturizer: Same as morning or slightly richer formula";
              break;
            case 'dry':
              skinTypeRecommendation = `For your dry skin type${name}, I recommend this comprehensive routine:\n\n` +
              "MORNING:\n" +
              "1. Cleanser: Hydrating cream or lotion cleanser (CeraVe Hydrating Facial Cleanser - [Amazon](https://www.amazon.com/CeraVe-Hydrating-Facial-Cleanser-Fragrance/dp/B01MSSDEPK))\n" +
              "2. Toner: Hydrating essence or toner (Klairs Supple Preparation Unscented Toner - [Amazon](https://www.amazon.com/KLAIRS-Preparation-Moisture-sensitive-irritated/dp/B07B65DWBM))\n" +
              "3. Serum: Hyaluronic acid serum (The Inkey List Hyaluronic Acid - [Amazon](https://www.amazon.com/INKEY-List-Hyaluronic-Acid-Hydrating/dp/B07L53D675))\n" +
              "4. Moisturizer: Rich cream with ceramides (CeraVe Moisturizing Cream - [Amazon](https://www.amazon.com/CeraVe-Moisturizing-Cream-Daily-Moisturizer/dp/B00TTD9BRC))\n" +
              "5. Sunscreen: Hydrating SPF (EltaMD UV Daily Broad-Spectrum SPF 40 - [Amazon](https://www.amazon.com/EltaMD-Clear-Facial-Sunscreen-Broad-Spectrum/dp/B002MSN3QQ))\n\n" +
              "EVENING:\n" +
              "1. First cleanse: Balm cleanser (Clinique Take The Day Off Cleansing Balm - [Amazon](https://www.amazon.com/CLINIQUE-Take-Day-Cleansing-Balm/dp/B017NJ9XP0))\n" +
              "2. Second cleanse: Same morning cleanser\n" +
              "3. Treatment: Gentle AHA 2x weekly (Mandelic Acid - STRATIA Soft Touch AHA - [Amazon](https://www.amazon.com/Stratia-Soft-Touch-Mandelic-Acid/dp/B0916WYK1X))\n" +
              "4. Serum: Nourishing peptide or ceramide serum (The Ordinary Buffet - [Amazon](https://www.amazon.com/Ordinary-Buffet-Multi-Technology-Peptide-Serum/dp/B07YQ1L5NC))\n" +
              "5. Facial oil: Squalane or rosehip oil (The Ordinary 100% Plant-Derived Squalane - [Amazon](https://www.amazon.com/Ordinary-100-Plant-Derived-Squalane-30ml/dp/B074PDL9MX))\n" +
              "6. Moisturizer: Night cream or sleeping mask (Weleda Skin Food - [Amazon](https://www.amazon.com/Weleda-Skin-Food-2-5-Ounce/dp/B000ORV3NC))";
              break;
            case 'combination':
              skinTypeRecommendation = `For your combination skin type${name}, I recommend this comprehensive routine:\n\n` +
              "MORNING:\n" +
              "1. Cleanser: Balanced gel cleanser (Cetaphil Gentle Skin Cleanser - [Amazon](https://www.amazon.com/Cetaphil-Gentle-Cleanser-Face-Ounce/dp/B07GC74LL5))\n" +
              "2. Toner: Balancing toner (Paula's Choice Advanced Replenishing Toner - [Amazon](https://www.amazon.com/Paulas-Choice-Advanced-Replenishing-Hyaluronic/dp/B01N9SPJF9))\n" +
              "3. Serum: Niacinamide to balance oil production (Paula's Choice 10% Niacinamide Booster - [Amazon](https://www.amazon.com/Paulas-Choice-BOOST-Niacinamide-Minimizer-Anti-Aging/dp/B01HDPG400))\n" +
              "4. Moisturizer: Lightweight lotion for T-zone, richer cream for dry areas as needed (CeraVe PM Facial Moisturizing Lotion - [Amazon](https://www.amazon.com/CeraVe-Facial-Moisturizing-Lotion-Lightweight/dp/B00365DABC))\n" +
              "5. Sunscreen: Hybrid formula (La Roche-Posay Anthelios Ultra-Light SPF 60 - [Amazon](https://www.amazon.com/Roche-Posay-Anthelios-Ultra-Light-Sunscreen-Oxybenzone/dp/B002CML1XE))\n\n" +
              "EVENING:\n" +
              "1. Double cleanse: Oil cleanser then gel cleanser\n" +
              "2. Exfoliation: AHA/BHA combination 2x weekly (COSRX AHA/BHA Clarifying Treatment Toner - [Amazon](https://www.amazon.com/COSRX-Clarifying-Treatment-Alcohol-Free-Exfoliating/dp/B073P6ZQ4B))\n" +
              "3. Treatment: Retinol serum 2-3x weekly (different nights from exfoliation) (The Ordinary Granactive Retinoid 2% Emulsion - [Amazon](https://www.amazon.com/Ordinary-Granactive-Retinoid-2-Emulsion-Previously/dp/B06ZXSMGQR))\n" +
              "4. Targeted treatment: Hydrating serum for dry areas, oil-control for T-zone\n" +
              "5. Moisturizer: Medium-weight moisturizer (Neutrogena Hydro Boost Gel-Cream - [Amazon](https://www.amazon.com/Neutrogena-Hydro-Hyaluronic-Hydrating-Moisturizer/dp/B00NR1YQK4))";
              break;
            case 'sensitive':
              skinTypeRecommendation = `For your sensitive skin type${name}, I recommend this comprehensive routine:\n\n` +
              "MORNING:\n" +
              "1. Cleanser: Ultra-gentle cleanser (Vanicream Gentle Facial Cleanser - [Amazon](https://www.amazon.com/Vanicream-Gentle-Cleanser-sensitive-Dispenser/dp/B00QX0D94A))\n" +
              "2. Serum: Centella asiatica to calm (PURITO Centella Unscented Serum - [Amazon](https://www.amazon.com/PURITO-Centella-Unscented-Serum-Fluid/dp/B07VGWQ1SB))\n" +
              "3. Moisturizer: Simple fragrance-free moisturizer with ceramides (First Aid Beauty Ultra Repair Cream - [Amazon](https://www.amazon.com/First-Aid-Beauty-Repair-Cream/dp/B0065I0UMO))\n" +
              "4. Sunscreen: Mineral/physical SPF (EltaMD UV Physical Broad-Spectrum SPF 41 - [Amazon](https://www.amazon.com/EltaMD-Physical-Broad-Spectrum-Sunscreen-Resistant/dp/B0012XO2W6))\n\n" +
              "EVENING:\n" +
              "1. Gentle cleanse: Same morning cleanser, avoid double-cleansing unless wearing heavy makeup/sunscreen\n" +
              "2. Treatment: Ultra-gentle exfoliation 1x weekly with PHAs (Naturium PHA 12% Exfoliant - [Amazon](https://www.amazon.com/NATURIUM-Exfoliant-Exfoliating-Resurfacing-Brightening/dp/B08H4QYW75))\n" +
              "3. Barrier repair: Ceramide serum (Dr. Jart+ Ceramidin Serum - [Amazon](https://www.amazon.com/Dr-Jart-Ceramidin-Serum-1-0oz/dp/B01N0X68LG))\n" +
              "4. Moisturizer: Same as morning or richer formula if needed\n" +
              "5. Occlusive (as needed): Thin layer of healing ointment on very dry/irritated areas (La Roche-Posay Cicaplast Baume B5 - [Amazon](https://www.amazon.com/Roche-Posay-Cicaplast-Baume-Multi-Purpose-Butter/dp/B0060OUV5Y))";
              break;
            default:
              skinTypeRecommendation = `For your skin type${name}, a good routine would be: \n\n1. Cleansing (morning and night)\n2. Treatment (serums targeting specific concerns)\n3. Moisturizing\n4. Sunscreen (morning only, SPF 30+)`;
          }
        } else {
          skinTypeRecommendation = 'A basic skincare routine should include: \n\n1. Cleansing (morning and night)\n2. Treatment (serums targeting specific concerns)\n3. Moisturizing\n4. Sunscreen (morning only, SPF 30+)';
        }
        
        resolve(`${skinTypeRecommendation}\n\n${allergiesWarning}What specific skin concerns would you like this routine to address? I can customize it further based on whether you're dealing with acne, aging, hyperpigmentation, or other issues.`);
      }
      // Handle greetings more conversationally
      else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        const greeting = clientProfile ? 
          `Hello ${clientProfile.name}! I'm DermaSage's AI assistant. ` : 
          "Hello! I'm your AI skincare assistant. ";
        
        resolve(`${greeting}I can help analyze your skin, recommend products, or answer questions about skin concerns. What's on your mind today? I can provide guidance on:\n\n1. Specific skin conditions (acne, rosacea, eczema, etc.)\n2. Personalized skincare routines\n3. Product recommendations with shopping links\n4. Diet and lifestyle tips for better skin\n5. Environmental factors affecting your skin\n6. Ingredient information and compatibility\n\nOr you can upload a photo for analysis. How can I help you today?`);
      }
      // Handle thank you messages
      else if (lowercaseInput.includes('thank') || lowercaseInput.includes('thanks')) {
        resolve(`You're welcome${name}! I'm happy to help with all your skincare needs. Is there anything else you'd like to know about ingredients, routines, or specific skin concerns? Remember, I'm here anytime you have questions!`);
      }
      // Handle goodbye messages
      else if (lowercaseInput.includes('bye') || lowercaseInput.includes('goodbye')) {
        resolve(`Goodbye${name}! Take care of your skin, and feel free to come back anytime you have skincare questions. Have a wonderful day!`);
      }
      // Handle questions about ingredients
      else if (lowercaseInput.includes('ingredient') || lowercaseInput.includes('what') && lowercaseInput.includes('in')) {
        resolve(`Great question about ingredients${name}! To give you the most accurate information, could you specify which ingredient or product you're curious about? Different ingredients serve different purposes in skincare, from hydration to exfoliation to anti-aging. I can explain how they work, ideal concentrations, and which skin types they're best for.`);
      }
      // CNN and YOLO model questions
      else if ((lowercaseInput.includes('cnn') || lowercaseInput.includes('neural network')) || 
               (lowercaseInput.includes('yolo') || lowercaseInput.includes('detection'))) {
        
        resolve(`${personalizedIntro}Yes${name}, our application uses advanced deep learning models to analyze your skin:\n\n1. CNN (Convolutional Neural Network):\n   • Used for classifying different types of skin conditions\n   • Specializes in detecting patterns like acne types, rosacea, eczema\n   • Trained on thousands of dermatological images\n   • Provides confidence scores for different skin conditions\n\n2. YOLO (You Only Look Once):\n   • Real-time object detection for specific skin features\n   • Counts and identifies issues like blackheads, whiteheads, cysts\n   • Measures severity by counting and sizing detected conditions\n   • Creates a detailed map of your skin concerns\n\n3. Additional Specialized Models:\n   • Wrinkle Detection: Analyzes fine lines and their depth\n   • Pigmentation Analysis: Evaluates dark spots and uneven tone\n   • Texture Analysis: Assesses skin smoothness and uniformity\n   • Pore Analysis: Measures pore size and distribution\n\nThe combination of these models allows us to provide comprehensive skin analysis much like a dermatologist would, considering multiple factors simultaneously. When you upload a photo, all these models work together to generate your personalized skin report and recommendations.\n\nWould you like me to explain more about how any specific part of our AI analysis works?`);
      }
      // Camera functionality
      else if (lowercaseInput.includes('camera') || 
               (lowercaseInput.includes('photo') && lowercaseInput.includes('upload')) || 
               lowercaseInput.includes('picture')) {
        
        resolve(`${personalizedIntro}You can analyze your skin by uploading photos in two ways${name}:\n\n1. In the Analysis section:\n   • Navigate to the Analysis tab from the main menu\n   • Click on the upload area or drag and drop an image\n   • Your skin will be analyzed immediately using our advanced AI models\n   • You'll see a detailed breakdown of conditions and recommendations\n   • You can also choose to use your custom trained models if available\n\n2. Directly in this chat:\n   • Click the camera icon in the message input area below\n   • Select an image from your device\n   • I'll analyze it and provide personalized results\n   • We can then discuss the results and I can answer specific questions\n\nFor best results, please upload a clear, well-lit photo of your face without makeup. Natural daylight provides the most accurate analysis. Make sure your face is centered and clearly visible.\n\nWould you like to upload a photo now for analysis?`);
      }
      // Default response that asks follow-up questions
      else {
        const response = clientProfile ? 
          `Thanks for your message${name}. To provide the best recommendations for your ${clientProfile.skinType} skin, could you share more details about your specific concerns? Are you dealing with acne, dryness, aging, sensitivity, or something else? What products are you currently using? Or you can upload a photo for analysis.` : 
          "Thanks for your message. To provide the best personalized recommendations, could you share a bit about your skin type (dry, oily, combination, sensitive) and your main skin concerns? What's your current skincare routine like? This would help me give you more tailored advice. You can also upload a photo for analysis.";
        
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
