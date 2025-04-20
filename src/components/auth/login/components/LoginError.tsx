
interface LoginErrorProps {
  error: string;
}

export function LoginError({ error }: LoginErrorProps) {
  return (
    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      {error}
    </div>
  );
}
