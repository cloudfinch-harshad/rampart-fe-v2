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

// Helper function to format file sizes
const formatBytes = (bytes: number, decimals = 2): string => {
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
    grid?: boolean
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
    key: string;
    url?: string;
    size?: number;
    type?: string;
}

interface UploadResult extends UploadedFile {
    bucketUrl: string;
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
    grid=true,
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

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        const inputFiles = e.target.files;
        if (!inputFiles || inputFiles.length === 0) return;

        const fileArray = Array.from(inputFiles);
        
        // Check file sizes
        const maxSizeBytes = (maxSizeMB || 10) * 1024 * 1024;
        const oversizedFiles = fileArray.filter(file => file.size > maxSizeBytes);
        
        if (oversizedFiles.length > 0) {
            toast.error(`Some files exceed the ${maxSizeMB}MB limit.`);
            e.target.value = '';
            return;
        }

        try {
            setIsUploading(true);
            // Just upload the files, the state will be updated in uploadFileToS3
            await Promise.all(fileArray.map(file => uploadFileToS3(file)));
        } catch (error) {
            console.error('Error handling file upload:', error);
            toast.error('Failed to process files. Please try again.');
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset input to allow selecting the same file again
        }
    }, [maxSizeMB, multiple, name, setValue, control]);

    // API mutations
    const { mutateAsync: getPresignedUrl } = useApiMutation<{ message: string; success: boolean }>({
        url: "/api/v1/s3/upload-url",
        method: "POST"
    });

    const { mutateAsync: getDownloadUrl } = useApiMutation<{ message: string; success: boolean }>({
        url: "/api/v1/s3/download-url",
        method: "POST"
    });

    const { mutateAsync: deleteFile } = useApiMutation<{ success: boolean }>({
        url: "/api/v1/s3/delete",
        method: "POST"
    });

    const uploadFileToS3 = async (file: File): Promise<UploadedFile> => {
        setIsUploading(true);
        setUploadProgress(0);
        
        try {
            const fileKey = `temp/${Date.now()}-${uuid()}`;
            
            // 1. First, get the presigned URL from our API
            const response = await getPresignedUrl({
                key: fileKey
            });
            
            const { message, success } = response;
            
            if (!success) {
                throw new Error(message);
            }
            
            // 2. Upload the file directly to S3 using the presigned URL
            const xhr = new XMLHttpRequest();
            
            return new Promise((resolve, reject) => {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(percentComplete);
                    }
                };
                
                xhr.onload = async () => {
                    if (xhr.status === 200) {
                        // The file was uploaded successfully
                        const bucketUrl = message.split('?')[0]; // Remove query parameters from URL
                        const uploadedFile: UploadedFile = {
                            fileName: file.name,
                            key: fileKey,
                            url: bucketUrl,
                            size: file.size,
                            type: file.type
                        };
                        
                        // Update form value with the new files
                        const currentValue = watch(name) as UploadedFile[] || [];
                        const newValue = multiple 
                            ? [...currentValue, uploadedFile]
                            : [uploadedFile]; // Keep only the last file if not multiple
                            
                        setValue(name as Path<TFieldValues>, newValue as FieldPathValue<TFieldValues, TName>, { 
                            shouldValidate: true 
                        });
                        
                        resolve(uploadedFile);
                    } else {
                        reject(new Error('File upload failed'));
                    }
                    setIsUploading(false);
                };
                
                xhr.onerror = () => {
                    reject(new Error('File upload failed'));
                    setIsUploading(false);
                };
                
                xhr.open('PUT', message);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            });
            
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            toast.error('Failed to upload file. Please try again.');
            throw error;
        } finally {
            if (uploadProgress !== 100) {
                // Only reset progress if not already completed
                setTimeout(() => setUploadProgress(0), 1000);
            }
        }
    };
    
    const handleDownload = useCallback(async (file: UploadedFile) => {
        try {
            const response = await getDownloadUrl({
                fileName: file.fileName,
                key: file.key
            });
            
            if (response.success && response.message) {
                // Create a temporary anchor element to trigger the download
                const link = document.createElement('a');
                link.href = response.message;
                link.setAttribute('download', file.fileName);
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              
            } else {
                throw new Error('Failed to get download URL');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download file. Please try again.');
        }
    }, [getDownloadUrl]);
    
    const handleDelete = useCallback(async (fileToDelete: UploadedFile, index: number) => {
        if (!window.confirm('Are you sure you want to delete this file?')) {
            return;
        }
        
        try {
            await deleteFile({
                key: fileToDelete.key
            });
            
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
    }, [control, deleteFile, name, setValue, watch]);
    
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
                                    "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl transition-all duration-200",
                                    "bg-background",
                                    !disabled && "hover:bg-muted/50 cursor-pointer",
                                    disabled && "opacity-60 cursor-not-allowed",
                                    isDragOver ? "border-primary bg-primary/5" : "border-border",
                                    isUploading && "animate-pulse"
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={() => setIsDragOver(false)}
                            >
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="p-3 rounded-full bg-primary/10 mb-3">
                                        <UploadCloud className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground mb-1">
                                        Drag & drop files or click to browse
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {helpText} • Max {maxSizeMB}MB
                                    </p>
                                    
                                    {isUploading && (
                                        <div className="w-full mt-4 space-y-2">
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div 
                                                    className={cn(
                                                        "h-full transition-all duration-300 ease-in-out",
                                                        uploadProgress === 100 ? "bg-green-500" : "bg-primary"
                                                    )} 
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
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
                                <div className={cn("gap-4", grid && "grid grid-cols-1 md:grid-cols-2")}>
                                    {files.map((file, index) => (
                                        <FilePreviewItem
                                            key={`${file.key || index}-${index}`}
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
                    formatBytes(Number(file.size)) : 
                    '';
    
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                    {getFileIcon(fileName)}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
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
                        "text-gray-500 transition-colors p-1",
                    )}
                    title="Download"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className={cn(
                        "text-gray-500 transition-colors p-1",
                        !disabled && "hover:text-red-600",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    title="Delete"
                    disabled={disabled}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
