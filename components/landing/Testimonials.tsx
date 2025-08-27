import React from "react";
import AvatarEnhanced from "../ui/avatar-enhanced";
import CardEnhanced from "../ui/card-enhanced";
import { Star } from "lucide-react";

const Testimonials = () => {
  return (
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
                &quot;Haan ji, this is exactly what I needed! The explanations
                are so clear and the Hinglish style makes everything easy to
                understand.&quot;
              </p>
              <div className="flex items-center gap-3">
                <AvatarEnhanced
                  src="/user.svg"
                  alt="Student"
                  size="sm"
                  className="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <div>
                  <div className="font-semibold text-white">Priya Sharma</div>
                  <div className="text-sm text-gray-400">React Developer</div>
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
                &quot;The instant responses and code examples saved me hours of
                debugging. It&apos;s like having Hitesh sir available
                24/7!&quot;
              </p>
              <div className="flex items-center gap-3">
                <AvatarEnhanced
                  src="/user.svg"
                  alt="Student"
                  size="sm"
                  className="bg-gradient-to-br from-green-500 to-green-600"
                />
                <div>
                  <div className="font-semibold text-white">Rahul Kumar</div>
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
                &quot;Perfect for quick doubts and concept clarification. The
                source references help me find exact video timestamps!&quot;
              </p>
              <div className="flex items-center gap-3">
                <AvatarEnhanced
                  src="/user.svg"
                  alt="Student"
                  size="sm"
                  className="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <div>
                  <div className="font-semibold text-white">Anita Patel</div>
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
  );
};

export default Testimonials;
