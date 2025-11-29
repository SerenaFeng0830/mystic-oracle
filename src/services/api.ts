import { DivinationType } from "../types";

const SYSTEM_INSTRUCTIONS: Record<DivinationType, string> = {
  [DivinationType.TAROT]: `你是一位拥有百年经验的塔罗牌占卜大师。你的语气神秘、优雅且充满洞察力。
  当用户提问时，你必须先模拟"抽牌"仪式。
  请按以下格式回答：
  1. **【 抽牌结果 】**：列出3张牌（过去、现在、未来），注明是正位还是逆位。
  2. **【 牌面解读 】**：详细解释每一张牌在问题背景下的含义。
  3. **【 综合指引 】**：给出最终的建议和预言。
  请用中文回答，词藻华丽而不失真诚。`,

  [DivinationType.ICHING]: `你是一位精通《周易》的国学大师，通晓阴阳五行与八卦演变。你的语气庄重、深邃，富有哲学意味。
  当用户提问时，你需要模拟"起卦"过程。
  请按以下格式回答：
  1. **【 本卦与变卦 】**：说明得出的卦象名称（如"火天大有"）。
  2. **【 卦辞与爻辞 】**：引用相关的经典原文。
  3. **【 白话详解 】**：结合用户的问题，详细解释卦象的吉凶与启示。
  4. **【 决策建议 】**：给出具体的行动指南。`,

  [DivinationType.ASTROLOGY]: `你是一位神秘的星相学家，擅长解读星盘流年与行星相位。你的语气梦幻、感性且精准。
  请按以下格式回答：
  1. **【 当前星象 】**：分析此时此刻或用户生辰的主要行星能量（如水星逆行、金星合相）。
  2. **【 运势分析 】**：针对用户的问题，从星盘角度分析能量流动。
  3. **【 宇宙启示 】**：给出具体的日期建议或注意事项。`,

  [DivinationType.RUNES]: `你是一位来自北欧神话体系的维京祭司，手持卢恩符文石。你的语气古老、直接、充满力量。
  请按以下格式回答：
  1. **【 符文显现 】**：指出抽到的符文（如 Fehu, Uruz, Ansuz）及其象征意义。
  2. **【 奥丁的神谕 】**：解读符文背后的古老智慧。
  3. **【 命运指引 】**：直截了当地告诉用户该坚持还是放弃。`
};

export const streamDivination = async function* (
  type: DivinationType,
  userInput: string,
  context?: string
): AsyncGenerator<string, void, unknown> {
  
  const systemInstruction = SYSTEM_INSTRUCTIONS[type] || "你是一位神秘的占卜师。";
  const fullPrompt = `用户问题: ${userInput}。${context ? `背景信息: ${context}` : ''}。请开始占卜。`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: fullPrompt,
        systemInstruction: systemInstruction
      })
    });

    if (!response.ok || !response.body) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the stream chunk
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // The raw stream from Gemini is a JSON array that comes in pieces.
      // We need to parse valid JSON objects from the buffer.
      // A simple heuristic for this stream: it usually starts with [, ends with ]
      // But standard REST stream sends individual JSON objects separated or in an array structure depending on implementation.
      // For simplicity in this demo, we will use a regex to find "text" fields if JSON parsing fails on partial chunks,
      // or try to parse the accumulation.

      // Actually, standard Gemini REST stream sends a format like:
      // [{ "candidates": [...] }]
      // ,
      // [{ "candidates": [...] }]
      
      // Let's implement a robust "bracket counter" or just clean up the buffer.
      // Simplified approach: Extract text directly via regex from the raw chunk buffer to avoid strict JSON parsing issues on stream boundaries.
      
      // Look for "text": "..." content.
      const regex = /"text":\s*"((?:[^"\\]|\\.)*)"/g;
      let match;
      while ((match = regex.exec(buffer)) !== null) {
        // Unescape JSON string
        try {
          const text = JSON.parse(`"${match[1]}"`);
          yield text;
        } catch (e) {
          // Fallback if regex match isn't perfect JSON string
          yield match[1]; 
        }
      }
      
      // Clear buffer that has been processed (this is a simplified implementation)
      // For production, you'd want a true streaming JSON parser.
      const lastIndex = buffer.lastIndexOf('}');
      if (lastIndex !== -1) {
        buffer = buffer.substring(lastIndex + 1);
      }
    }

  } catch (error) {
    console.error("Divination Error:", error);
    yield "\n\n( 连接中断：神谕之光暂时暗淡，请检查网络后重试 )";
  }
};
