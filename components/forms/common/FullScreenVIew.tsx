import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface FullScreenFormCardProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  actionButton?: ReactNode;
  isLoading?: boolean;
}

export function FullScreenFormCard({
  title,
  subtitle,
  onClose,
  children,
  className,
  actionButton,
  isLoading = false,
}: FullScreenFormCardProps) {
  return (
    <div className={cn("fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center")}>
      <div 
        className={cn(
          "bg-background rounded-lg shadow-2xl border w-screen h-screen flex flex-col",
          className
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-4">
            <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            disabled={isLoading}
            className="sixe-10 rounded-full shadow-sm border-2 bg-black hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          </div>
          {actionButton}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-blue-100 gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}
