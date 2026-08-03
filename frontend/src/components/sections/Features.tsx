import { Brain, Globe, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

const features = [
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "Analyze claims using artificial intelligence with transparent reasoning.",
  },
  {
    icon: Globe,
    title: "Trusted Sources",
    description:
      "Cross-check information against reliable news outlets and public sources.",
  },
  {
    icon: ShieldCheck,
    title: "Confidence Score",
    description:
      "Every verification includes a confidence rating and supporting evidence.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24">
      <Container>
        <SectionTitle
          badge="Features"
          title="Everything You Need to Verify Information"
          description="Built to help students, journalists, researchers, and everyday users identify misinformation."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Icon className="mb-5 h-10 w-10 text-primary" />

                <h3 className="mb-3 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}