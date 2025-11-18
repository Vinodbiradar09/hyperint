import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { ConversationHandler } from '@/app/lib/conversationHandler';

const MessagingResponse = twilio.twiml.MessagingResponse;

export async function POST(req : NextRequest) {
    try {
        const formData = await req.formData();
        const from = formData.get("From") as string;
        const body = formData.get('Body') as string;
        if (!from || !body) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
