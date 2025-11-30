import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // UBAH DISINI: Coba gunakan model 'gemini-pro' (paling stabil)
    // atau 'gemini-1.5-flash-latest' jika ingin flash.
    // ---------------------------------------------------------
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = `
      Kamu adalah asisten AI yang ramah dan membantu untuk "Muezza Petshop".
      Tugasmu adalah menjawab pertanyaan pelanggan dengan sopan, singkat, dan menggunakan emoji yang sesuai.

      Informasi Bisnis Muezza Petshop:
      1. **Layanan Utama**:
         - Pet Shop (Makanan & Aksesoris): Menjual Royal Canin, Whiskas, Me-O, Bolt.
         - Pet Grooming: Mandi sehat, potong kuku.
         - Pet Hotel: Penitipan hewan nyaman & bersih.
         - Pet Studio: Foto profesional hewan.

      2. **Lokasi & Kontak**:
         - Cek menu "Cabang" untuk lokasi.
         - Booking via WhatsApp di halaman Cabang.

      3. **Jam Operasional**: 08.00 - 21.00 WIB.

      4. **Gaya Bicara**: Santai, sopan, panggil "Kak" atau "Pet Lovers".

      Pertanyaan User: "${message}"
    `;

    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("Gemini API Error Details:", error);
    
    // Cek jika error karena API Key
    if (error.message?.includes("API_KEY_INVALID")) {
         return NextResponse.json({ reply: "Kunci API Gemini tidak valid." }, { status: 500 });
    }

    return NextResponse.json(
      { reply: "Maaf, sistem sedang sibuk. Bisa coba lagi nanti ya Kak! 🙏" },
      { status: 500 }
    );
  }
}