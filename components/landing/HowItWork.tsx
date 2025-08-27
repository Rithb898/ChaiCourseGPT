import React from "react";

const HowItWork = () => {
  return (
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
              Receive detailed explanations in Hitesh&apos;s teaching style with
              code examples, best practices, and practical insights.
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
  );
};

export default HowItWork;
