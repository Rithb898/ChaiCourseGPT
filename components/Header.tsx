import React from "react";
import CourseFilter from "./CourseFilter";
import Link from "next/link";
import Image from "next/image";
import { CourseType } from "@/app/chat/page";

const Header = ({
  selectedCourse,
  setSelectedCourse,
}: {
  selectedCourse: CourseType;
  setSelectedCourse: (course: CourseType) => void;
}) => {
  return (
    <header
      className="border-b border-gray-800 px-4 py-3 shadow-xl backdrop-blur-sm sm:px-12 sm:py-4"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #1f1f1f 100%)",
        borderImage:
          "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.3), transparent) 1",
      }}
      role="banner"
      aria-label="Application header"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative">
          <Link href="/">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-lg sm:h-12 sm:w-12">
              <Image
                src="/chai.webp"
                width={48}
                height={48}
                alt="ChaiCourseGPT logo"
                className="object-cover transition-transform duration-200 hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </Link>
          <div
            className="absolute -right-1 -bottom-1 h-3 w-3 animate-pulse rounded-full border-2 border-gray-900 bg-green-500 sm:h-4 sm:w-4"
            aria-hidden="true"
            title="Online status indicator"
          ></div>
        </div>

        <div className="min-w-0 flex-1">
          <h1
            className="truncate text-lg font-bold tracking-tight text-white sm:text-2xl"
            id="app-title"
          >
            ChaiCourseGPT
            <span
              className="ml-2 hidden text-sm font-normal text-orange-400 sm:inline"
              aria-label="Version 1.0"
            >
              v1.0
            </span>
          </h1>

          <p
            className="truncate text-xs font-medium text-gray-400 sm:text-sm"
            aria-describedby="app-title"
          >
            <span className="hidden sm:inline">
              Your AI coding course assistant •{" "}
            </span>
            <span className="text-orange-400">Powered by Hitesh Choudhary</span>
          </p>
        </div>

        {/* Course Filter - Desktop */}
        <div className="hidden lg:block">
          <CourseFilter
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
          />
        </div>

        {/* Course Filter - Mobile */}
        <div className="mt-3 lg:hidden">
          <CourseFilter
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
