
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5542323222273";
    const message = "Olá! Gostaria de mais informações sobre os serviços da Unomed.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 text-white shadow-lg z-30"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
