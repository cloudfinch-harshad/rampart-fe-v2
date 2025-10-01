"use client";

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { UploadCloud, FileText, FileImage, File, X, CheckCircle } from "lucide-react";
import { useState, useCallback, ChangeEvent } from "react";
import { 
    Control, 
    FieldValues, 
    FieldPath, 
    FieldPathValue, 
    useFormContext, 
    Path 
} from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useApiMutation } from "@/hooks/useApi";
import { v4 as uuid } from "uuid";

// Helper function to get appropriate icon based on file type
const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
        return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (fileType.startsWith('application/pdf')) {
        return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.startsWith('text/')) {
        return <FileText className="h-5 w-5 text-gray-500" />;
    } else if (fileType.startsWith('application/vnd.openxmlformats-officedocument') || 
              fileType.startsWith('application/vnd.ms-')) {
        return <FileText className="h-5 w-5 text-green-500" />;
    } else {
        return <File className="h-5 w-5 text-gray-500" />;
    }
};

// Helper function to format file sizes
const formatFileSize = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

interface FileUploaderFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    control: Control<TFieldValues>
    name: TName
    label?: string
    description?: string
    className?: string
    required?: boolean
    icon?: React.ReactNode
    acceptedFileTypes?: string
    maxSizeMB?: number
    helpText?: string
    multiple?: boolean
    disabled?: boolean
}

// Generic file-like interface that works in both browser and server environments
interface FileWithName {
    name: string;
    size?: number;
    type?: string;
    lastModified?: number;
    [key: string]: any;
}

export interface UploadedFile {
    fileName: string;
    file: File; // Store the actual file object
    size: number;
    type: string;
    // Add a timestamp to help with unique identification
    timestamp?: number;
}

// Simplified interface without S3 specific fields
export interface UploadResult {
    fileName: string;
}

