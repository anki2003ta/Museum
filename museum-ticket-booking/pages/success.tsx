import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SendIcon, LandmarkIcon, UserIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import '../app/globals.css'

export default function Success() {
  const router = useRouter();
  const { query } = router;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    if (query.session_id) {
      // Add the success message to the chatbot
      setMessages(prev => [
        ...prev,
        { text: "Payment successful! Your booking is confirmed. Thank you for visiting the National Museum of Art.", sender: 'bot' }
      ]);
    }
  }, [query.session_id]);

  const handleSend = async () => {
    // Same handleSend function as before
  };

  return (
    <div className="min-h-screen bg-[#f5f2e8] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <LandmarkIcon className="w-full h-full text-[#8b7d6b]" />
      </div>
      <Card className="w-full max-w-md bg-[#fffbf0]/90 backdrop-blur-sm shadow-lg border-[#d3c7a6]">
        <CardHeader className="bg-[#8b7d6b] text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <LandmarkIcon className="mr-2 h-6 w-6" />
            MuseMate
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#8b7d6b] text-white'
                      : 'bg-[#e8e0cc] text-[#5c4f3d]'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <UserIcon className="inline-block mr-2 h-4 w-4" />
                  )}
                  {message.text}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 p-2 border rounded-l-lg"
            />
            <Button
              onClick={handleSend}
              className="bg-[#8b7d6b] text-white rounded-r-lg"
            >
              <SendIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
