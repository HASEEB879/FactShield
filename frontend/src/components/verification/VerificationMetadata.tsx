import { BarChart3, CheckCircle2, Database } from "lucide-react";

interface VerificationMetadataProps {
  confidence: number;
  sourceCount: number;
}

const metadataItems = [
  {
    label: "Analysis status",
    value: "Complete",
    Icon: CheckCircle2,
    className: "text-emerald-300",
  },
  {
    label: "Verification mode",
    value: "AI-assisted review",
    Icon: BarChart3,
    className: "text-cyan-300",
  },
];

export default function VerificationMetadata({
  confidence,
  sourceCount,
}: VerificationMetadataProps) {
  const items = [
    ...metadataItems,
    {
      label: "Evidence reviewed",
      value: `${sourceCount} source${sourceCount === 1 ? "" : "s"}`,
      Icon: Database,
      className: "text-violet-300",
    },
    {
      label: "Confidence score",
      value: `${confidence}%`,
      Icon: BarChart3,
      className: "text-amber-200",
    },
  ];

  return (
    <section className="border-t border-white/10 pt-6" aria-label="Verification metadata">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Verification metadata
      </h3>
      <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ label, value, Icon, className }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5"
          >
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${className}`} />
              <dt className="text-xs text-slate-500">{label}</dt>
            </div>
            <dd className="mt-2 text-sm font-medium text-slate-200">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
