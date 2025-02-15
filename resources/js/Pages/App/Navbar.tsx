import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import { useMemo } from "react";

function NavBox({ children }: { children: React.ReactNode }) {
    return (
        <div className="size-16 flex items-end justify-center">
            {children}
        </div>
    );
}

function NavButton({
    routeName,
    iconName,
    text,
}: {
    routeName: string;
    iconName: string;
    text: string;
}) {
    const isActive = useMemo(() => {
        return route().current(routeName);
    }, [routeName]);

    // if it's already active, we don't want to create a Link component, instead we just render a div. To do that let's make a dynamic component
    const Content = isActive ? 'div' : Link;

    return (
        <NavBox>
            <Button asChild variant='link' className={cn(
                "flex flex-col gap-1 justify-center items-center w-fit h-fit p-0",
                isActive || "text-muted"
            )}>
                <Content href={route(routeName)}>
                    <Icon icon={iconName} className='size-8' />
                    <span>{text}</span>
                </Content>
            </Button>
        </NavBox>
    );
}

export default function Navbar() {
    return (
        <nav className="w-screen h-20 bg-card border-t-1 absolute bottom-0 p-4 pt-0 flex flex-row justify-between" style={{ zIndex: 10, viewTransitionName: 'bottom-navbar' }}>
            <NavButton routeName="home" iconName="material-symbols:home-outline-rounded" text="الرئيسية" />
            <NavButton routeName="home" iconName="material-symbols:arrow-split-rounded" text="العمليات" />
            <NavButton routeName="home" iconName="material-symbols:wallet" text="الحسابات" />
            <NavButton routeName="home" iconName="material-symbols:menu-rounded" text="الإعدادات" />
        </nav>
    );
}