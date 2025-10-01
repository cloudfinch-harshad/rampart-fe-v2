"use client"

import { ReactNode } from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    control: Control<TFieldValues>
    name: TName
    label?: string
    description?: string
    options: RadioOption[]
    layout?: "horizontal" | "vertical"
    className?: string
    required?: boolean
    icon?: ReactNode
    onChange?: (value: string) => void
    disabled?: boolean
}

export function RadioGroupField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    options,
    layout = "horizontal",
    className,
    required,
    icon,
    onChange,
    disabled,
}: RadioGroupFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel className={ !label ? "flex justify-end items-end" : ""}>{icon && <span className="mr-2">{icon}</span>} {label}{required && <span className="flex justify-end text-destructive ml-1">*</span>}</FormLabel>}
                    <FormControl>
                        <RadioGroup
                            onValueChange={(value) => {
                                field.onChange(value);
                                if (onChange) onChange(value);
                            }}
                            defaultValue={field.value}
                            value={field.value}
                            className={layout === "horizontal" ? "flex flex-row space-x-4" : "space-y-2"}
                            disabled={disabled}
                        >
                            {options.map((option, index) => (
                                <FormItem 
                                    key={index} 
                                    className={layout === "horizontal" ? "flex items-center space-x-3 space-y-0" : "flex items-start space-x-3 space-y-0"}
                                >
                                    <FormControl>
                                        <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {option.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
