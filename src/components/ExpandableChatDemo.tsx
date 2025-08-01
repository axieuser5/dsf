"use client";

import React, { useRef, useState, FormEvent } from "react";
import { X, MessageCircle, Send, Bot, Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

// lib/utils.ts (simplified for this single file)
function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(" ");
}

// shadcn/button
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-slate-300 bg-white hover:bg-slate-50 hover:text-slate-900",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

// components/ui/chat-bubble.tsx
interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant = "received", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-end gap-2",
        variant === "sent" ? "justify-end" : "justify-start",
        className,
      )}
      {...props}
    />
  ),
);
ChatBubble.displayName = "ChatBubble";

interface ChatBubbleAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
}

const ChatBubbleAvatar = React.forwardRef<
  HTMLDivElement,
  ChatBubbleAvatarProps
>(({ className, src, fallback, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  >
    {src ? (
      <img
        className="aspect-square h-full w-full object-cover"
        alt="Avatar"
        src={src}
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100">
        <span className="text-sm font-medium text-slate-600">
          {fallback}
        </span>
      </div>
    )}
  </div>
));
ChatBubbleAvatar.displayName = "ChatBubbleAvatar";

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  isLoading?: boolean;
  isBookingIframe?: boolean;
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(({ className, variant = "received", isLoading = false, isBookingIframe = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative max-w-[75%] rounded-lg px-3 py-2 text-sm",
      variant === "sent"
        ? "bg-blue-600 text-white"
        : "bg-slate-100 text-slate-800",
      isLoading && "animate-pulse",
      isBookingIframe && "p-3 max-w-[90%]",
      className,
    )}
    {...props}
  >
    {isLoading ? (
      <div className="flex space-x-1">
        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
        <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
      </div>
    ) : isBookingIframe ? (
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 mb-3">Välj datum och tid</h3>
        <div className="grid grid-cols-7 gap-1 mb-4">
          <div className="text-xs font-medium text-slate-500 p-2 text-center">Mån</div>
          <div className="text-xs font-medium text-slate-500 p-2 text-center">Tis</div>
          <div className="text-xs font-medium text-slate-500 p-2 text-center">Ons</div>
          <div className="text-xs font-medium text-slate-500 p-2 text-center">Tor</div>
          <div className="text-xs font-medium text-slate-500 p-2 text-center">Fre</div>
          <div className="text-xs font-medium text-slate-500 p-2 text-center">Lör</div>
          <div className="text-xs font-medium text-slate-500 p-2 text-center">Sön</div>
          
          {/* Empty cells for calendar alignment */}
          <div></div>
          <div></div>
          <div></div>
          
          {/* Calendar dates */}
          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28].map(day => (
            <button
              key={day}
              className="p-2 text-sm rounded hover:bg-blue-100 hover:text-blue-600 transition-colors"
            >
              {day}
            </button>
          ))}
        </div>
        
        <div className="border-t pt-3">
          <h4 className="font-medium text-slate-700 mb-2">Tillgängliga tider:</h4>
          <div className="grid grid-cols-3 gap-2">
            {['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(time => (
              <button
                key={time}
                className="p-2 text-sm border border-slate-200 rounded hover:bg-blue-600 hover:text-white transition-colors"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    ) : (
      props.children
    )}
  </div>
));
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// components/ui/chat-input.tsx
interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
ChatInput.displayName = "ChatInput";

// components/ui/chat-message-list.tsx
interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatMessageList = React.forwardRef<
  HTMLDivElement,
  ChatMessageListProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-4 p-4", className)}
    {...props}
  />
));
ChatMessageList.displayName = "ChatMessageList";


// components/ui/expandable-chat.tsx
export type ChatPosition = "bottom-right" | "bottom-left";
export type ChatSize = "sm" | "md" | "lg" | "xl" | "full";

const chatConfig = {
  dimensions: {
    sm: "sm:max-w-sm sm:max-h-[500px]",
    md: "sm:max-w-md sm:max-h-[600px]",
    lg: "sm:max-w-lg sm:max-h-[700px]",
    xl: "sm:max-w-xl sm:max-h-[800px]",
    full: "sm:w-full sm:h-full",
  },
  positions: {
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
  },
  chatPositions: {
    "bottom-right": "sm:bottom-[calc(100%+10px)] sm:right-0",
    "bottom-left": "sm:bottom-[calc(100%+10px)] sm:left-0",
  },
  states: {
    open: "pointer-events-auto opacity-100 visible scale-100 translate-y-0",
    closed:
      "pointer-events-none opacity-0 invisible scale-100 sm:translate-y-5",
  },
};

