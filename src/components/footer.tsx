import { Boxes } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          PromptCubic by{" "}
          <span
            className="inline-flex items-center relative"
            style={{ top: "2px" }}
          >
            <Boxes className="inline-block" size={16} />
          </span>
          <a
            href="https://www.appcubic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            AppCubic
          </a>{" "}
          2024
        </div>
      </div>
    </footer>
  );
}
