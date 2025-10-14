import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border text-xs font-medium uppercase tracking-[0.12em]",
  {
    variants: {
      intent: {
        accent:
          "border-border-strong/40 bg-accent-primary/10 text-accent-secondary",
        neutral:
          "border-border-soft/60 bg-surface-muted/60 text-content-subtle",
      },
      size: {
        default: "px-4 py-2",
        compact: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      intent: "accent",
      size: "default",
    },
  }
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, intent, size, ...props }: BadgeProps) {
  return (
    <span className={clsx(badgeVariants({ intent, size }), className)} {...props} />
  );
}
