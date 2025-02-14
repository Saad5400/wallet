import { cn } from "@/lib/utils";

export default function WelcomeLogo({
    className,
    style,
    ...props
}: React.ComponentProps<'img'>) {
    return (
        <img
            src='/favicon.webp'
            className={cn('rounded-4xl size-32', className)}
            style={{ viewTransitionName: 'welcome-logo', ...style }}
            {...props}
        />
    );
}
