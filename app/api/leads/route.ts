import { NextRequest, NextResponse } from "next/server";

interface LeadPayload {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
  propertyId?: unknown;
  source?: unknown;
  website?: unknown;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optionalUuid(value: unknown) {
  const candidate = clean(value, 120);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    candidate,
  )
    ? candidate
    : null;
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as LeadPayload | null;
  if (!payload) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  if (clean(payload.website, 100)) {
    return NextResponse.json({ message: "Contato recebido." }, { status: 202 });
  }

  const lead = {
    name: clean(payload.name, 120),
    phone: clean(payload.phone, 30),
    email: clean(payload.email, 160) || null,
    message: clean(payload.message, 2000),
    property_id: optionalUuid(payload.propertyId),
    source: clean(payload.source, 30) || "contact",
  };

  if (lead.name.length < 2 || lead.phone.length < 8 || lead.message.length < 10) {
    return NextResponse.json(
      { message: "Preencha nome, telefone e uma mensagem com mais detalhes." },
      { status: 422 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        message:
          "O formulário ainda não está conectado. Envie sua mensagem pelo WhatsApp.",
      },
      { status: 503 },
    );
  }

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/leads`,
    {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { message: "Não foi possível registrar o contato. Use o WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { message: "Contato enviado. Adão responderá assim que possível." },
    { status: 201 },
  );
}
