import { useState, useRef, useEffect, memo } from "react";
import { HiBookOpen, HiChevronDown } from "react-icons/hi";
import { CourseType } from "@/app/chat/page";
import Image from "next/image";

const CourseFilter = memo(
  ({
    selectedCourse,
    onCourseChange,
  }: {
    selectedCourse: CourseType;
    onCourseChange: (course: CourseType) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const courses = [
      {
        id: "all" as const,
        name: "All Courses",
        icon: <HiBookOpen className="h-4 w-4" />,
        color: "text-orange-400",
        bgColor: "bg-orange-600/20",
        hoverColor: "hover:bg-orange-600/30",
      },
      {
        id: "nodejs" as const,
        name: "Node.js",
        icon: (
          <Image
            src="/nodejs.svg"
            alt="Node.js"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        ),
        color: "text-green-400",
        bgColor: "bg-green-600/20",
        hoverColor: "hover:bg-green-600/30",
      },
      {
        id: "python" as const,
        name: "Python",
        icon: (
          <Image
            src="/python.svg"
            alt="Python"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        ),
        color: "text-blue-400",
        bgColor: "bg-blue-600/20",
        hoverColor: "hover:bg-blue-600/30",
      },
    ];

    const selectedCourseData = courses.find(
      (course) => course.id === selectedCourse,
    );

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on escape key
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const handleCourseSelect = (courseId: CourseType) => {
      onCourseChange(courseId);
      setIsOpen(false);
    };

    return (
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex min-w-[160px] items-center justify-between gap-2 rounded-lg border border-gray-700/50 px-3 py-2 text-sm font-medium transition-all duration-200 ${selectedCourseData?.bgColor} ${selectedCourseData?.hoverColor} cursor-pointer backdrop-blur-sm hover:border-orange-500/30 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 focus:outline-none`}
          aria-label="Select course filter"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2">
            <span className={selectedCourseData?.color}>
              {selectedCourseData?.icon}
            </span>
            <span className="truncate text-gray-200">
              {selectedCourseData?.name}
            </span>
          </div>
          <HiChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 left-0 z-50 mt-2 max-w-[160px]">
            <div className="rounded-lg border border-gray-700/50 bg-gray-900/95 shadow-xl backdrop-blur-sm">
              <div className="p-1">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                      selectedCourse === course.id
                        ? `${course.bgColor} ${course.color} border border-orange-500/30`
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    } focus:ring-2 focus:ring-orange-500/30 focus:outline-none`}
                    role="option"
                    aria-selected={selectedCourse === course.id}
                  >
                    <span
                      className={
                        selectedCourse === course.id
                          ? course.color
                          : "text-gray-400"
                      }
                    >
                      {course.icon}
                    </span>
                    <span className="flex-1">{course.name}</span>
                    {selectedCourse === course.id && (
                      <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default CourseFilter;
