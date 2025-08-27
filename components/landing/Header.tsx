import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Header = ({
  headerRef,
  isScrolled,
}: {
  headerRef: React.RefObject<HTMLElement | null>;
  isScrolled: boolean;
}) => {
  return (
    <header
      ref={headerRef}
      className={`sticky-header ${isScrolled ? "scrolled" : ""} border-b border-gray-800 px-4 py-4 sm:px-6`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 flex-shrink-0 cursor-pointer items-center gap-3">
          <div className="logo-container relative">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-lg">
              <Image
                src="/chai.webp"
                width={40}
                height={40}
                alt="ChaiCourseGPT logo"
                className="object-cover"
              />
            </div>
            <div className="status-indicator absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-gray-900 bg-green-500"></div>
          </div>
          <div className="flex min-w-0 gap-1">
            <h1 className="cursor-pointer truncate text-lg font-bold text-white sm:text-xl">
              ChaiCourseGPT
            </h1>
            <p className="text-xs text-orange-400">v1.0</p>
          </div>
        </div>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          <a
            href="#features"
            className="nav-link whitespace-nowrap text-gray-300"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="nav-link whitespace-nowrap text-gray-300"
          >
            How it Works
          </a>
          <a
            href="#testimonials"
            className="nav-link whitespace-nowrap text-gray-300"
          >
            Reviews
          </a>
        </nav>

        <Link href="/chat" className="flex-shrink-0">
          <Button className="header-button cursor-pointer bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 text-sm hover:from-orange-600 hover:to-orange-700 sm:text-base">
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
            <ArrowRight className="ml-1 h-4 w-4 sm:ml-2" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
