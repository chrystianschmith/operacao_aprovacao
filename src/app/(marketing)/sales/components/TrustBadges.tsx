import { ShieldCheck, CreditCard, LockKeyhole } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "SSL seguro" },
  { icon: CreditCard, label: "PIX · Cartão" },
  { icon: LockKeyhole, label: "LGPD" },
];

export function TrustBadges() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Selos de segurança">
      {badges.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Icon className="size-4 text-success" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}