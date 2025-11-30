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
      text: "Halo Kak! 👋 Selamat datang di Muezza Petshop. Aku siap bantu info soal produk, grooming, hotel, atau studio foto. Mau tanya apa ni?",
      sender: "bot",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Tambahkan pesan user ke UI
    const userMsg: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // 2. Kirim ke API Gemini
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await response.json();

      // 3. Tambahkan balasan bot ke UI
      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.reply || "Maaf, ada gangguan koneksi. Coba lagi ya.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Waduh, aku lagi pusing nih 😵. Coba tanya lagi nanti ya.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
                  <CardTitle className="text-base text-[#1D3A2F]">Muezza AI</CardTitle>
                  <p className="text-xs text-[#1D3A2F]/80">Online • Powered by Gemini</p>
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
                    {/* Render text (bisa ditambahkan markdown parser jika ingin format bold/list) */}
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-primary-blue" />
                    <span className="text-xs text-slate-400">Muezza sedang mengetik...</span>
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
                  placeholder="Tanya sesuatu..."
                  className="rounded-full bg-slate-50 border-slate-200 focus-visible:ring-primary-blue"
                  disabled={isTyping}
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