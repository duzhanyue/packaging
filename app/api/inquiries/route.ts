import { prisma } from '../../lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const message = String(data.message || '').trim();
    if (!name || name.length > 160 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !message || message.length > 10000) {
      return Response.json({ error: 'Please check the required fields and try again.' }, { status: 400 });
    }
    await prisma.inquiry.create({ data: {
      name, email, message,
      company: String(data.company || '').trim().slice(0, 200) || null,
      phone: String(data.phone || '').trim().slice(0, 80) || null,
      product: String(data.product || '').trim().slice(0, 200) || null,
      quantity: String(data.quantity || '').trim().slice(0, 100) || null,
    } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Inquiry save failed', error);
    return Response.json({ error: 'The inquiry could not be saved right now. Please try WhatsApp or email.' }, { status: 503 });
  }
}
