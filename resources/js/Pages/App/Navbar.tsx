import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import AddRecord from "./AddRecord";
import tenantRoute from "@/lib/tenantRoute";

function NavBox({ children }: { children: React.ReactNode }) {
    return (
        <div className="size-8 flex items-end justify-center">
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
    const isActive = route().current(routeName);

    return (
        <NavBox>
            <Button asChild variant='link' className={cn(
                "flex flex-col gap-1 justify-center items-center size-fit p-0",
                isActive || "text-muted"
            )}>
                <Link href={tenantRoute(routeName)}>
                    <Icon icon={iconName} className='size-8' />
                </Link>
            </Button>
        </NavBox>
    );
}

export default function Navbar() {
    return (
        <nav className="w-full bg-card border-t-1 absolute bottom-0 left-0 px-6 pb-6 pt-2 flex flex-row justify-between" style={{ zIndex: 10, viewTransitionName: 'bottom-navbar' }}>
            <NavButton routeName="home" iconName="material-symbols:home-outline-rounded" text="الرئيسية" />
            <NavButton routeName="records" iconName="material-symbols:arrow-split-rounded" text="العمليات" />
            <NavBox><AddRecord /></NavBox>
            <NavButton routeName="accounts" iconName="material-symbols:wallet" text="الحسابات" />
            <NavButton routeName="settings" iconName="material-symbols:menu-rounded" text="الإعدادات" />
        </nav>
    );
}