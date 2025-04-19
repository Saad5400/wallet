import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerClose,
} from "@/components/ui/drawer";
import { User } from "@/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AccountDrawerProps {
	accounts: { id: number; name: string }[];
	selectedAccount: number;
	onSelect: (id: number) => void;
}

export default function AccountDrawer({ accounts, selectedAccount, onSelect }: AccountDrawerProps) {
	const current = accounts.find((a) => a.id === selectedAccount);
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="ghost" className="flex items-center justify-between w-full">
					<span>{current?.name || 'Select Account'}</span>
					<Icon icon="material-symbols:credit-card" className="size-6" />
				</Button>
			</DrawerTrigger>
			<DrawerContent className="p-2 bg-card space-y-2">
				<VisuallyHidden>
					<DrawerHeader>
						<DrawerTitle>Choose Account</DrawerTitle>
						<DrawerDescription>Select an account for the record</DrawerDescription>
					</DrawerHeader>
				</VisuallyHidden>
				<div className="flex flex-col space-y-2">
					{accounts.map((acct) => (
						<DrawerClose asChild key={acct.id}>
							<Button
								variant={acct.id === selectedAccount ? 'secondary' : 'ghost'}
								onClick={() => onSelect(acct.id)}
							>
								{acct.name}
							</Button>
						</DrawerClose>
					))}
				</div>
			</DrawerContent>
		</Drawer>
	);
}