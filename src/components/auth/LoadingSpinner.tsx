
export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
