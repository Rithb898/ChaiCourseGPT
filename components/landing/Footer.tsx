import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
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
              &copy; 2025 ChaiCourseGPT. Made with ❤️ for the coding community.
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
  );
};

export default Footer;
