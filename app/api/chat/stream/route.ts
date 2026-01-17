import { NextResponse } from "next/server";

const sampleCards = [
  {
    id: "stream-1",
    type: "answer",
    title: "Quick insight",
    content: "Momentum remains with Team A based on recent overs."
  },
  {
    id: "stream-2",
    type: "match_preview",
    title: "Confidence",
    confidence: 66,
    bullets: ["Team A stronger powerplay", "Pitch aids swing", "Crowd confidence steady"]
  }
];

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      sampleCards.forEach((card, index) => {
        const payload = `data: ${JSON.stringify({ card })}\n\n`;
        controller.enqueue(encoder.encode(payload));
        if (index === sampleCards.length - 1) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        }
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
