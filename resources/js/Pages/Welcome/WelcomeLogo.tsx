import { cn } from "@/lib/utils";

export default function WelcomeLogo({
    className,
    ...props
}: React.ComponentProps<'img'>) {
    return (
        <img src='/favicon.webp' className={cn('rounded-4xl size-32', className)} {...props} style={{ viewTransitionName: 'welcome-logo' }} />
    );
}