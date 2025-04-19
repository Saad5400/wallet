import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import AddRecord from "./AddRecord";
import tenantRoute from "@/lib/tenantRoute";

function NavBox({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-end justify-center size-8">
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
        <nav className="fixed bottom-0 left-0 flex flex-row justify-between w-full px-6 pt-2 pb-6 bg-card border-t-1" style={{ zIndex: 10, viewTransitionName: 'bottom-navbar' }}>
            <NavButton routeName="home" iconName="material-symbols:home-outline-rounded" text="الرئيسية" />
            <NavButton routeName="records" iconName="material-symbols:arrow-split-rounded" text="العمليات" />
            <NavBox><AddRecord /></NavBox>
            <NavButton routeName="accounts" iconName="material-symbols:wallet" text="الحسابات" />
            <NavButton routeName="settings" iconName="material-symbols:menu-rounded" text="الإعدادات" />
        </nav>
    );
}