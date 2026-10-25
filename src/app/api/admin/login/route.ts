import { NextResponse } from "next/server";

const ADMIN_EMAILS = [
  "pradoblancop@gmail.com",
  "adrianapradob@hotmail.com",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    const authorized = ADMIN_EMAILS.map((e) => e.toLowerCase());
    if (!authorized.includes(email)) {
      return NextResponse.json(
        { error: `El correo "${email}" no está en la lista de administradores autorizados.` },
        { status: 401 }
      );
    }

    const expectedPassword =
      process.env.ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: "No se ha configurado ninguna contraseña en el archivo .env.local del servidor." },
        { status: 500 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        { error: "Contraseña incorrecta. Por favor verifica la clave de administrador." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno al verificar las credenciales." },
      { status: 500 }
    );
  }
}
