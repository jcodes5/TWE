"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Eye, Calendar, MapPin } from "lucide-react"

export type GalleryImageItem = {
  id: string
  url: string
  title: string
  category?: string | null
  takenAt?: string | null
  location?: string | null
}

export default function GallerySectionClient({ images }: { images: GalleryImageItem[] }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = useCallback((idx: number) => {
    setCurrentIndex(idx)
    setSelectedImage(images[idx].id as unknown as number)
    document.body.style.overflow = "hidden"
  }, [images])

  const closeLightbox = useCallback(() => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }, [])

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  useEffect(() => {
    if (!selectedImage) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedImage, nextImage, prevImage, closeLightbox])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0c1e20] dark:to-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {images.map((img, idx) => (
              <motion.div key={img.id} className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer bg-white dark:bg-gray-800" onClick={() => openLightbox(idx)}>
                <div className="aspect-square relative overflow-hidden">
                  <Image src={img.url} alt={img.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-light/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                      {img.category || 'General'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{img.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {img.location && (<><MapPin className="w-3 h-3 mr-1" /><span className="truncate">{img.location}</span></>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <button className="absolute top-4 right-4 text-white" onClick={closeLightbox}><X className="w-6 h-6" /></button>
            <button className="absolute left-4 text-white" onClick={prevImage}><ChevronLeft className="w-8 h-8" /></button>
            <div className="relative w-[90vw] h-[70vh]">
              <Image src={images[currentIndex].url} alt={images[currentIndex].title} fill className="object-contain" />
            </div>
            <button className="absolute right-4 text-white" onClick={nextImage}><ChevronRight className="w-8 h-8" /></button>
          </div>
        )}
      </div>
    </section>
  )
}
