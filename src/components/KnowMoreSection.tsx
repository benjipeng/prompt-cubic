import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Book, Code, Users, Zap } from "lucide-react";

const KnowMoreSection: React.FC = () => {
  return (
    <section id="know-more" className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Know More About PromptCubic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Book,
              title: "Learn",
              description:
                "Explore our comprehensive guides and tutorials on prompt engineering and AI interaction.",
            },
            {
              icon: Code,
              title: "Integrate",
              description:
                "Easily integrate PromptCubic into your existing workflows and applications.",
            },
            {
              icon: Users,
              title: "Community",
              description:
                "Join our vibrant community of prompt engineers and AI enthusiasts.",
            },
            {
              icon: Zap,
              title: "Innovate",
              description:
                "Stay at the forefront of AI technology with our cutting-edge prompt tools.",
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

export default KnowMoreSection;
