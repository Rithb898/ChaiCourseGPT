import React from "react";
import CardEnhanced from "../ui/card-enhanced";
import { Brain, Code2, Zap } from "lucide-react";

const FeaturesSection = () => {
  return (
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
            Haan ji! Here&apos;s what makes our AI assistant special for your
            coding journey
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <CardEnhanced variant="default" padding="lg" className="text-center">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Smart AI Assistant
              </h3>
              <p className="leading-relaxed text-gray-400">
                Powered by advanced AI that understands your course content and
                provides personalized explanations in Hitesh&apos;s teaching
                style.
              </p>
            </div>
          </CardEnhanced>

          <CardEnhanced variant="default" padding="lg" className="text-center">
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

          <CardEnhanced variant="default" padding="lg" className="text-center">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Instant Responses
              </h3>
              <p className="leading-relaxed text-gray-400">
                No waiting around! Get immediate answers to your questions with
                precise timestamps and source references.
              </p>
            </div>
          </CardEnhanced>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
