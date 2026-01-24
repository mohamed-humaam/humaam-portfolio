"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
}

export function MultiImageUpload({ 
  value, 
  onChange, 
  label = "Images",
  max = 10 
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > max) {
      toast({
        title: "Too many images",
        description: `Maximum ${max} images allowed`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        newUrls.push(data.url);
      }

      onChange([...value, ...newUrls]);
      toast({ title: "Uploaded", description: `${newUrls.length} image(s) uploaded` });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleUrlSubmit() {
    if (urlInput.trim()) {
      if (value.length >= max) {
        toast({
          title: "Too many images",
          description: `Maximum ${max} images allowed`,
          variant: "destructive",
        });
        return;
      }
      onChange([...value, urlInput.trim()]);
      setUrlInput("");
      setShowUrlInput(false);
    }
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const newValue = [...value];
    const [removed] = newValue.splice(from, 1);
    newValue.splice(to, 0, removed);
    onChange(newValue);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">{value.length}/{max}</span>
      </div>

      {/* Existing images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </div>
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveImage(index, index - 1)}
                  >
                    ←
                  </Button>
                )}
                {index < value.length - 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveImage(index, index + 1)}
                  >
                    →
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {value.length < max && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
            multiple
          />
          
          {isUploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
              <span className="text-xs text-muted-foreground">or</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                Add URL
              </Button>
            </div>
          )}
        </div>
      )}

      {showUrlInput && value.length < max && (
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlSubmit())}
          />
          <Button type="button" onClick={handleUrlSubmit}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
