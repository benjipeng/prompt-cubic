import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PenTool, Share2, Lightbulb, BarChart } from "lucide-react";

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          About PromptCubic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: PenTool,
              title: "Create Prompts",
              description:
                "Easily create and manage AI prompts for various models. Organize your ideas and boost your productivity.",
            },
            {
              icon: Share2,
              title: "Share and Collaborate",
              description:
                "Share your prompts with the community or collaborate with team members to refine and improve your AI interactions.",
            },
            {
              icon: Lightbulb,
              title: "Discover Inspiration",
              description:
                "Browse a vast collection of prompts created by other users. Find inspiration and adapt prompts for your specific needs.",
            },
            {
              icon: BarChart,
              title: "Optimize Performance",
              description:
                "Track and analyze your prompt effectiveness. Refine your prompts based on performance metrics and user feedback.",
            },
          ].map(({ icon: Icon, title, description }, index) => (
            <Card key={index} className="bg-card text-card-foreground">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="w-6 h-6 text-primary" />
                  <CardTitle>{title}</CardTitle>
                </div>
              </CardHeader>
              <Separator className="bg-border" />
              <CardContent className="pt-4">
                <CardDescription className="text-muted-foreground">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
