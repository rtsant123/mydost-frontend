import Link from "next/link";
import { clsx } from "clsx";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-400";

const variants = {
  primary: "bg-ink-900 text-white hover:bg-ink-800",
  secondary: "border border-ink-200 bg-white text-ink-700 hover:border-ink-300",
  ghost: "text-ink-600 hover:bg-ink-100"
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  lg: "px-6 py-3 text-base"
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  onClick,
  disabled = false
}: ButtonProps) {
  const classes = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    disabled && "cursor-not-allowed opacity-60",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
