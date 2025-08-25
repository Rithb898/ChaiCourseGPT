"use client";

import { Button } from "@/components/ui/button";
import { CardEnhanced } from "@/components/ui/card-enhanced";
import { AvatarEnhanced } from "@/components/ui/avatar-enhanced";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Zap,
  Star,
  Play,
  CheckCircle,
  MessageCircle,
  Brain,
  Sparkles,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const LandingPage = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Header */}
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

      {/* Main Content with proper offset */}
      <main className="main-content">
        {/* Hero Section */}
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
                  Learn faster, code better, and get instant help with your
                  course content.
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
                <div className="mb-2 text-3xl font-bold text-orange-400">
                  24/7
                </div>
                <div className="text-gray-400">Available</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-400">
                  1000+
                </div>
                <div className="text-gray-400">Topics Covered</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-400">
                  Instant
                </div>
                <div className="text-gray-400">Responses</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-400">
                  Smart
                </div>
                <div className="text-gray-400">AI Assistant</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="bg-gradient-to-b from-gray-900/50 to-transparent px-4 py-16 sm:px-6"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                Why Choose ChaiCourseGPT?
              </h2>
              <p className="mx-auto max-w-6xl text-xl text-gray-300">
                Haan ji! Here&apos;s what makes our AI assistant special for
                your coding journey
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <CardEnhanced
                variant="default"
                padding="lg"
                className="text-center"
              >
                <div className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Smart AI Assistant
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    Powered by advanced AI that understands your course content
                    and provides personalized explanations in Hitesh&apos;s
                    teaching style.
                  </p>
                </div>
              </CardEnhanced>

              <CardEnhanced
                variant="default"
                padding="lg"
                className="text-center"
              >
                <div className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600">
                    <Code2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Code Help & Debugging
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    Get instant help with coding problems, debug issues, and
                    understand complex concepts with practical examples.
                  </p>
                </div>
              </CardEnhanced>

              <CardEnhanced
                variant="default"
                padding="lg"
                className="text-center"
              >
                <div className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Instant Responses
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    No waiting around! Get immediate answers to your questions
                    with precise timestamps and source references.
                  </p>
                </div>
              </CardEnhanced>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="px-4 py-16 sm:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                How ChaiCourseGPT Works
              </h2>
              <p className="mx-auto max-w-6xl text-xl text-gray-300">
                Simple, effective, and designed for your learning success
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="mb-4 text-xl font-semibold text-white">
                  Ask Your Question
                </h3>
                <p className="leading-relaxed text-gray-400">
                  Type any coding question, concept doubt, or request for
                  explanation. Our AI understands context and provides relevant
                  answers.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="mb-4 text-xl font-semibold text-white">
                  Get Smart Answers
                </h3>
                <p className="leading-relaxed text-gray-400">
                  Receive detailed explanations in Hitesh&apos;s teaching style
                  with code examples, best practices, and practical insights.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="mb-4 text-xl font-semibold text-white">
                  Learn & Apply
                </h3>
                <p className="leading-relaxed text-gray-400">
                  Apply the knowledge immediately with source references,
                  timestamps, and follow-up questions for deeper understanding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="bg-gradient-to-b from-gray-900/50 to-transparent px-4 py-16 sm:px-6"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                What Students Say
              </h2>
              <p className="mx-auto max-w-6xl text-xl text-gray-300">
                Real feedback from learners who&apos;ve experienced the
                ChaiCourseGPT difference
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <CardEnhanced variant="default" padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <p className="leading-relaxed text-gray-300">
                    &quot;Haan ji, this is exactly what I needed! The
                    explanations are so clear and the Hinglish style makes
                    everything easy to understand.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <AvatarEnhanced
                      src="/user.svg"
                      alt="Student"
                      size="sm"
                      className="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        Priya Sharma
                      </div>
                      <div className="text-sm text-gray-400">
                        React Developer
                      </div>
                    </div>
                  </div>
                </div>
              </CardEnhanced>

              <CardEnhanced variant="default" padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <p className="leading-relaxed text-gray-300">
                    &quot;The instant responses and code examples saved me
                    hours of debugging. It&apos;s like having Hitesh sir
                    available 24/7!&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <AvatarEnhanced
                      src="/user.svg"
                      alt="Student"
                      size="sm"
                      className="bg-gradient-to-br from-green-500 to-green-600"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        Rahul Kumar
                      </div>
                      <div className="text-sm text-gray-400">
                        Full Stack Developer
                      </div>
                    </div>
                  </div>
                </div>
              </CardEnhanced>

              <CardEnhanced variant="default" padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <p className="leading-relaxed text-gray-300">
                    &quot;Perfect for quick doubts and concept clarification.
                    The source references help me find exact video
                    timestamps!&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <AvatarEnhanced
                      src="/user.svg"
                      alt="Student"
                      size="sm"
                      className="bg-gradient-to-br from-purple-500 to-purple-600"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        Anita Patel
                      </div>
                      <div className="text-sm text-gray-400">
                        Frontend Developer
                      </div>
                    </div>
                  </div>
                </div>
              </CardEnhanced>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 sm:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <CardEnhanced
              variant="elevated"
              padding="lg"
              className="border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-orange-600/10"
            >
              <div className="space-y-8 p-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Ready to Accelerate Your Learning?
                </h2>

                <div className="mx-auto max-w-4xl">
                  <p className="mb-4 text-lg leading-relaxed text-gray-300 md:text-xl">
                    Join thousands of students who are already learning faster
                    with ChaiCourseGPT.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-300 md:text-xl">
                    <span className="font-semibold text-orange-400">
                      Seedhi si baat hai
                    </span>{" "}
                    - it&apos;s time to level up your coding skills!
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/chat">
                    <Button
                      size="lg"
                      className="min-w-[200px] cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg hover:from-orange-600 hover:to-orange-700"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Start Chatting Now
                    </Button>
                  </Link>

                  <div className="flex items-center gap-2 text-gray-400">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Free to use • No signup required</span>
                  </div>
                </div>
              </div>
            </CardEnhanced>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-4 py-8 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/chai.webp"
                  width={32}
                  height={32}
                  alt="ChaiCourseGPT logo"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-white">ChaiCourseGPT</div>
                <div className="text-xs text-gray-400">
                  Powered by Hitesh Choudhary
                </div>
              </div>
            </div>

            <div className="text-center text-gray-400">
              <p className="text-sm">
                &copy; 2025 ChaiCourseGPT. Made with ❤️ for the coding
                community.
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Link href="https://github.com/Rithb898" target="_blank">
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Github />
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/in/rith-banerjee/"
                target="_blank"
              >
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Linkedin />
                </Button>
              </Link>
              <Link href="https://x.com/rithcoderr" target="_blank">
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Twitter />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
