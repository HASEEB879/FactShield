import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";

const stats = [
  {
    value: "10K+",
    label: "Claims Verified",
  },
  {
    value: "98%",
    label: "Average Accuracy",
  },
  {
    value: "24/7",
    label: "AI Monitoring",
  },
  {
    value: "50+",
    label: "Trusted Sources",
  },
];

export default function Stats() {
  return (
    <section className="py-24">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-5xl font-bold text-primary">
                {stat.value}
              </h3>

              <p className="mt-3 text-muted-foreground">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}