import GalleryHero from "@/components/sections/GalleryHero";
import GallerySectionClient, { GalleryImageItem } from "@/components/sections/GallerySectionClient";
import { prisma } from "@/lib/database";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" }, take: 24 });
  const mapped: GalleryImageItem[] = images.map(i => ({ id: i.id, url: i.url, title: i.title, category: i.category, takenAt: i.takenAt?.toISOString() || null, location: i.location }));
  return (
    <main className="min-h-screen">
      <GalleryHero />
      <GallerySectionClient images={mapped} />
    </main>
  );
}
