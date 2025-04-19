import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

interface CreateAccountDialogProps {
	onCreated: (id: number) => void;
}

export default function CreateAccountDialog({ onCreated }: CreateAccountDialogProps) {
	const [open, setOpen] = useState(false);
	const { data, setData, post, processing, errors, reset } = useForm({ name: '', cashback_rate: '0' });

	function submit(e: React.FormEvent) {
		e.preventDefault();
		post(route('account.store'), {
			onSuccess: (page: any) => {
				const account = page.props?.flash?.account;

				if (account)
					onCreated(Number(account.id));

				reset();
				setOpen(false);
			},
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-full">إضافة حساب جديد</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>إضافة حساب جديد</DialogTitle>
				</DialogHeader>
				<form onSubmit={submit} className="w-full h-full space-y-4">
					<div className='flex flex-col gap-2 mt-4'>
						<Label htmlFor="name">اسم الحساب</Label>
						<Input className='w-full' id="name" autoComplete='off' value={data.name} onChange={e => setData('name', e.target.value)} required />
						{errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
					</div>
					<div className='flex flex-col gap-2'>
						<Label htmlFor="cashback_rate">
							نسبة الاسترجاع (Cashback)
						</Label>
						<Input
							postfix='%'
							className='w-full'
							id="cashback_rate"
							type="number"
							step="any"
							value={data.cashback_rate}
							onChange={e => setData('cashback_rate', e.target.value)}
						/>
						{errors.cashback_rate && <p className="mt-1 text-sm text-destructive">{errors.cashback_rate}</p>}
					</div>
					<div className="flex justify-end space-x-2">
						<DialogClose asChild>
							<Button variant="ghost">إلغاء</Button>
						</DialogClose>
						<Button type="submit" disabled={processing}>{processing ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}