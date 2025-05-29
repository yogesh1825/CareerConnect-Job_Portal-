import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "../ui/button";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you with your job search today?", sender: "bot" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages([...messages, { text: inputMessage, sender: "user" }]);
    
    // Simulate bot response (you can replace this with actual API call)
    setTimeout(() => {
      const botResponses = [
        "I can help you find jobs matching your skills. What kind of position are you looking for?",
        "Make sure your profile is complete to increase your chances of getting noticed by employers.",
        "Don't forget to upload your resume for better job matches!",
        "You can filter jobs by location, salary, and industry from the jobs page.",
        "Feel free to ask me questions about the application process!"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { text: randomResponse, sender: "bot" }]);
    }, 1000);

    setInputMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-[#6A38C2] text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-medium">Job Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-[#5930a5] h-8 w-8" 
              onClick={toggleChat}
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 ${
                  message.sender === "user" 
                    ? "flex justify-end" 
                    : "flex justify-start"
                }`}
              >
                <div 
                  className={`p-2 rounded-lg max-w-[80%] ${
                    message.sender === "user" 
                      ? "bg-[#6A38C2] text-white rounded-br-none" 
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="bg-[#6A38C2] hover:bg-[#5930a5]"
              >
                <Send size={18} />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="rounded-full h-14 w-14 bg-[#6A38C2] hover:bg-[#5930a5] shadow-lg"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
};

export default ChatBot; 