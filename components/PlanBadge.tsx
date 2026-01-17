type PlanBadgeProps = {
  plan: "Free" | "₹99" | "₹499";
};

export function PlanBadge({ plan }: PlanBadgeProps) {
  return <span className="badge">Plan: {plan}</span>;
}
