"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog"

// AlertDialog is a wrapper around Dialog
const AlertDialog = Dialog

// AlertDialogTrigger is a wrapper around DialogTrigger
const AlertDialogTrigger = DialogTrigger

// AlertDialogPortal is a wrapper around DialogPortal
const AlertDialogPortal = DialogPortal

// AlertDialogOverlay is a wrapper around DialogOverlay
const AlertDialogOverlay = DialogOverlay

// AlertDialogContent is a wrapper around DialogContent
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
AlertDialogContent.displayName = "AlertDialogContent"

// AlertDialogHeader is a wrapper around DialogHeader
const AlertDialogHeader = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogHeader>) => (
  <DialogHeader
    className={cn(className)}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

// AlertDialogFooter is a wrapper around DialogFooter
const AlertDialogFooter = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogFooter>) => (
  <DialogFooter
    className={cn(className)}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

// AlertDialogTitle is a wrapper around DialogTitle
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => (
  <DialogTitle
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

// AlertDialogDescription is a wrapper around DialogDescription
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogDescription>,
  React.ComponentPropsWithoutRef<typeof DialogDescription>
>(({ className, ...props }, ref) => (
  <DialogDescription
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

// Custom components that don't have direct Dialog equivalents
const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
