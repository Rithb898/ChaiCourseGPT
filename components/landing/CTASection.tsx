import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { CheckCircle, MessageCircle, Sparkles } from "lucide-react";
import CardEnhanced from "../ui/card-enhanced";

const CTASection = () => {
  return (
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
                Join thousands of students who are already learning faster with
                ChaiCourseGPT.
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
  );
};

export default CTASection;
