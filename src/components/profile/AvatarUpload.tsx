import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName: string;
  onAvatarUpdate: (newUrl: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, userName, onAvatarUpdate }: AvatarUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadAvatar, uploading } = useAvatarUpload();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    const newUrl = await uploadAvatar(file);
    if (newUrl) {
      onAvatarUpdate(newUrl);
    }
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentAvatarUrl} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        <label 
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <Camera className="h-4 w-4" />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="sr-only"
            disabled={uploading}
          />
        </label>
      </div>

      <Button 
        variant="outline" 
        size="sm"
        onClick={() => document.getElementById('avatar-upload')?.click()}
        disabled={uploading}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Enviando..." : "Alterar Foto"}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Formatos: JPG, PNG, WEBP<br/>
        Tamanho máximo: 5MB
      </p>
    </div>
  );
}