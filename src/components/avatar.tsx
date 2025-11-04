import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
  return (
    <div className={`relative w-10 h-10 rounded-full overflow-hidden ${className || ""}`}>
      {src ? (
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
          {fallback || "?"}
        </div>
      )}
    </div>
  );
}

export function AvatarImage({ src, alt }: { src: string; alt?: string }) {
  return <img src={src} alt={alt} className="object-cover w-full h-full" />;
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
      {children}
    </div>
  );
}
