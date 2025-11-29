import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DivinationType } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the client.
// Note: In a real production app, you might want to proxy this through a backend
// to protect the API key, but for this client-side demo, we use it directly as requested.
const ai = new GoogleGenAI({ apiKey: apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTIONS: Record<DivinationType, string> = {
  [DivinationType.TAROT]: `你是一位拥有百年经验的塔罗牌占卜大师。你的语气神秘、优雅且充满洞察力。
  当用户提问时，你必须先进行"抽牌"仪式。
  请按以下格式回答：
  1. **抽牌结果**：列出3张牌（过去、现在、未来），注明是正位还是逆位。
  2. **牌面解读**：详细解释每一张牌在问题背景下的含义。
  3. **综合指引**：给出最终的建议和预言。
  请用中文回答，词藻华丽而不失真诚。`,

  [DivinationType.ICHING]: `你是一位精通《周易》的国学大师，通晓阴阳五行与八卦演变。你的语气庄重、深邃，富有哲学意味。
  当用户提问时，你需要模拟"起卦"过程。
  请按以下格式回答：
  1. **本卦与变卦**：说明得出的卦象名称（如"火天大有"）。
  2. **卦辞与爻辞**：引用相关的经典原文。
  3. **白话详解**：结合用户的问题，详细解释卦象的吉凶与启示。
  4. **决策建议**：给出具体的行动指南。`,

  [DivinationType.ASTROLOGY]: `你是一位神秘的星相学家，擅长解读星盘流年与行星相位。你的语气梦幻、感性且精准。
  请按以下格式回答：
  1. **当前星象**：分析此时此刻或用户生辰的主要行星能量（如水星逆行、金星合相）。
  2. **运势分析**：针对用户的问题，从星盘角度分析能量流动。
  3. **宇宙启示**：给出具体的日期建议或注意事项。`,

  [DivinationType.RUNES]: `你是一位来自北欧神话体系的维京祭司，手持卢恩符文石。你的语气古老、直接、充满力量。
  请按以下格式回答：
  1. **符文显现**：指出抽到的符文（如 Fehu, Uruz, Ansuz）及其象征意义。
  2. **奥丁的神谕**：解读符文背后的古老智慧。
  3. **命运指引**：直截了当地告诉用户该坚持还是放弃。`
};

export const streamDivination = async function* (
  type: DivinationType,
  userInput: string,
  context?: string
): AsyncGenerator<string, void, unknown> {
  
  const systemInstruction = SYSTEM_INSTRUCTIONS[type] || "你是一位神秘的占卜师。";
  
  const prompt = `用户的问题/背景: ${userInput}。
  ${context ? `额外信息: ${context}` : ''}
  请开始你的占卜。`;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8, // Slightly higher for creativity/mystique
      }
    });

    for await (const chunk of responseStream) {
       yield chunk.text;
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "冥冥之中的迷雾遮挡了视线（网络请求失败，请检查API Key或稍后重试）。";
  }
};
