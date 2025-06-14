
-- Primeiro deletar a função existente e depois recriá-la com o tipo correto
DROP FUNCTION IF EXISTS public.get_user_emails(uuid[]);

-- Recriar a função com o tipo correto
CREATE OR REPLACE FUNCTION public.get_user_emails(user_ids uuid[])
 RETURNS TABLE(id uuid, email character varying)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  IF auth.role() = 'authenticated' THEN
    RETURN QUERY
    SELECT au.id, au.email
    FROM auth.users au
    WHERE au.id = ANY(user_ids);
  ELSE
    RETURN;
  END IF;
END;
$function$
