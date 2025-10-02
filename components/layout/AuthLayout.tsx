"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export default function AuthLayout({
  children,
  title,
  description,
  image,
  imageAlt,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
        </div>
        <div className="relative z-10 w-full flex flex-col justify-end p-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground max-w-[40ch]">{description}</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-[360px]">{children}</div>
      </div>
    </div>
  );
}
