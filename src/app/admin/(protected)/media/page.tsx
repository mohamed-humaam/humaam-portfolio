import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Media Library</h2>
        <p className="text-muted-foreground">Manage uploaded images and files</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Media Upload Coming Soon</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            For MVP, you can use external image URLs in your projects and blog posts. 
            Upload functionality to cloud storage (S3, R2, Cloudinary) will be added in a future update.
          </p>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Recommended image hosting:</p>
            <ul className="space-y-1">
              <li>• <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cloudinary</a> - Free tier available</li>
              <li>• <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Imgur</a> - Quick uploads</li>
              <li>• <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Unsplash</a> - Free stock photos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
