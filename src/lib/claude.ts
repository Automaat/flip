type ContentBlock = { type: "text"; text: string } | { type: string };
type ApiResponse = { content?: ContentBlock[]; error?: { message?: string } };

export class ClaudeClient {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "claude-haiku-4-5-20251001") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async complete(prompt: string, maxTokens = 400): Promise<string> {
    return this.chat([{ role: "user", content: prompt }], maxTokens);
  }

  async chat(
    messages: { role: "user" | "assistant"; content: string }[],
    maxTokens = 400,
    system?: string,
  ): Promise<string> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: maxTokens,
        ...(system ? { system } : {}),
        messages,
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as ApiResponse;
      throw new Error(body.error?.message ?? `claude api ${res.status}`);
    }
    const body = (await res.json()) as ApiResponse;
    const text = body.content?.find((c): c is { type: "text"; text: string } => c.type === "text")
      ?.text;
    if (!text) throw new Error("empty claude response");
    return text;
  }
}

export function getClaudeClient(): ClaudeClient | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new ClaudeClient(key);
}

export type Mnemonic = { keyword: string; scene: string };

const MNEMONIC_PROMPT = (spanish: string, english: string) =>
  `Create a memorable mnemonic for an English speaker learning the Spanish word "${spanish}" (meaning "${english}").
Respond with two short lines, exactly this format:
KEYWORD: <one English word or short phrase that sounds like the Spanish word>
SCENE: <one short vivid sentence linking the keyword to the meaning>`;

export function parseMnemonic(text: string): Mnemonic | null {
  const kw = text.match(/KEYWORD:\s*(.+)/i)?.[1]?.trim();
  const sc = text.match(/SCENE:\s*(.+)/i)?.[1]?.trim();
  if (!kw || !sc) return null;
  return { keyword: kw, scene: sc };
}

export function buildMnemonicPrompt(spanish: string, english: string): string {
  return MNEMONIC_PROMPT(spanish, english);
}