interface ExpandableChatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  position?: ChatPosition;
  size?: ChatSize;
  icon?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const ExpandableChat: React.FC<ExpandableChatProps> = ({
  className,
  position = "bottom-right",
  size = "md",
  icon,
  isOpen: controlledIsOpen,
  onToggle,
  children,
  ...props
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const toggleChat = () => {
    const newState = !isOpen;
    if (onToggle) {
      onToggle(newState);
    } else {
      setInternalIsOpen(newState);
    }
  };

  return (
    <div
      className={cn(`fixed ${chatConfig.positions[position]} z-50`, className)}
      {...props}
    >
      <div
        ref={chatRef}
        className={cn(
          "flex flex-col bg-white border border-slate-200 sm:rounded-lg shadow-lg overflow-hidden transition-all duration-250 ease-out sm:absolute sm:w-[90vw] sm:h-[80vh] fixed inset-0 w-full h-full sm:inset-auto",
          chatConfig.chatPositions[position],
          chatConfig.dimensions[size],
          isOpen ? chatConfig.states.open : chatConfig.states.closed,
          className,
        )}
      >
        {children}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 sm:hidden"
          onClick={toggleChat}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ExpandableChatToggle
        icon={icon}
        isOpen={isOpen}
        toggleChat={toggleChat}
      />
    </div>
  );
};

ExpandableChat.displayName = "ExpandableChat";

const ExpandableChatHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex items-center justify-between p-4 border-b border-slate-200", className)}
    {...props}
  />
);

ExpandableChatHeader.displayName = "ExpandableChatHeader";

const ExpandableChatBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("flex-grow overflow-y-auto", className)} {...props} />;

ExpandableChatBody.displayName = "ExpandableChatBody";

const ExpandableChatFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("border-t border-slate-200 p-4", className)} {...props} />;

ExpandableChatFooter.displayName = "ExpandableChatFooter";

interface ExpandableChatToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isOpen: boolean;
  toggleChat: () => void;
}

const ExpandableChatToggle: React.FC<ExpandableChatToggleProps> = ({
  className,
  icon,
  isOpen,
  toggleChat,
  ...props
}) => (
  <Button
    variant="default"
    onClick={toggleChat}
    className={cn(
      "w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300",
      className,
    )}
    {...props}
  >
    {isOpen ? (
      <X className="h-6 w-6" />
    ) : (
      icon || <MessageCircle className="h-6 w-6" />
    )}
  </Button>
);

ExpandableChatToggle.displayName = "ExpandableChatToggle";