export function FileUploaderField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    acceptedFileTypes = "image/*,application/pdf",
    maxSizeMB = 10,
    helpText = "PNG, JPG or PDF",
    multiple = false,
    className,
    required,
    icon,
    disabled = false,
}: FileUploaderFieldProps<TFieldValues, TName>) {

    const [isUploading, setIsUploading] = useState(false);
    const { setValue, watch } = useFormContext<TFieldValues>();
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    
    // Get the current files from form state
    const files = watch(name) as UploadedFile[] || [];

    const getFileIcon = useCallback((fileName: string) => {
        if (fileName.endsWith('.pdf')) return <FileText className="h-4 w-4 text-blue-500" />;
        if (fileName.match(/\.(jpg|jpeg|png|gif|svg)$/i)) return <FileImage className="h-4 w-4 text-green-500" />;
        return <File className="h-4 w-4 text-gray-500" />;
    }, []);

    // Process file function - defined before it's used in handleFileChange
    const processFile = useCallback(async (file: File): Promise<UploadedFile> => {
        setIsUploading(true);
        setUploadProgress(0);
        
        try {
            // Simulate progress for better UX with smoother animation
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    // Create a more natural progress curve
                    const increment = Math.max(1, Math.floor((90 - prev) / 5));
                    return Math.min(prev + increment, 90);
                });
            }, 80);
            
            // Create the uploaded file object with timestamp
            const timestamp = Date.now();
            const uploadedFile: UploadedFile = {
                fileName: file.name,
                file: file, // Store the actual file object
                size: file.size,
                type: file.type,
                timestamp: timestamp
            };
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Complete the progress
            clearInterval(progressInterval);
            setUploadProgress(100);
            
            // Update form value with the new files
            const currentValue = watch(name) as UploadedFile[] || [];
            const newValue = multiple 
                ? [...currentValue, uploadedFile]
                : [uploadedFile]; // Keep only the last file if not multiple
                
            setValue(name as Path<TFieldValues>, newValue as FieldPathValue<TFieldValues, TName>, { 
                shouldValidate: true 
            });
            
            return uploadedFile;
            
        } catch (error) {
            console.error('Error processing file:', error);
            toast.error('Failed to process file. Please try again.');
            throw error;
        } finally {
            // Reset progress after a delay
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 1000);
        }
    }, [multiple, name, setValue, watch]);

    // Handle drag events
    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);
    
    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        const inputFiles = e.target.files;
        if (!inputFiles || inputFiles.length === 0) return;
        
        // Process each file
        try {
            const fileArray = Array.from(inputFiles);
            
            for (const file of fileArray) {
                // Check file size
                if (file.size > maxSizeMB * 1024 * 1024) {
                    toast.error(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB`, {
                        style: {
                            backgroundColor: '#FEE2E2',
                            border: '1px solid #F87171',
                            color: '#B91C1C'
                        }
                    });
                    continue;
                }
                
                await processFile(file);
            }
        } catch (error) {
            console.error('Error processing files:', error);
            toast.error('Failed to process files. Please try again.', {
                style: {
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #F87171',
                    color: '#B91C1C'
                }
            });
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset input to allow selecting the same file again
        }
    }, [maxSizeMB, processFile]);

    const handleDownload = useCallback((file: UploadedFile | FileWithName) => {
        if ('file' in file && file.file) {
            // Create a download link for the file
            const url = URL.createObjectURL(file.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.fileName || 'download';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if ('fileName' in file) {
            toast.info('File cannot be downloaded directly');
        }
    }, []);
    
    const handleDelete = useCallback((file: UploadedFile | FileWithName, index: number) => {
        try {
            // Get current files from form state
            const currentFiles = watch(name) as UploadedFile[] || [];
            // Filter out the deleted file
            const updatedFiles = currentFiles.filter((_, i) => i !== index);
            
            // Update form value with the filtered files
            setValue(name as Path<TFieldValues>, updatedFiles as FieldPathValue<TFieldValues, TName>, { 
                shouldValidate: true 
            });
            
            toast.success('File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Failed to delete file. Please try again.');
        }
    }, [name, setValue, watch]);
    
    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem className={className}>
                    {label && (
                        <FormLabel className="flex items-center gap-1">
                            {label}
                            {required && <span className="text-destructive">*</span>}
                        </FormLabel>
                    )}
                    
                    <FormControl>
                        <div className="space-y-2">
                            <label
                                htmlFor={`file-${name}`}
                                className={cn(
                                    "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl transition-all duration-300",
                                    "bg-background",
                                    !disabled && "hover:bg-muted/50 hover:border-primary/70 hover:shadow-sm cursor-pointer",
                                    disabled && "opacity-60 cursor-not-allowed",
                                    isDragOver ? "border-primary bg-primary/10 shadow-md scale-[1.01]" : "border-border",
                                    isUploading && "animate-pulse"
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={() => setIsDragOver(false)}
                            >
                                <div className="flex flex-col items-center justify-center text-center group-hover:scale-[1.02] transition-transform duration-300">
                                    <div className="p-3.5 rounded-full bg-primary/10 mb-3.5 group-hover:bg-primary/20 transition-colors duration-300 group-hover:shadow-sm">
                                        <UploadCloud className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground mb-1.5 group-hover:text-primary/80 transition-colors">
                                        Drag & drop files or click to browse
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {helpText} • Max {maxSizeMB}MB
                                    </p>
                                    
                                    {isUploading && (
                                        <div className="w-full mt-4 space-y-2">
                                            {files.map((file, index) => (
                                                <div key={index} className="relative flex items-center p-3 mt-2 bg-gray-50 rounded-md border border-gray-200 hover:border-primary/50 hover:bg-gray-100 transition-all duration-200 group">
                                                    <div className="flex items-center mr-3">
                                                        {getFileIcon(file.type)}
                                                    </div>
                                                    <div className="flex flex-col flex-grow">
                                                        <div className="flex items-center">
                                                            <span className="text-sm font-medium truncate group-hover:text-primary/80 transition-colors">{file.fileName}</span>
                                                            <span className="ml-2 text-xs text-gray-500">({formatFileSize(file.size)})</span>
                                                        </div>
                                                        <div className="w-full h-2.5 mt-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className={cn(
                                                                    "h-full rounded-full transition-all duration-300",
                                                                    uploadProgress < 100 ? "bg-primary animate-pulse" : "bg-green-500"
                                                                )}
                                                                style={{ width: `${uploadProgress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex items-center justify-center gap-2">
                                                {uploadProgress === 100 ? (
                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                ) : (
                                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    {uploadProgress === 100 ? "Upload complete" : `Uploading ${uploadProgress}%`}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <input
                                    type="file"
                                    id={`file-${String(name)}`}
                                    className="sr-only"
                                    accept={acceptedFileTypes}
                                    multiple={multiple}
                                    disabled={isUploading || disabled}
                                    onChange={handleFileChange}
                                    {...fieldProps as any}
                                />
                            </label>
                            
                            {/* File preview section */}
                            {Array.isArray(files) && files.length > 0 && !isUploading && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {files.map((file, index) => (
                                        <FilePreviewItem
                                            key={`file-${index}`}
                                            file={file}
                                            index={index}
                                            onRemove={() => handleDelete(file, index)}
                                            onDownload={() => handleDownload(file)}
                                            getFileIcon={getFileIcon}
                                            disabled={disabled}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </FormControl>
                    
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}


type FileType = { name: string } & Record<string, any>;

interface FilePreviewItemProps {
    file: UploadedFile | FileWithName | FileType;
    onRemove: () => void;
    onDownload: () => void;
    getFileIcon: (fileName: string) => JSX.Element;
    index: number;
    disabled?: boolean;
}

function FilePreviewItem({ 
    file, 
    onRemove, 
    onDownload, 
    getFileIcon, 
    index,
    disabled = false
}: FilePreviewItemProps) {
    const fileName = 'fileName' in file ? file.fileName : 
                     'name' in file ? String(file.name) : 
                     '';
    const fileSize = 'size' in file && file.size !== undefined ? 
                    formatFileSize(Number(file.size)) : 
                    '';
    
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 hover:border-primary/50 hover:bg-gray-100 transition-all duration-200 group">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0 transition-transform group-hover:scale-110 duration-200">
                    {getFileIcon(fileName)}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate group-hover:text-primary/80 transition-colors">
                        {fileName}
                    </div>
                    {fileSize && (
                        <div className="text-xs text-gray-500">
                            {fileSize}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-2 ml-2">
                <button
                    type="button"
                    onClick={onDownload}
                    className={cn(
                        "text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full p-1.5 transition-colors",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={disabled}
                    title="Download file"
                    aria-label="Download file"
                >
                    <FileText className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className={cn(
                        "text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1.5 transition-colors",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={disabled}
                    title="Remove file"
                    aria-label="Remove file"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
