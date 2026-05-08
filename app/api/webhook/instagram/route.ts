// Instagram webhook handler
// Meta sends two types of requests to this endpoint:
// 1. GET  — verification challenge when you first set up the webhook
// 2. POST — real events like new DMs, comments, story replies

import { NextRequest, NextResponse } from "next/server";
import { createLead, updateLeadScore } from "@/app/lib/leads";
import { qualifyLead } from "@/app/lib/qualify";

// ─── GET ─────────────────────────────────────────────────────────────────────
// Meta calls this once when you register your webhook URL
// It sends a challenge string and expects you to echo it back
// This proves you own the server at this URL

export async function GET(request: NextRequest) {
  // Read query parameters from the URL
  // Meta sends: ?hub.mode=subscribe&hub.verify_token=XXX&hub.challenge=YYY
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Edge case: missing parameters
  if (!mode || !token || !challenge) {
    console.error("Webhook verification failed: missing parameters");
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Check mode is "subscribe" and token matches our secret
  // The verify token is something we made up — we check it matches
  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    // Echo back the challenge as plain text — Meta expects this
    return new NextResponse(challenge, { status: 200 });
  }

  // Edge case: token doesn't match — reject the request
  console.error("Webhook verification failed: token mismatch");
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// ─── POST handler — now with AI qualification ─────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Webhook received:", JSON.stringify(body, null, 2));

    if (body.object !== "instagram") {
      return NextResponse.json(
        { error: "Not an Instagram event" },
        { status: 400 },
      );
    }

    const entries = body.entry ?? [];

    for (const entry of entries) {
      const messagingEvents = entry.messaging ?? [];

      for (const event of messagingEvents) {
        if (!event.message) continue;
        if (event.message.is_echo) continue;

        const senderId = event.sender?.id ?? "unknown";
        const messageText = event.message?.text ?? "";

        // Step 1 — Save the lead immediately with score 0
        // We save first so the lead is never lost even if AI fails
        const lead = await createLead({
          tenant_id: "default",
          instagram: senderId,
          message: messageText,
          score: 0,
          tag: "cold",
          status: "new",
          raw_payload: event,
        });

        console.log(`Lead saved: ${senderId} — "${messageText}"`);

        // Step 2 — Run AI qualification on the message
        // This happens after saving so we never lose a lead
        if (lead && messageText) {
          console.log(`Qualifying lead ${lead.id}...`);

          const qualification = await qualifyLead(messageText);

          // Step 3 — Update the lead with AI results
          await updateLeadScore(
            lead.id,
            qualification.score,
            qualification.tag,
          );

          // Also save the suggested reply and reason
          // We'll add this to updateLeadScore in the next step
          const { error } = await (
            await import("@/app/lib/supabase")
          ).supabase
            .from("leads")
            .update({
              suggested_reply: qualification.suggestedReply,
              ai_reason: qualification.reason,
            })
            .eq("id", lead.id);

          if (error) {
            console.error("Failed to save AI results:", error.message);
          } else {
            console.log(
              `Lead qualified: score=${qualification.score} ` +
                `tag=${qualification.tag} — ${qualification.reason}`,
            );
          }
        }
      }
    }

    // Always return 200 quickly
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 200 });
  }
}
