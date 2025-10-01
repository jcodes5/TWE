"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Heart, Eye, Calendar, MapPin } from "lucide-react";

// Define image data with paths to existing images in the public directory
const galleryImages = [
  {
    id: 1,
    src: "/Wesley.jpg",
    alt: "Community Event 1",
    title: "Community Gathering",
    category: "Events",
    date: "2023-06-15",
    location: "Lagos, Nigeria",
  },
  {
    id: 2,
    src: "/Bukola .jpg",
    alt: "Climate Workshop",
    title: "Climate Science Workshop",
    category: "Education",
    date: "2023-08-22",
    location: "Online",
  },
  {
    id: 3,
    src: "/Eyitayo.png",
    alt: "Team Meeting",
    title: "Team Strategy Meeting",
    category: "Team",
    date: "2024-01-10",
    location: "Abuja, Nigeria",
  },
  {
    id: 4,
    src: "/Moyin.jpg",
    alt: "Campaign Activity",
    title: "Environmental Campaign",
    category: "Campaigns",
    date: "2024-03-05",
    location: "Ibadan, Nigeria",
  },
  {
    id: 5,
    src: "/logo.png",
    alt: "TW&E Logo",
    title: "Our Logo",
    category: "Branding",
    date: "2020-11-12",
    location: "Global",
  },
  {
    id: 6,
    src: "/placeholder.jpg",
    alt: "Placeholder Image",
    title: "Nature Scene",
    category: "Nature",
    date: "2023-12-01",
    location: "Amazon Rainforest",
  },
  {
    id: 7,
    src: "/placeholder-user.jpg",
    alt: "Volunteer Activity",
    title: "Volunteer Training",
    category: "Events",
    date: "2024-02-18",
    location: "Kano, Nigeria",
  },
  {
    id: 8,
    src: "/placeholder-logo.png",
    alt: "Project Launch",
    title: "New Project Launch",
    category: "Campaigns",
    date: "2024-04-30",
    location: "Port Harcourt, Nigeria",
  },
];

const categories = ["All", "Events", "Education", "Team", "Campaigns", "Branding", "Nature"];

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter images based on selected category
  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  // Open lightbox with selected image
  const openLightbox = useCallback((imageId: number) => {
    const index = filteredImages.findIndex(img => img.id === imageId);
    setCurrentIndex(index);
    setSelectedImage(imageId);
    document.body.style.overflow = "hidden";
  }, [filteredImages]);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  }, []);

  // Navigate to next image in lightbox
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredImages.length);
  }, [filteredImages.length]);

  // Navigate to previous image in lightbox
  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? filteredImages.length - 1 : prevIndex - 1
    );
  }, [filteredImages.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, nextImage, prevImage, closeLightbox]);

  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle swipe gestures for mobile
  useEffect(() => {
    if (!selectedImage) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        nextImage();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        prevImage();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [selectedImage, nextImage, prevImage]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0c1e20] dark:to-[#0f172a] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-green-light/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-teal/10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-green-light to-teal text-white shadow-xl"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer bg-white dark:bg-gray-800"
                  onClick={() => openLightbox(image.id)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-4">
                        <motion.div 
                          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Eye className="w-5 h-5" />
                          <span className="font-medium">View</span>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-green-light/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                        {image.category}
                      </span>
                    </div>
                    
                    {/* Image info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-bold text-lg truncate">{image.title}</h3>
                      <div className="flex items-center text-sm text-gray-200 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{image.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card footer */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{image.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{image.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">📷</div>
              <p className="text-gray-500 dark:text-gray-400 text-xl">
                No images found in this category.
              </p>
              <button 
                onClick={() => setSelectedCategory("All")}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-green-light to-teal text-white rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                View All Images
              </button>
            </div>
          </motion.div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              {/* Close button */}
              <motion.button 
                className="absolute top-6 right-6 text-white hover:text-gray-300 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={closeLightbox}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-8 h-8" />
              </motion.button>
              
              {/* Navigation buttons */}
              <motion.button 
                className="absolute left-6 text-white hover:text-gray-300 z-10 p-3 rounded-full hover:bg-white/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={filteredImages.length <= 1}
              >
                <ChevronLeft className="w-8 h-8" />
              </motion.button>
              
              <motion.button 
                className="absolute right-6 text-white hover:text-gray-300 z-10 p-3 rounded-full hover:bg-white/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={filteredImages.length <= 1}
              >
                <ChevronRight className="w-8 h-8" />
              </motion.button>
              
              {/* Image container */}
              <motion.div 
                className="relative max-w-6xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                key={filteredImages[currentIndex].id}
              >
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={filteredImages[currentIndex].src}
                    alt={filteredImages[currentIndex].alt}
                    fill
                    className="object-contain"
                  />
                </div>
                
                {/* Image details */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/50 p-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{filteredImages[currentIndex].title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{filteredImages[currentIndex].location}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{filteredImages[currentIndex].date}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <span className="px-2 py-1 bg-green-light/20 rounded-full text-sm">
                            {filteredImages[currentIndex].category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                      <motion.button 
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Like</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}