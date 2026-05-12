import { NextResponse } from "next/server";
import { z } from "zod";
import { clipText, extractTextFromHtml } from "@/lib/extract";

const BodySchema = z.object({ url: z.string().url() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const res = await fetch(parsed.data.url, {
      headers: { "user-agent": "FlipLanguageBot/1.0" },
      redirect: "follow",
    });
    if (!res.ok) {
      return NextResponse.json({ error: `fetch failed ${res.status}` }, { status: 502 });
    }
    const ct = res.headers.get("content-type") ?? "";
    const isText = ct.includes("text/") || ct.includes("application/xhtml");
    if (!isText) {
      return NextResponse.json({ error: `unsupported content-type ${ct}` }, { status: 415 });
    }
    const html = await res.text();
    const text = clipText(extractTextFromHtml(html));
    return NextResponse.json({ url: parsed.data.url, text, length: text.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
