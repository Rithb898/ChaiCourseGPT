import { BookOpen, Play, Code2 } from "lucide-react";
import { CardEnhanced } from "@/components/ui/card-enhanced";
import { BadgeEnhanced } from "@/components/ui/badge-enhanced";
import { utils } from "@/lib/design-system";

interface SourceCardProps {
  technology: string;
  lessonNumber: string;
  lessonTopic: string;
  startTime: string;
  endTime: string;
}

export const SourceCard = ({
  technology,
  lessonNumber,
  lessonTopic,
  startTime,
  endTime,
}: SourceCardProps) => {
  // Enhanced technology badge colors with gradients
  const getTechBadgeColor = (tech: string) => {
    const colors: Record<string, string> = {
      python: "bg-gradient-to-r from-blue-500 to-blue-600",
      javascript: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      react: "bg-gradient-to-r from-cyan-500 to-cyan-600",
      nodejs: "bg-gradient-to-r from-green-500 to-green-600",
      typescript: "bg-gradient-to-r from-blue-600 to-blue-700",
      html: "bg-gradient-to-r from-orange-500 to-orange-600",
      css: "bg-gradient-to-r from-purple-500 to-purple-600",
      vue: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      angular: "bg-gradient-to-r from-red-500 to-red-600",
      default: "bg-gradient-to-r from-gray-500 to-gray-600",
    };
    return colors[tech.toLowerCase()] || colors.default;
  };

  return (
    <CardEnhanced
      variant="interactive"
      padding="sm"
      className={utils.cn("group cursor-pointer", "hover:scale-[1.01]")}
      role="button"
      aria-label={`Jump to ${lessonTopic} at ${startTime}`}
    >
      {/* Compact horizontal layout */}
      <div className="flex items-center gap-3">
        {/* Compact Icon */}
        <div className="relative flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md transition-all duration-200 group-hover:shadow-orange-500/25">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-gray-900 bg-green-500"></div>
        </div>

        {/* Main content in horizontal layout */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Technology Badge and Lesson Info */}
          <div className="flex items-center gap-2">
            <BadgeEnhanced
              variant="primary"
              size="sm"
              icon={<Code2 className="h-3 w-3" />}
              className={utils.cn(
                getTechBadgeColor(technology),
                "px-2 py-0.5 text-xs",
              )}
            >
              {technology.toUpperCase()}
            </BadgeEnhanced>
            <span className="text-sm font-medium text-gray-100 transition-colors group-hover:text-white">
              Lesson {lessonNumber}
            </span>
          </div>

          {/* Lesson Topic - truncated for horizontal layout */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-gray-300">{lessonTopic}</p>
          </div>

          {/* Time info and duration */}
          <div className="flex flex-shrink-0 items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Play className="h-3 w-3 text-orange-400" />
              <span className="font-mono font-medium">{startTime} -</span>
              <span className="font-mono font-medium">{endTime}</span>
            </div>
          </div>
        </div>
      </div>
    </CardEnhanced>
  );
};
