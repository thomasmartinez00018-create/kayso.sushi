
import { GoogleGenAI } from "@google/genai";
import { MenuItem } from "../types";

export const getSushiRecommendation = async (userMood: string, menuItems: MenuItem[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Prepare a concise menu context for the AI
  const menuContext = menuItems.map(item => 
    `- ${item.name}: ${item.description} ($${item.price})`
  ).join('\n');

  const prompt = `Actúa como el Sommelier experto de Kayso Sushi, un delivery líder en San Miguel, Argentina. 
  Tu objetivo es recomendar el plato ideal del menú basado en lo que el cliente tiene ganas.
  
  MENÚ DISPONIBLE:
  ${menuContext}
  
  SOLICITUD DEL CLIENTE: "${userMood}"
  
  REGLAS:
  1. Sé amable, canchero y breve (máximo 3 oraciones).
  2. Mencioná 1 o 2 opciones específicas del menú que coincidan con su antojo.
  3. Si mencionás precios, usá el formato $X.XXX.
  4. Si no hay nada que coincida exactamente, recomendá el "Combinado Premium" o el "Kayso Roll".
  5. Respondé en español rioplatense (usá "che", "tenés", "pedite").`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 200,
      }
    });

    return response.text || "Che, se me complicó la cocina. ¡Pero te recomiendo el Combinado Premium que nunca falla!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "¡Hola! Estoy un poco ocupado en la barra. Te recomiendo probar nuestro Kayso Roll, ¡es la estrella de la casa!";
  }
};
