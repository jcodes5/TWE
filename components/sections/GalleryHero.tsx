"use client";

import { motion } from "framer-motion";
import { Camera, ImageDown, Users, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function GalleryHero() {
  const stats = [
    {
      icon: Camera,
      label: "Total Photos",
      value: "2.4K+",
    },
    {
      icon: Users,
      label: "Contributors",
      value: "500+",
    },
    {
      icon: Eye,
      label: "Monthly Views",
      value: "10K+",
    },
  ];

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-green-dark/20 rounded-full blur-2xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ top: "60%", right: "20%" }}
        />
      </div>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-36 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight lg:leading-tight"
              >
                Capturing Our Journey to{" "}
                <span className="text-primary">Environmental Change</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-muted-foreground max-w-xl"
              >
                Explore our visual story through a collection of impactful
                moments, showcasing the dedication of our community and the
                beauty of environmental conservation.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" asChild>
                <Link href="#gallery">
                  Explore Gallery <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/campaigns">
                  Contribute <ImageDown className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
            >
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="p-4 backdrop-blur-sm bg-background/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-xl">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Gallery Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl hidden lg:block"
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
              <div className="relative rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              </div>
              <div className="relative rounded-lg overflow-hidden row-span-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-dark/20" />
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
