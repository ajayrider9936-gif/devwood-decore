export default function SectionHead({
  title,
  subtitle,
  center = true,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-9 ${center ? "text-center" : ""}`}>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-walnut">{title}</h2>
      {subtitle && <p className="text-muted text-sm mt-2">{subtitle}</p>}
    </div>
  );
}
