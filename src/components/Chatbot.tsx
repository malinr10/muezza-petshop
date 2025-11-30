"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Halo! Selamat datang di Muezza Petshop 🐾. Ada yang bisa saya bantu? Kamu bisa tanya soal lokasi, jam buka, atau layanan kami.",
      sender: "bot",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Logika "Otak" Chatbot
  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("halo") || lowerInput.includes("hi") || lowerInput.includes("pagi") || lowerInput.includes("siang")) {
      return "Halo juga! 👋 Ada yang bisa Muezza bantu untuk anabul kesayanganmu?";
    }

    if (lowerInput.includes("jam") || lowerInput.includes("buka") || lowerInput.includes("tutup") || lowerInput.includes("waktu")) {
      return "🕒 Muezza Petshop buka setiap hari dari jam 08.00 - 21.00 WIB. Kami siap melayani kebutuhan anabulmu!";
    }

    if (lowerInput.includes("lokasi") || lowerInput.includes("alamat") || lowerInput.includes("cabang") || lowerInput.includes("dimana")) {
      return "📍 Kami memiliki beberapa cabang strategis. Kamu bisa cek detail lokasi lengkapnya di menu 'Cabang' pada website ini.";
    }

    if (lowerInput.includes("produk") || lowerInput.includes("makanan") || lowerInput.includes("jual")) {
      return "🛍️ Kami menjual berbagai makanan kucing (Royal Canin, Whiskas, Me-O, Bolt), vitamin, pasir, dan aksesoris. Cek menu 'Produk' untuk katalog lengkapnya.";
    }

    if (lowerInput.includes("grooming") || lowerInput.includes("mandi")) {
      return "zp🚿 Layanan Grooming kami mencakup mandi sehat, potong kuku, dan bersihkan telinga. Bisa booking via WhatsApp ya!";
    }

    if (lowerInput.includes("hotel") || lowerInput.includes("penitipan") || lowerInput.includes("inap")) {
      return "zp🏨 Mau titip anabul? Muezza Pet Hotel menyediakan tempat yang nyaman, ber-AC, dan diawasi staff profesional.";
    }

    if (lowerInput.includes("studio") || lowerInput.includes("foto")) {
      return "📸 Abadikan momen lucu anabulmu di Pet Studio kami! Tersedia berbagai kostum dan properti menarik.";
    }

    if (lowerInput.includes("harga") || lowerInput.includes("biaya")) {
      return "💰 Untuk detail harga layanan dan produk, silakan cek halaman terkait di website ini atau hubungi kami langsung via WhatsApp untuk promo terbaru.";
    }

    if (lowerInput.includes("kontak") || lowerInput.includes("wa") || lowerInput.includes("whatsapp") || lowerInput.includes("telp")) {
      return "📞 Kamu bisa menghubungi kami melalui WhatsApp di nomor yang tertera di halaman 'Cabang' untuk respon cepat.";
    }

    return "Maaf, saya kurang mengerti pertanyaanmu 🤔. Coba tanya tentang 'jam buka', 'lokasi', 'grooming', atau 'produk'.";
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Tambahkan pesan user
    const newUserMsg: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // 2. Simulasi delay bot berpikir
    setTimeout(() => {
      const botResponseText = getBotResponse(newUserMsg.text);
      const newBotMsg: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* --- Floating Button Trigger --- */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-xl bg-primary-blue hover:bg-[#9dcce6] text-[#1D3A2F] transition-transform hover:scale-110"
          >
            <MessageCircle className="!w-8 !h-8" />
          </Button>
        )}
      </div>

      {/* --- Chat Window --- */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[350px] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <Card className="border-2 border-blue-100 shadow-2xl overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <CardHeader className="bg-primary-blue p-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1.5 rounded-full">
                  <Bot className="w-5 h-5 text-primary-blue" />
                </div>
                <div>
                  <CardTitle className="text-base text-[#1D3A2F]">Muezza Assistant</CardTitle>
                  <p className="text-xs text-[#1D3A2F]/80">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 text-[#1D3A2F] h-8 w-8"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>

            {/* Chat Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.sender === "user"
                        ? "bg-primary-blue text-[#1D3A2F] rounded-br-none"
                        : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <div className="p-3 bg-white border-t">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik pertanyaan..."
                  className="rounded-full bg-slate-50 border-slate-200 focus-visible:ring-primary-blue"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full bg-primary-blue hover:bg-[#9dcce6] text-[#1D3A2F]"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}