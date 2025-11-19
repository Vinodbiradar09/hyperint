import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { ConversationHandler } from '@/app/lib/conversationHandler';
import { ratelimit } from "@/app/lib/ratelimit"

const MessagingResponse = twilio.twiml.MessagingResponse;

export async function POST(req : NextRequest) {
    try {
        const formData = await req.formData();
        const from = formData.get("From") as string;
        const body = formData.get('Body') as string;
        if (!from || !body) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const key = `wa:${from}`;
        const { success } = await ratelimit.limit(key);
        // this success returns true it means rateLimit is not assigned , if false then the rate limit is applied
        if(!success){
            const twiml = new MessagingResponse();
            twiml.message("You have exceeded the message limit. Please try again after 1 hour");
            return new NextResponse(twiml.toString(), {
                status: 429,
                headers: { "Content-Type": "text/xml" },
            });
        }
        const responseMessage = await ConversationHandler.processMessage(from, body);

        const twiml = new MessagingResponse();
        twiml.message(responseMessage);
        return new NextResponse(twiml.toString(), {
            status: 200,
            headers: { 'Content-Type': 'text/xml' },
        });

    } catch (error) {
        console.error('Webhook error:', error);
        const twiml = new MessagingResponse();
        twiml.message('Sorry, something went wrong. Please try again.');

        return new NextResponse(twiml.toString(), {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
        });
    }
}

export async function GET() {
  return NextResponse.json({ message: 'WhatsApp webhook endpoint is active' });
}
