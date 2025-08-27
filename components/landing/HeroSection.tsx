import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { BookOpen, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="px-4 py-10 sm:px-12 sm:py-14 lg:py-20">
      <div className="container mx-auto max-w-6xl text-center">
        {/* Logo */}
        <div className="relative mx-auto mb-8 h-24 w-24 sm:h-32 sm:w-32">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 blur-xl"></div>
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/chai.webp"
              width={128}
              height={128}
              alt="ChaiCourseGPT - Your AI Coding Instructor"
              className="object-cover"
            />
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-12 space-y-8">
          <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            <div className="mb-2">Namaste! Welcome to</div>
            <div className="-mt-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent md:-mt-8">
              ChaiCourseGPT
            </div>
          </h1>

          {/* Description */}
          <div className="mx-auto max-w-4xl">
            <p className="text-lg leading-relaxed text-gray-300 sm:text-xl md:text-2xl">
              <span className="font-semibold text-orange-400">
                Seedhi si baat hai
              </span>{" "}
              - Your AI coding instructor powered by Hitesh Choudhary&apos;s
              teaching style.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl">
              Learn faster, code better, and get instant help with your course
              content.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/chat">
            <Button
              size="lg"
              className="min-w-[200px] cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg hover:from-orange-600 hover:to-orange-700"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Learning Now
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="min-w-[200px] cursor-pointer border-gray-600 px-8 py-4 text-lg text-gray-300 hover:bg-gray-800"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-400">24/7</div>
            <div className="text-gray-400">Available</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-400">1000+</div>
            <div className="text-gray-400">Topics Covered</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-400">
              Instant
            </div>
            <div className="text-gray-400">Responses</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-400">Smart</div>
            <div className="text-gray-400">AI Assistant</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
