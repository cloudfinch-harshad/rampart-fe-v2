"use client"

import { ReactNode, useState, useEffect, useRef } from "react"
import { Control, FieldPath, FieldValues, ControllerProps, useFormContext } from "react-hook-form"
import { CalendarIcon, X, Plus } from "lucide-react"
import { format } from "date-fns"

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form"
import { Input } from "../../ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select"
import { Textarea } from "../../ui/textarea"
import { Button } from "../../ui/button"
import { PhoneInput } from "../../ui/phone-input"
import { cn } from "../../../lib/utils"
import { Checkbox } from "../../ui/checkbox"
import { Calendar } from "../../ui/calendar"

// Base props for all field types
interface BaseFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    control: Control<TFieldValues>
    name: TName
    label?: string
    description?: string
    className?: string
    required?: boolean
    icon?: ReactNode
    disabled?: boolean
}

// Text Input Field
interface TextFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
    placeholder?: string
    type?: "text" | "email" | "password" | "tel" | "url" | "number"
    step?: string
    disabled?: boolean
}

export function TextField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    placeholder,
    type = "text",
    step,
    className,
    required,
    disabled,
    icon,
}: TextFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className || "mt-1"}>
                    <FormLabel className={ !label ? "flex justify-end items-end" : ""}>{icon && <span className="mr-2">{icon}</span>} {label}{required && <span className="flex justify-end text-destructive ml-1">*</span>}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            type={type}
                            step={step}
                            disabled={disabled}
                            {...field}
                            value={field.value ?? ""}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

// Select Field
interface SelectFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
    placeholder?: string
    options: { label: string; value: string }[] | string[]
    onChange?: (value: string) => void
    disabled?: boolean
    search?: boolean
    onSearch?: (value: string) => void
}

