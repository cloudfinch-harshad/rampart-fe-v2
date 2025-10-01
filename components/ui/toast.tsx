"use client";

import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "group border-border bg-background text-foreground",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90",
          success: "bg-green-500 text-white border-green-600",
          error: "bg-destructive text-destructive-foreground border-destructive",
          info: "bg-blue-500 text-white border-blue-600",
        },
      }}
    />
  );
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
      });
    }
    
    if (variant === "success") {
      return sonnerToast.success(title, {
        description,
      });
    }
    
    return sonnerToast(title, {
      description,
    });
  };

  return { toast };
}