export default function ExpandableChatDemo() {
  const conversationScript = [
    { "sender": "ai", "content": "Hej och välkommen till Restaurang Stella! Jag heter Sofia och finns här om du har frågor eller funderingar inför en bokning. Vad vill du veta?" },
    { "sender": "user", "content": "Hej! Var ligger restaurangen?" },
    { "sender": "ai", "content": "Vi ligger på Storgatan 15 i centrala Stockholm, bara några minuters promenad från T-centralen. Väldigt lätt att hitta!" },
    { "sender": "user", "content": "Okej, bra att veta. Vad är det som är populärt hos er?" },
    { "sender": "ai", "content": "Vår mest uppskattade rätt är vår grillade havsabborre med fänkålssallad – men vi har även vegetariska alternativ och en riktigt god svamprisotto! Menyn uppdateras säsongsvis med lokala råvaror." },
    { "sender": "user", "content": "Det låter gott! Men vi har allergier i sällskapet – en är allergisk mot nötter, en annan mot skaldjur." },
    { "sender": "ai", "content": "Tack för att du säger till! Vi tar allergier på allvar och kan anpassa både förrätter och varmrätter. Det finns markerade alternativ i menyn, och personalen är van vid att hantera specialkost." },
    { "sender": "user", "content": "Okej, bra! Och hur är det med tillgänglighet? En i vårt sällskap använder rullstol." },
    { "sender": "ai", "content": "Det är inga problem alls. Vi har rullstolsanpassad entré, hiss och flera bord med gott om utrymme. Toaletten är också tillgänglighetsanpassad." },
    { "sender": "user", "content": "Tack, då har jag bestämt mig – jag vill boka ett bord!" },
    { "sender": "ai", "content": "Vad roligt! Här är vårt bokningssystem – välj gärna datum och tid som passar er:" },
    { "sender": "ai", "content": "", "isBookingIframe": true },
    { "sender": "user", "content": "Perfekt, tack för hjälpen!" },
    { "sender": "ai", "content": "Jag är fortfarande här om du behöver hjälp - du kommer få bokningsbekräftelse efter du har valt datum och tid! Säg bara om det finns något jag kan hjälpa dig med!" }
  ];

  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isConversationComplete, setIsConversationComplete] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-open chat initially and restart loop
  React.useEffect(() => {
    const openChat = () => {
      setChatOpen(true);
      setMessages([]);
      setCurrentStep(0);
      setIsConversationComplete(false);
      
      // Start conversation with first AI message
      setTimeout(() => {
        setMessages([{
          id: 1,
          content: conversationScript[0].content,
          sender: "ai",
          isBookingIframe: conversationScript[0].isBookingIframe
        }]);
        setCurrentStep(1);
        
        // Start auto conversation
        setTimeout(() => {
          startAutoConversation(1);
        }, 2000);
      }, 1000);
    };

    if (!chatOpen) {
      const timer = setTimeout(openChat, 2000);
      return () => clearTimeout(timer);
    }
  }, [chatOpen, isConversationComplete]);

  // Auto-close chat after conversation ends and restart
  React.useEffect(() => {
    if (isConversationComplete) {
      const timer = setTimeout(() => {
        setChatOpen(false);
      }, 3000); // Close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isConversationComplete]);

  // Auto conversation function
  const startAutoConversation = (step) => {
    if (step >= conversationScript.length) return;

    const currentMessage = conversationScript[step];
    
    if (currentMessage.sender === "user") {
      // Simulate typing for user message
      let currentText = "";
      const fullText = currentMessage.content;
      
      const typeMessage = () => {
        if (currentText.length < fullText.length) {
          currentText += fullText[currentText.length];
          setInput(currentText);
          setTimeout(typeMessage, 20 + Math.random() * 40); // Faster typing speed
        } else {
          // Send message after typing is complete
          setTimeout(() => {
            const userMessage = {
              id: Date.now(),
              content: fullText,
              sender: "user",
            };
            
            setMessages(prev => [...prev, userMessage]);
            setInput("");
            setIsLoading(true);

            // AI responds
            const nextStep = step + 1;
            if (nextStep < conversationScript.length && conversationScript[nextStep].sender === "ai") {
              setTimeout(() => {
                const aiMessage = {
                  id: Date.now() + 1,
                  content: conversationScript[nextStep].content,
                  sender: "ai",
                  isBookingIframe: conversationScript[nextStep].isBookingIframe
                };
                
                setMessages(prev => [...prev, aiMessage]);
                setIsLoading(false);

                // Check if conversation is complete
                if (nextStep === conversationScript.length - 1) { // Last message
                  setTimeout(() => {
                    setIsConversationComplete(true);
                  }, 2000);
                } else {
                  // Continue conversation
                  setTimeout(() => {
                    startAutoConversation(nextStep + 1);
                  }, 2000);
                }
              }, 1500);
            }
          }, 500); // Pause before sending
        }
      };
      
      typeMessage();
    } else {
      // Skip AI messages as they're already handled
      startAutoConversation(step + 1);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || currentStep >= conversationScript.length) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      content: input,
      sender: "user",
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Find next AI response
    const nextAiStep = currentStep + 1;
    if (nextAiStep < conversationScript.length && conversationScript[nextAiStep].sender === "ai") {
      setTimeout(() => {
        const aiMessage = {
          id: messages.length + 2,
          content: conversationScript[nextAiStep].content,
          sender: "ai",
          isBookingIframe: conversationScript[nextAiStep].isBookingIframe
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setCurrentStep(nextAiStep + 1);
        setIsLoading(false);

        // Check if conversation is complete
        if (nextAiStep === conversationScript.length - 1) { // Last message
          setTimeout(() => {
            setIsConversationComplete(true);
          }, 2000);
        }
      }, 1500);
    } else {
      setIsLoading(false);
      setCurrentStep(nextAiStep);
    }
  };

  const handleAttachFile = () => {
    //
  };

  const handleMicrophoneClick = () => {
    //
  };

  return (
    <div className="h-[600px] relative">
      <ExpandableChat
        size="lg"
        position="bottom-right"
        icon={<Bot className="h-6 w-6" />}
        isOpen={chatOpen}
        onToggle={setChatOpen}
      >
        <ExpandableChatHeader className="flex-col text-center justify-center">
          <h1 className="text-xl font-semibold">Restaurang Stella 🍽️</h1>
          <p className="text-sm text-slate-500">
            Välkommen! Sofia hjälper dig med bokning
          </p>
        </ExpandableChatHeader>

        <ExpandableChatBody>
          <ChatMessageList>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src={
                    message.sender === "user"
                      ? "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=64&h=64&fit=crop&crop=face"
                      : "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=64&h=64&fit=crop&crop=face"
                  }
                  fallback={message.sender === "user" ? "DU" : "SF"}
                />
                <ChatBubbleMessage
                  variant={message.sender === "user" ? "sent" : "received"}
                  isBookingIframe={message.isBookingIframe}
                >
                  {!message.isBookingIframe && message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=64&h=64&fit=crop&crop=face"
                  fallback="SF"
                />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
          </ChatMessageList>
          <div ref={messagesEndRef} />
        </ExpandableChatBody>

        <ExpandableChatFooter>
          <form
            onSubmit={handleSubmit}
            className="relative rounded-lg border border-slate-300 bg-white focus-within:ring-1 focus-within:ring-blue-500 p-1"
          >
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skriv ditt meddelande..."
              className="min-h-12 resize-none rounded-lg bg-white border-0 p-3 shadow-none focus-visible:ring-0"
              disabled
              readOnly
            />
            <div className="flex items-center p-3 pt-0 justify-between">
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleAttachFile}
                >
                  <Paperclip className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleMicrophoneClick}
                >
                  <Mic className="size-4" />
                </Button>
              </div>
              <Button 
                type="submit" 
                size="sm" 
                className="ml-auto gap-1.5"
                disabled
              >
                Skicka
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  );
}