export function SelectField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    placeholder = "Select an option",
    options,
    className,
    required,
    icon,
    onChange,
    disabled,
    search,
    onSearch,
}: SelectFieldProps<TFieldValues, TName>) {
    const { formState } = useFormContext();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel className={ !label ? "flex justify-end items-end" : ""}>{icon && <span className="mr-2">{icon}</span>} {label}{required && <span className="flex justify-end text-destructive ml-1">*</span>}</FormLabel>
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            if (onChange) onChange(value);
                        }}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger className={cn("", formState.errors[name] ? "border-destructive border-b-2" : "")}>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {search && (
                                <div className={cn("p-2 sticky top-0 bg-background z-10 border-b", formState.errors[name] ? "border-destructive border-b-2" : "")}>
                                    <Input
                                        placeholder="Search..."
                                        className="h-8"
                                        onChange={(e) => {
                                            if (onSearch) onSearch(e.target.value);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                            {options.map((option, index) => {
                                const value = typeof option === "string" ? option : option.value
                                const label = typeof option === "string" ? option : option.label
                                return (
                                    <SelectItem key={index} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

// Textarea Field
interface TextareaFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
    placeholder?: string
    rows?: number
}

export function TextareaField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    placeholder,
    rows = 3,
    className,
    required,
    icon,
    disabled,
}: TextareaFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel className={ !label ? "flex justify-end items-end" : ""}>{icon && <span className="mr-2">{icon}</span>} {label}{required && <span className="flex justify-end text-destructive ml-1">*</span>}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            rows={rows}
                            disabled={disabled}
                            {...field}
                            value={field.value ?? ""}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

// Date Field
interface DateFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
    placeholder?: string
    dateFormat?: string
    minDate?: Date
    maxDate?: Date
}

export function DateField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ 
    control,
    name,
    label,
    description,
    placeholder = "Select date",
    dateFormat = "yyyy-MM-dd",
    className,
    required,
    icon,
    minDate,
    maxDate,
    disabled,
}: DateFieldProps<TFieldValues, TName>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { formState } = useFormContext();

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Helper function to format date for display
    const formatDateForDisplay = (value: string | Date) => {
        if (!value) return "";
        const date = typeof value === 'string' ? new Date(value) : value;
        return format(date, dateFormat);
    };

    // Helper function to format date as yyyy-mm-dd string
    const formatDateToISO = (date: Date) => {
        return format(date, "yyyy-MM-dd");
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn(className, "mt-1")}>
                    <FormLabel className={ !label ? "flex justify-end items-end" : ""}>
                        {icon && <span className="mr-2">{icon}</span>} {label}
                        {required && <span className="flex justify-end text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <div className="relative mt-[17.5px]" ref={containerRef}>
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!disabled) {
                                        setIsOpen(!isOpen);
                                    }
                                }}
                                className={cn(
                                    "w-full justify-start text-left font-normal rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-primary cursor-pointer flex items-center",
                                    !field.value && "text-muted-foreground",
                                    disabled && "cursor-not-allowed opacity-50",
                                    formState.errors[name as string] 
                                        ? "border-b-1 border-destructive focus-visible:border-destructive" 
                                        : "border-b-1 border-input focus-visible:border-primary"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? formatDateForDisplay(field.value) : <span>{placeholder}</span>}
                            </button>
                            {isOpen && (
                                <div className="absolute top-full left-0 z-50 mt-1">
                                    <div 
                                        className="w-auto p-0 bg-white border border-gray-200 rounded-md shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date: Date | undefined) => {
                                                if (!date) {
                                                    field.onChange(null);
                                                    setIsOpen(false);
                                                    return;
                                                }
                                                let selectedDate: Date;
                                                
                                                if (minDate && date < minDate) {
                                                    selectedDate = minDate;
                                                } else if (maxDate && date > maxDate) {
                                                    selectedDate = maxDate;
                                                } else {
                                                    selectedDate = date;
                                                }
                                                
                                                // Convert date to ISO format with time
                                                field.onChange(formatDateToISO(selectedDate));
                                                setIsOpen(false);
                                            }}
                                            disabled={(date: Date) => (minDate ? date < minDate : false) || (maxDate ? date > maxDate : false)}
                                            initialFocus
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

// DateTime Field
interface DateTimeFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
    placeholder?: string
    dateFormat?: string
    minDate?: Date
    maxDate?: Date
    includeSeconds?: boolean
}

export function DateTimeField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ 
    control,
    name,
    label,
    description,
    placeholder = "date and time",
    dateFormat = "yyyy-MM-dd HH:mm",
    className,
    required,
    icon,
    minDate,
    maxDate,
    includeSeconds = false,
    disabled,
}: DateTimeFieldProps<TFieldValues, TName>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { formState } = useFormContext();

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Helper function to format date for display
    const formatDateForDisplay = (value: string | Date) => {
        if (!value) return "";
        const date = typeof value === 'string' ? new Date(value) : value;
        return format(date, dateFormat);
    };

    // Helper function to format date as ISO string
    const formatDateToISO = (date: Date) => {
        return date.toISOString();
    };

    // Helper to get current time values
    const getTimeValues = (date: Date) => {
        return {
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            milliseconds: date.getMilliseconds()
        };
    };

    // Helper to set time on a date
    const setTimeOnDate = (date: Date, hours: number, minutes: number, seconds: number = 0, milliseconds: number = 0) => {
        const newDate = new Date(date);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        newDate.setSeconds(seconds);
        newDate.setMilliseconds(milliseconds);
        return newDate;
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                // Current date value
                const currentValue = field.value ? new Date(field.value) : undefined;
                // Current time values
                const timeValues = currentValue ? getTimeValues(currentValue) : { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
                
                return (
                    <FormItem className={cn(className, "mt-1")}>
                        <FormLabel className={ !label ? "flex justify-end items-end" : ""}>
                            {icon && <span className="mr-2">{icon}</span>} {label}
                            {required && <span className="flex justify-end text-destructive ml-1">*</span>}
                        </FormLabel>
                        <FormControl>
                            <div className="relative mt-[17.5px]" ref={containerRef}>
                                <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!disabled) {
                                            setIsOpen(!isOpen);
                                        }
                                    }}
                                    className={cn(
                                        "w-full justify-start text-left font-normal rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-primary cursor-pointer flex items-center",
                                        !field.value && "text-muted-foreground",
                                        disabled && "cursor-not-allowed opacity-50",
                                        formState.errors[name as string] 
                                            ? "border-b-1 border-destructive focus-visible:border-destructive" 
                                            : "border-b-1 border-input focus-visible:border-primary"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? formatDateForDisplay(field.value) : <span>{placeholder}</span>}
                                </button>
                                {isOpen && (
                                    <div className="absolute top-full left-0 z-50 mt-1 min-w-[300px]">
                                        <div 
                                            className="w-full p-0 bg-white border border-gray-200 rounded-md shadow-lg overflow-visible"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={currentValue}
                                                    onSelect={(date: Date | undefined) => {
                                                        if (!date) {
                                                            field.onChange(null);
                                                            return;
                                                        }
                                                        
                                                        let selectedDate: Date;
                                                        
                                                        if (minDate && date < minDate) {
                                                            selectedDate = minDate;
                                                        } else if (maxDate && date > maxDate) {
                                                            selectedDate = maxDate;
                                                        } else {
                                                            selectedDate = date;
                                                        }
                                                        
                                                        // Preserve the time from the current value if it exists
                                                        if (currentValue) {
                                                            selectedDate = setTimeOnDate(
                                                                selectedDate,
                                                                timeValues.hours,
                                                                timeValues.minutes,
                                                                timeValues.seconds,
                                                                timeValues.milliseconds
                                                            );
                                                        }
                                                        
                                                        field.onChange(formatDateToISO(selectedDate));
                                                    }}
                                                    disabled={(date: Date) => (minDate ? date < minDate : false) || (maxDate ? date > maxDate : false)}
                                                    initialFocus
                                                />
                                                <div className="border-t border-border p-3">
                                                    <div className="flex items-end justify-between space-x-2">
                                                        <div className="grid gap-1">
                                                            <div className="text-sm font-medium">Time</div>
                                                            <div className="flex items-center space-x-2">
                                                                {/* Hours */}
                                                                <Select
                                                                    value={String(timeValues.hours)}
                                                                    onValueChange={(value) => {
                                                                        const baseDate = currentValue || new Date();
                                                                        const newDate = setTimeOnDate(
                                                                            baseDate,
                                                                            parseInt(value),
                                                                            timeValues.minutes,
                                                                            timeValues.seconds,
                                                                            timeValues.milliseconds
                                                                        );
                                                                        field.onChange(formatDateToISO(newDate));
                                                                    }}
                                                                >
                                                                    <SelectTrigger 
                                                                        className="w-16"
                                                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking select
                                                                    >
                                                                        <SelectValue placeholder="Hour" />
                                                                    </SelectTrigger>
                                                                    <SelectContent 
                                                                        className="z-[60]"
                                                                        onPointerDown={(e) => e.stopPropagation()} // Prevent closing when interacting with dropdown
                                                                        onMouseDown={(e) => e.stopPropagation()} // Prevent closing when interacting with dropdown
                                                                    >
                                                                        {Array.from({ length: 24 }, (_, i) => (
                                                                            <SelectItem key={i} value={String(i)}>
                                                                                {String(i).padStart(2, '0')}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span>:</span>
                                                                {/* Minutes */}
                                                                <Select
                                                                    value={String(timeValues.minutes)}
                                                                    onValueChange={(value) => {
                                                                        const baseDate = currentValue || new Date();
                                                                        const newDate = setTimeOnDate(
                                                                            baseDate,
                                                                            timeValues.hours,
                                                                            parseInt(value),
                                                                            timeValues.seconds,
                                                                            timeValues.milliseconds
                                                                        );
                                                                        field.onChange(formatDateToISO(newDate));
                                                                    }}
                                                                >
                                                                    <SelectTrigger 
                                                                        className="w-16"
                                                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking select
                                                                    >
                                                                        <SelectValue placeholder="Min" />
                                                                    </SelectTrigger>
                                                                    <SelectContent
                                                                        onPointerDown={(e) => e.stopPropagation()} // Prevent closing when interacting with dropdown
                                                                        onMouseDown={(e) => e.stopPropagation()} // Prevent closing when interacting with dropdown
                                                                    >
                                                                        {Array.from({ length: 60 }, (_, i) => (
                                                                            <SelectItem key={i} value={String(i)}>
                                                                                {String(i).padStart(2, '0')}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                {includeSeconds && (
                                                                    <>
                                                                        <span>:</span>
                                                                        {/* Seconds */}
                                                                        <Select
                                                                            value={String(timeValues.seconds)}
                                                                            onValueChange={(value) => {
                                                                                const baseDate = currentValue || new Date();
                                                                                const newDate = setTimeOnDate(
                                                                                    baseDate,
                                                                                    timeValues.hours,
                                                                                    timeValues.minutes,
                                                                                    parseInt(value),
                                                                                    timeValues.milliseconds
                                                                                );
                                                                                field.onChange(formatDateToISO(newDate));
                                                                            }}
                                                                        >
                                                                            <SelectTrigger 
                                                                                className="w-16"
                                                                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking select
                                                                            >
                                                                                <SelectValue placeholder="Sec" />
                                                                            </SelectTrigger>
                                                                            <SelectContent
                                                                                onPointerDown={(e) => e.stopPropagation()} // Prevent closing when interacting with dropdown
                                                                                onMouseDown={(e) => e.stopPropagation()} // Prevent closing when interacting with dropdown
                                                                            >
                                                                                {Array.from({ length: 60 }, (_, i) => (
                                                                                    <SelectItem key={i} value={String(i)}>
                                                                                        {String(i).padStart(2, '0')}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            className=" rounded-full shadow-sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent closing when clicking "Now" button
                                                                const now = new Date();
                                                                let selectedDate = currentValue || now;
                                                                
                                                                selectedDate = setTimeOnDate(
                                                                    selectedDate,
                                                                    now.getHours(),
                                                                    now.getMinutes(),
                                                                    now.getSeconds(),
                                                                    now.getMilliseconds()
                                                                );
                                                                
                                                                field.onChange(formatDateToISO(selectedDate));
                                                            }}
                                                        >
                                                            Now
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FormControl>
                        {description && <FormDescription>{description}</FormDescription>}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}


// Checkbox Field
interface CheckboxFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
    checkboxLabel?: ReactNode
    disabled?: boolean
}

export function CheckboxField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    checkboxLabel,
    className,
    required,
    icon,
    disabled,
}: CheckboxFieldProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex flex-col space-y-2 w-full", className)}>
                    <div className="flex items-start space-x-3">
                        <div className="flex items-center h-5">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={disabled}
                                    className="h-4 w-4"
                                />
                            </FormControl>
                        </div>
                        <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                                {checkboxLabel || label}
                                {required && <span className="text-destructive ml-1">*</span>}
                            </FormLabel>
                            {description && <FormDescription className="text-xs">{description}</FormDescription>}
                            <FormMessage className="text-xs font-normal" />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    )
}


// Form Section
interface FormSectionProps {
    title?: string
    description?: string
    children: ReactNode
    className?: string
}

export function FormSection({
    title,
    description,
    children,
    className = "",
}: FormSectionProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {(title || description) && (
                <div className="space-y-1">
                    {title && <h3 className="text-lg font-medium">{title}</h3>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {children}
            </div>
        </div>
    )
}

// Type for FormFieldProps
type FormFieldProps<T extends FieldValues> = Omit<ControllerProps<T>, "render"> & {
    name: FieldPath<T>;
};

// Email List Field
interface EmailListFieldProps<T extends FieldValues> extends FormFieldProps<T> {
    label?: string
    placeholder?: string
    addButtonText?: string
    icon?: React.ReactNode
    required?: boolean
    disabled?: boolean
}

export function EmailListField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = "Enter email address",
    addButtonText = "Add Email",
    icon,
    required,
    disabled,
    ...props
}: EmailListFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            {...props}
            render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>
                        {icon && <span className="mr-2">{icon}</span>} {label}
                        {required && <span className="flex justify-end text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <div className="flex flex-col space-y-2">
                            {field.value && Array.isArray(field.value) && field.value.map((email: string, index: number) => {
                                const fieldError = fieldState.error?.message || (fieldState.error as any)?.[index]?.message;
                                const hasError = fieldError && (Array.isArray(fieldState.error) ? fieldState.error[index] : false);
                                
                                return (
                                    <div key={index} className="flex flex-col space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    const newEmails = [...field.value];
                                                    newEmails[index] = e.target.value;
                                                    field.onChange(newEmails);
                                                }}
                                                className={`flex-1 ${hasError ? 'border-destructive' : ''}`}
                                                placeholder={placeholder}
                                                disabled={disabled}
                                            />
                                            <Button
                                                type="button"
                                                disabled={disabled}
                                                size="icon"
                                                onClick={() => {
                                                    const newEmails = field.value.filter((_: string, i: number) => i !== index);
                                                    field.onChange(newEmails);
                                                }}
                                                className="h-10 w-10"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </Button>
                                        </div>
                                        {hasError && (
                                            <p className="text-sm text-destructive">
                                                {(fieldState.error as any)?.[index]?.message}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                            <Button
                                type="button"
                                disabled={disabled}
                                className="w-full"
                                onClick={() => field.onChange([...field.value, ""])}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                {addButtonText}
                            </Button>
                        </div>
                    </FormControl>
                    {fieldState.error?.message && <FormMessage />}
                </FormItem>
            )}
        />
    )
}

// Multi Select Field
interface MultiSelectFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
    placeholder?: string
    options: { label: string; value: string }[] | string[]
    disabled?: boolean
}

export function MultiSelectField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    placeholder = "Select options",
    options,
    className,
    required,
    icon,
    disabled,
}: MultiSelectFieldProps<TFieldValues, TName>) {
    // Transform string[] options to { label, value } format if needed
    const formattedOptions = options.map((option) => {
        if (typeof option === "string") {
            return { label: option, value: option }
        }
        return option
    })

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel className={!label ? "flex justify-end items-end" : ""}>
                        {icon && <span className="mr-2">{icon}</span>} {label}
                        {required && <span className="flex justify-end text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <div className="border rounded-md p-2 min-h-[2.5rem] bg-background">
                            <div className="flex flex-wrap gap-2">
                                {formattedOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`px-3 py-1 rounded-full cursor-pointer text-sm ${
                                            field.value?.includes(option.value)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground'
                                        }`}
                                        onClick={() => {
                                            if (disabled) return;
                                            
                                            const currentValues = field.value as string[] || [];
                                            const newValues = currentValues.includes(option.value)
                                                ? currentValues.filter((v) => v !== option.value)
                                                : [...currentValues, option.value];
                                            field.onChange(newValues);
                                        }}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                                {(!field.value || field.value.length === 0) && (
                                    <span className="text-muted-foreground text-sm px-1">
                                        {placeholder}
                                    </span>
                                )}
                            </div>
                        </div>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

// Phone List Field using Shadcn PhoneInput
interface PhoneListFieldProps<T extends FieldValues> extends FormFieldProps<T> {
    label?: string
    placeholder?: string
    addButtonText?: string
    icon?: React.ReactNode
    required?: boolean
    disabled?: boolean
}

export function PhoneListField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = "Enter phone number",
    addButtonText = "Add Phone",
    icon,
    required,
    disabled,
    ...props
}: PhoneListFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            {...props}
            render={({ field, fieldState }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>
                        {icon && <span className="mr-2">{icon}</span>} {label}
                        {required && <span className="flex justify-end text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <div className="flex flex-col space-y-3">
                            {field.value && Array.isArray(field.value) && field.value.map((phone: string, index: number) => {
                                const fieldError = fieldState.error?.message || (fieldState.error as any)?.[index]?.message;
                                const hasError = fieldError && (Array.isArray(fieldState.error) ? fieldState.error[index] : false);
                                
                                return (
                                    <div key={index} className="flex flex-col space-y-2">
                                        <div className="flex items-center space-x-2">
                                            {/* PhoneInput Component */}
                                            <PhoneInput
                                                value={phone}
                                                onChange={(value) => {
                                                    const newPhones = [...field.value];
                                                    newPhones[index] = value || "";
                                                    field.onChange(newPhones);
                                                }}
                                                defaultCountry="IN"
                                                placeholder={placeholder}
                                                disabled={disabled}
                                                className={`flex-1 ${hasError ? 'border-destructive' : ''}`}
                                            />
                                            
                                            {/* Remove Button */}
                                            <Button
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => {
                                                    const newPhones = field.value.filter((_: string, i: number) => i !== index);
                                                    field.onChange(newPhones);
                                                }}
                                                className="h-10 w-10"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        {/* Error Message */}
                                        {hasError && (
                                            <p className="text-sm text-destructive">
                                                {(fieldState.error as any)?.[index]?.message}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {/* Add Phone Button */}
                            <Button
                                type="button"
                                disabled={disabled}
                                className="w-full border-dashed"
                                onClick={() => {
                                    field.onChange([...field.value, ""]);
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {addButtonText}
                            </Button>
                        </div>
                    </FormControl>
                    {fieldState.error?.message && <FormMessage />}
                </FormItem>
            )}
        />
    )
}
