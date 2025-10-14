import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { forwardRef } from "react";

type ButtonElement = HTMLButtonElement;

type ButtonProps = React.ButtonHTMLAttributes<ButtonElement> &
  VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary",
  {
    variants: {
      intent: {
        primary:
          "bg-accent-primary text-surface-inverted shadow-glow hover:scale-[1.02] hover:shadow-glow-strong focus-visible:ring-[hsla(var(--color-accent-secondary),0.6)]",
        secondary:
          "bg-surface-elevated/70 text-content-strong border border-border-soft hover:border-border-strong/80 hover:text-surface-inverted hover:bg-accent-secondary/90",
        ghost:
          "bg-transparent text-content-subtle hover:text-content-strong hover:bg-surface-muted/60",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

const Button = forwardRef<ButtonElement, ButtonProps>(
  ({ className, intent, size, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(buttonVariants({ intent, size }), className)}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { Button, buttonVariants };
