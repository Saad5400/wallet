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
import CreateAccountDialog from './CreateAccountDialog';
import { useState } from "react";

interface AccountDrawerProps {
	accounts: { id: number; name: string }[];
	selectedAccount: number;
	onSelect: (id: number) => void;
}

export default function AccountDrawer({ accounts, selectedAccount, onSelect }: AccountDrawerProps) {

	const current = accounts.find((a) => a.id === selectedAccount);
	const [open, setOpen] = useState(false);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="ghost" className="flex items-center justify-between w-full">
					<span>{current?.name || 'Select Account'}</span>
					<Icon icon="material-symbols:credit-card" className="size-6" />
				</Button>
			</DrawerTrigger>
			<DrawerContent className="p-2 bg-card space-y-2">
				<VisuallyHidden>
					<DrawerHeader>
						<DrawerTitle>اختيار الحساب</DrawerTitle>
						<DrawerDescription>
							يمكنك اختيار الحساب الذي تريد استخدامه او إضافة حساب جديد
						</DrawerDescription>
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
					<div className="pt-2 border-t border-gray-200">
						<CreateAccountDialog onCreated={(id) => {
							onSelect(id);
							setOpen(false);
						}} />
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}