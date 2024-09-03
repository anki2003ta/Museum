import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SendIcon, UserIcon, LandmarkIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { sendBookingData } from "@/lib/api";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import { loadStripe } from '@stripe/stripe-js';
import 'react-time-picker/dist/TimePicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../app/globals.css';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

const initialMessages: Message[] = [
  { text: "Welcome to the National Museum of Art! I'm MuseMate, your personal guide. How may I assist you today? You can ask about exhibitions, ticket booking, or museum information.", sender: 'bot' },
];

export default function Component() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [adults, setAdults] = useState<number>(0);
  const [seniors, setSeniors] = useState<number>(0);
  const [billDetails, setBillDetails] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, billDetails]);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');

      setTimeout(async () => {
        let botResponse = "I'm sorry, I didn't understand that. Can you please rephrase your question?";

        if (input.toLowerCase().includes('exhibitions')) {
          botResponse = `Current Exhibitions:
            \n1. Harappan Culture
            \n2. Critical Zones: In Search of A Common Ground
            \n3. Bodhi Yatra
            \n4. Jarracharra: Dry Season Wind
            \n5. Aadi Chitra`;
        } else if (input.toLowerCase().includes('opening hours')) {
          botResponse = `Opening Hours:
            \nMonday - Saturday: 9 AM - 6 PM
            \nSunday: 10 AM - 4 PM`;
        } else if (input.toLowerCase().includes('prices') || input.toLowerCase().includes('fees')) {
          botResponse = `Admission Fees:
            \nAdults: Rs.15
            \nStudents & Seniors: Rs.10
            \nChildren (under 12): Free`;
        } else if (input.toLowerCase().includes('special events')) {
          botResponse = "Currently, there are no special events. Kindly book tickets for exclusive access.";
        } else if (input.toLowerCase().includes('book') || input.toLowerCase().includes('ticket')) {
          botResponse = "Choose the date from the available days mentioned below or ask for the opening hours. I will help you out if you can't find it.";
          setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);

          setTimeout(() => {
            botResponse = "Please select a date for your visit:";
            setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
          }, 1000);
        }

        setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
      }, 1000);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setMessages(prev => [...prev, { text: `You've selected ${date.toDateString()}.`, sender: 'bot' }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Great! Let's move further. Book your time so that the time can be allotted only to you.", sender: 'bot' }]);
      }, 1000);
    }
  };

  const handleTimeChange = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const selectedDateDay = selectedDate?.getDay();

    const isValidTime = (hours >= 9 && hours < 18 && selectedDateDay !== 0) || (hours >= 10 && hours < 16 && selectedDateDay === 0);

    if (isValidTime) {
      setSelectedTime(time);
      setMessages(prev => [...prev, { text: `You've selected ${time}.`, sender: 'bot' }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "How many of you are visiting?", sender: 'bot' }]);
      }, 1000);
    } else {
      setMessages(prev => [...prev, { text: "Please select a time within the allowed range.", sender: 'bot' }]);
    }
  };

  const handleBillGeneration = async () => {
    if (!selectedDate || !selectedTime) {
      setMessages(prev => [...prev, { text: "Please select both date and time before generating the bill.", sender: 'bot' }]);
      return;
    }

    const total = 15 * adults + 10 * seniors;

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Museum Visit Bill", 10, 20);
    pdf.setFontSize(12);
    pdf.text(`Date: ${selectedDate.toDateString()}`, 10, 30);
    pdf.text(`Time: ${selectedTime}`, 10, 40);
    pdf.text(`Adults: Rs.15 * ${adults} = Rs.${15 * adults}`, 10, 50);
    pdf.text(`Students/Seniors: Rs.10 * ${seniors} = Rs.${10 * seniors}`, 10, 60);
    pdf.text(`Total: Rs.${total}`, 10, 70);

    pdf.save('bill.pdf');

    const billText = `
      <h2>Museum Visit Bill</h2>
      <p><strong>Date:</strong> ${selectedDate.toDateString()}</p>
      <p><strong>Time:</strong> ${selectedTime}</p>
      <p><strong>Adults:</strong> Rs.15 * ${adults} = Rs.${15 * adults}</p>
      <p><strong>Students/Seniors:</strong> Rs.10 * ${seniors} = Rs.${10 * seniors}</p>
      <p><strong>Total:</strong> Rs.${total}</p>
    `;

    setBillDetails(billText);

    try {
      await sendBookingData({
        date: selectedDate.toDateString(),
        time: selectedTime,
        adults,
        seniors,
        total
      });
      setMessages(prev => [...prev, { text: "Your bill has been generated. Please review it below and proceed to payment.", sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error saving booking details: " + error.message, sender: 'bot' }]);
    }
  };

  const handlePayment = async () => {
    try {
      const total = 15 * adults + 10 * seniors; // Calculate total based on user inputs
  
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ total }), // Send total amount
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string;
        const stripe = await loadStripe(stripePublicKey);
  
        if (stripe) {
          // Extract sessionId from the data object
          const { sessionId } = data;
          
          const { error } = await stripe.redirectToCheckout({ sessionId });
  
          if (error) {
            console.error('Error:', error);
          }
        } else {
          console.error('Stripe failed to initialize.');
        }
      } else {
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Payment Error:', error);
    }
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

            {messages.some(message => message.text.includes('Please select a date')) && !selectedDate && (
              <div className="relative">
                <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  className="w-full p-2 pl-8 mt-2 border rounded-lg"
                  placeholderText="Select a date"
                />
              </div>
            )}

            {messages.some(message => message.text.includes('Great! Let\'s move further. Book your time')) && !selectedTime && (
              <div className="relative">
                <ClockIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <TimePicker
                  onChange={handleTimeChange}
                  value={selectedTime}
                  className="w-full p-2 pl-8 mt-2 border rounded-lg"
                  disableClock={true}
                />
              </div>
            )}

            {messages.some(message => message.text.includes('How many of you are visiting?')) && (
              <div className="mt-4">
                <Input
                  type="number"
                  placeholder="Number of Adults"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="mb-2"
                />
                <Input
                  type="number"
                  placeholder="Number of Students/Seniors"
                  value={seniors}
                  onChange={(e) => setSeniors(Number(e.target.value))}
                  className="mb-2"
                />
                <Button
                  onClick={handleBillGeneration}
                  className="w-full mt-4 bg-[#8b7d6b] text-white hover:bg-[#6a4f3b]"
                >
                  Generate Bill
                </Button>
              </div>
            )}

            {billDetails && (
              <div className="mt-4 p-4 border rounded-lg bg-[#f5f2e8]">
                <div dangerouslySetInnerHTML={{ __html: billDetails }} />
                <Button
                  onClick={handlePayment}
                  className="w-full mt-4 bg-[#8b7d6b] text-white hover:bg-[#6a4f3b]"
                >
                  Pay with Stripe
                </Button>
              </div>
            )}
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
