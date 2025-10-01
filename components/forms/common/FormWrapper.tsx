"use client"

import { ReactNode } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

interface FormWrapperProps<TFormValues extends FieldValues> {
    form: UseFormReturn<TFormValues>
    onSubmit: (data: TFormValues) => Promise<void>
    title?: string
    description?: string
    children: ReactNode
    isLoading?: boolean
    submitLabel?: string
    cancelLabel?: string
    onCancel?: () => void
    className?: string
    cardClassName?: string
    formClassName?: string
    showCard?: boolean
    submitButtonClassName?: string
    canSubmit?: boolean
    showDraftButton?: boolean
    onSaveAsDraft?: () => Promise<void>
    draftLabel?: string
}

export function FormWrapper<TFormValues extends FieldValues>({
    form,
    onSubmit,
    title,
    description,
    children,
    isLoading = false,
    submitLabel = "Submit",
    cancelLabel = "Cancel",
    onCancel,
    className = "",
    cardClassName = "",
    formClassName = "space-y-6 max-h-[75vh] overflow-y-auto pr-2",
    showCard = true,
    submitButtonClassName = "",
    canSubmit = true,
    showDraftButton = false,
    onSaveAsDraft,
    draftLabel = "Save as Draft",
}: FormWrapperProps<TFormValues>) {
    const handleSubmit = async (data: TFormValues) => {
        try {
            await onSubmit(data)
        } catch (error) {
            console.error("Form submission error:", error)
            toast.error("An error occurred while submitting the form")
        }
    }

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={formClassName}>
                {children}
                <div className="flex justify-end space-x-2 pt-4">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            {cancelLabel}
                        </Button>
                    )}
                    {showDraftButton && onSaveAsDraft && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onSaveAsDraft}
                            disabled={isLoading || !canSubmit}
                            className="border-blue-500 text-blue-500 hover:bg-blue-50"
                        >
                            {isLoading ? "Processing..." : draftLabel}
                        </Button>
                    )}
                    <Button 
                        type="submit" 
                        disabled={isLoading || !canSubmit}
                        className={submitButtonClassName}
                        title={!canSubmit ? "You don't have permission to perform this action" : ""}
                    >
                        {isLoading ? "Processing..." : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    )

    if (!showCard) {
        return <div className={className}>{formContent}</div>
    }

    return (
        <Card className={cardClassName}>
            {(title || description) && (
                <CardHeader className={`${className}`}>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent className="">
                {formContent}
            </CardContent>
        </Card>
    )
}
