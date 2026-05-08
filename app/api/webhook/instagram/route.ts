// Instagram webhook handler
// Meta sends two types of requests to this endpoint:
// 1. GET  — verification challenge when you first set up the webhook
// 2. POST — real events like new DMs, comments, story replies

import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/app/lib/leads";

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

// ─── POST ────────────────────────────────────────────────────────────────────
// Meta sends this every time a real event happens
// A new DM, a comment, a story reply — they all arrive here

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON payload from Meta
    const body = await request.json();

    // Log the full payload so we can see what Meta sends us
    // Very helpful during development
    console.log("Webhook received:", JSON.stringify(body, null, 2));

    // Edge case: make sure this is an Instagram event
    if (body.object !== "instagram") {
      return NextResponse.json(
        { error: "Not an Instagram event" },
        { status: 400 },
      );
    }

    // Meta batches events — one POST can contain multiple entries
    // We loop through each entry and each messaging event inside it
    const entries = body.entry ?? [];

    for (const entry of entries) {
      // Each entry can have multiple messaging events
      const messagingEvents = entry.messaging ?? [];

      for (const event of messagingEvents) {
        // We only care about message events — not read receipts or typing indicators
        // event.message exists only for actual messages
        if (!event.message) continue;

        // Edge case: ignore messages sent by the page itself
        // Otherwise we'd create a lead every time we reply to someone
        if (event.message.is_echo) continue;

        // Extract the sender's Instagram ID and their message text
        const senderId = event.sender?.id ?? "unknown";
        const messageText = event.message?.text ?? "";

        // Save this as a new lead in Supabase
        // We don't have AI scoring yet — score starts at 0
        // We'll add AI qualification in the next step
        await createLead({
          tenant_id: "default",
          // We use the sender ID as the Instagram handle for now
          // Later we'll call the Graph API to get their real username
          instagram: senderId,
          message: messageText,
          score: 0,
          tag: "cold",
          status: "new",
          // Store the full raw event so we never lose any data
          raw_payload: event,
        });

        console.log(`New lead saved: ${senderId} — "${messageText}"`);
      }
    }

    // Always return 200 quickly — Meta will retry if you don't respond fast
    // If Meta doesn't get a 200 within 20 seconds it marks your webhook as failing
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    // Edge case: something went wrong parsing or saving
    // We still return 200 to stop Meta from retrying endlessly
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 200 });
  }
}
