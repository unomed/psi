import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);

      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione apenas arquivos de imagem");
        return null;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error("A imagem deve ter no máximo 5MB");
        return null;
      }

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast.error("Usuário não autenticado");
        return null;
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload para o storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Erro no upload:", error);
        toast.error("Erro ao fazer upload da imagem");
        return null;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      // Atualizar perfil com nova URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error("Erro ao atualizar perfil:", updateError);
        toast.error("Erro ao atualizar perfil");
        return null;
      }

      toast.success("Foto de perfil atualizada com sucesso");
      return publicUrl;

    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro inesperado");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadAvatar, uploading };
}