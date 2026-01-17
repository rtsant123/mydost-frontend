import { clsx } from "clsx";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerSlot?: React.ReactNode;
};

export function Card({ title, children, className, headerSlot }: CardProps) {
  return (
    <div className={clsx("card", className)}>
      {(title || headerSlot) && (
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div>
            {title && <h3 className="text-base font-semibold text-ink-900">{title}</h3>}
          </div>
          {headerSlot}
        </div>
      )}
      <div className="card-section">{children}</div>
    </div>
  );
}
