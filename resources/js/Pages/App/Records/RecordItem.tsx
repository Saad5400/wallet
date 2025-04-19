import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Record, RecordType } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

interface RecordItemProps {
	record: Record & {
		account: { name: string };
		category?: { name: string };
		subCategory?: { name: string };
	};
}

export default function RecordItem({ record }: RecordItemProps) {
	const [showDelete, setShowDelete] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// Configure swipe handlers
	const swipeHandlers = useSwipeable({
		onSwipedLeft: () => setShowDelete(true),
		onSwipedRight: () => setShowDelete(false),
		trackMouse: true
	});

	// Format the date to show day and month
	const formattedDate = dayjs(record.occurred_at).format('DD/MM');

	// Delete the record
	const handleDelete = () => {
		router.delete(route('record.destroy', record.id), {
			onSuccess: () => {
				setIsDialogOpen(false);
			}
		});
	};

	// Get the appropriate color based on record type
	const getTypeColor = (type: RecordType) => {
		switch (type) {
			case 'income': return 'text-success';
			case 'expense': return 'text-destructive';
			case 'transfer': return 'text-primary';
			default: return '';
		}
	};

	// Format amount with correct sign based on record type
	const formatAmount = (amount: number, type: RecordType) => {
		if (type === 'expense') {
			return `-${Math.abs(amount).toFixed(2)}`;
		}
		return amount.toFixed(2);
	};

	return (
		<div className="relative flex overflow-hidden">
			<div
				{...swipeHandlers}
				className="flex items-center justify-between w-full p-3 transition-transform border-b bg-card border-border"
				style={{
					transform: showDelete ? 'translateX(-80px)' : 'translateX(0)',
					transition: 'transform 0.3s ease-out'
				}}
			>
				<div className="flex flex-col">
					<span className="font-medium">{record.account.name}</span>
					<div className="text-sm text-muted">
						{record.category && <span>{record.category.name}</span>}
						{record.subCategory && <span> / {record.subCategory.name}</span>}
						{record.description && <span> - {record.description}</span>}
					</div>
				</div>
				<div className="flex flex-col items-end">
					<span className={cn("font-semibold", getTypeColor(record.type))}>
						{formatAmount(record.amount, record.type)}
					</span>
					<span className="text-xs text-muted">{formattedDate}</span>
				</div>
			</div>

			{/* Delete button that appears when swiped */}
			<div
				className="absolute top-0 bottom-0 right-0 flex items-center"
				style={{
					width: '80px',
					opacity: showDelete ? 1 : 0,
					pointerEvents: showDelete ? 'auto' : 'none',
					transition: 'opacity 0.3s ease-out'
				}}
			>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button
							variant="destructive"
							className="w-full h-full rounded-none"
							onClick={(e) => {
								e.stopPropagation();
							}}
						>
							حذف
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>تأكيد الحذف</DialogTitle>
							<DialogDescription>
								هل أنت متأكد من رغبتك في حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter className="flex justify-end space-x-2">
							<Button variant="ghost" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
							<Button variant="destructive" onClick={handleDelete}>حذف</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}