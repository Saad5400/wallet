import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { ar } from "react-day-picker/locale";
import { useAuth } from '@/hooks/useAuth';
import { PageProps, RecordType, Tenant, User } from "@/types";
import AccountDrawer from "./Accounts/AccountDrawer";
import { router, usePage } from '@inertiajs/react';
import CreateCategoryDialog from '@/Pages/App/Categories/CreateCategoryDialog';
import CreateSubCategoryDialog from '@/Pages/App/Categories/CreateSubCategoryDialog';

export default function AddRecord() {

	const { user, tenant } = useAuth();
	const [open, setOpen] = useState(false);
	const [catOpen, setCatOpen] = useState(false);

	const [recordType, setRecordType] = useState<RecordType>(user.lastRecord?.type || 'expense');
	const [amount, setAmount] = useState<number | string>('');
	const [account, setAccount] = useState<number>(user.lastRecord?.account_id || tenant.accounts[0]?.id || -1);
	const [category, setCategory] = useState<number>(user.lastRecord?.category_id || tenant.categories[0]?.id || -1);
	const [subCategory, setSubCategory] = useState<number>(user.lastRecord?.sub_category_id || tenant.categories[0]?.sub_categories[0]?.id || -1);
	const [datetime, setDatetime] = useState<Date>(new Date());
	const [description, setDescription] = useState<string>(user.lastRecord?.description || '');

	function submit(e: React.FormEvent) {
		e.preventDefault();
		router.post(route('record.store'), {
			type: recordType,
			amount,
			account_id: account,
			category_id: category,
			sub_category_id: subCategory,
			occurred_at: datetime.toISOString(),
			description,
		}, {
			onSuccess: () => setOpen(false),
		});
	}

	const { errors } = usePage<{ errors: Record<string, string[]> }>().props;

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className="rounded-full size-14" onClick={() => setOpen(true)}>
					<Icon icon='material-symbols:add-2-rounded' className="size-6" />
				</Button>
			</DrawerTrigger>
			<VisuallyHidden>
				<DrawerHeader>
					<DrawerTitle>
						إضافة عملية
					</DrawerTitle>
					<DrawerDescription>
						يمكنك تحديد نوع العملية والمبلغ والحساب والفئة
					</DrawerDescription>
				</DrawerHeader>
			</VisuallyHidden>
			<DrawerContent asChild className="p-2 space-y-2 bg-card">
				<form onSubmit={submit}>
					{/* Form errors */}
					{errors && Object.keys(errors).length > 0 && (
						<div className="space-y-1 text-sm text-destructive">
							{Object.entries(errors).map(([field, msgs]) => (
								<p key={field}>{msgs.join(' ')}</p>
							))}
						</div>
					)}

					<ToggleGroup
						value={recordType}
						// @ts-ignore
						onValueChange={(value) => ['expense', 'income', 'transfer'].includes(value) && setRecordType(value)}
						size='lg'
						variant='bottom'
						type="single"
						defaultValue="expense"
						className="flex justify-between w-full !border-b-0"
					>
						<ToggleGroupItem
							value="expense"
							aria-label="Toggle expense"
							className="flex-1 data-[state=on]:border-destructive data-[state=on]:text-destructive"
						>
							مصروف
						</ToggleGroupItem>
						<ToggleGroupItem
							value="income"
							aria-label="Toggle income"
							className="flex-1 data-[state=on]:border-success data-[state=on]:text-success"
						>
							دخل
						</ToggleGroupItem>
						<ToggleGroupItem
							value="transfer"
							aria-label="Toggle transfer"
							className="flex-1 data-[state=on]:border-primary data-[state=on]:text-primary"
						>
							تحويل
						</ToggleGroupItem>
					</ToggleGroup>

					<Input
						dir="ltr"
						placeholder="0.00"
						value={amount}
						type="number"
						onChange={(e) => setAmount(e.target.value)}
						onClick={(e) => e.currentTarget.select()}
						className={cn(
							"bg-transparent border-0 !text-5xl text-center w-full !py-12",
							recordType === 'expense' && 'text-destructive',
							recordType === 'income' && 'text-success',
							recordType === 'transfer' && 'text-primary'
						)}
					/>

					<section>
						<AccountDrawer
							accounts={tenant.accounts}
							selectedAccount={account}
							onSelect={setAccount}
						/>
					</section>

					{/* Category selection drawer */}
					<section>
						<Drawer open={catOpen} onOpenChange={setCatOpen}>
							<DrawerTrigger asChild>
								<Button variant="ghost" className="flex items-center justify-between w-full">
									<span>{tenant.categories.find(c => c.id === category)?.name || 'Select Category'}</span>
									<Icon icon="material-symbols:category-rounded" className="size-6" />
								</Button>
							</DrawerTrigger>
							<DrawerContent className="p-2 space-y-2 bg-card">
								<VisuallyHidden>
									<DrawerHeader>
										<DrawerTitle>اختيار التصنيف</DrawerTitle>
										<DrawerDescription>يمكنك اختيار التصنيف الذي تريد استخدامه او إضافة تصنيف جديد</DrawerDescription>
									</DrawerHeader>
								</VisuallyHidden>
								<div className="flex flex-col gap-2 max-h-[80dvh] overflow-y-auto">
									{tenant.categories.filter(c => c.type === recordType).map(c => (
										<DrawerClose asChild key={c.id}>
											<Button
												variant={c.id === category ? 'secondary' : 'ghost'}
												onClick={() => { setCategory(c.id); setCatOpen(false); }}
											>
												{c.name}
											</Button>
										</DrawerClose>
									))}
									<div className="pt-2 border-t border-gray-200">
										<CreateCategoryDialog type={recordType} onCreated={id => { setCategory(id); setCatOpen(false); }} />
									</div>
								</div>
							</DrawerContent>
						</Drawer>
					</section>

					{/* Subcategory selection and add */}
					<section>
						<ToggleGroup
							value={subCategory.toString()}
							onValueChange={(v) => setSubCategory(Number(v))}
							type="single"
							variant="outline"
							size="lg"
							className="flex flex-row flex-wrap gap-2 text-xs"
						>
							<CreateSubCategoryDialog categoryId={category} onCreated={(id: number) => setSubCategory(id)} />
							{(tenant.categories.find(c => c.id === category)?.sub_categories || []).map(sc => (
								<ToggleGroupItem
									className="flex-grow"
									key={sc.id} value={sc.id.toString()}
								>
									{sc.name}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</section>

					{/* Description optional */}
					<section>
						<Input
							placeholder="وصف (اختياري)"
							value={description}
							onChange={e => setDescription(e.target.value)}
							className="w-full"
						/>
					</section>

					<section>
						<DateTimePicker
							className="w-full bg-transparent border-none"
							locale={ar}
							value={datetime}
							onChange={(date) => date && setDatetime(date)}
						/>
					</section>

					<DrawerFooter className="flex flex-row justify-between">
						<Button type="submit" className="flex-1" disabled={false}>حفظ</Button>
						<DrawerClose asChild>
							<Button variant="ghost" className="flex-1">إلغاء</Button>
						</DrawerClose>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer >
	);
}
