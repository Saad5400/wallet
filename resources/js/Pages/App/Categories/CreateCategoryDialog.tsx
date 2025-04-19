import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

interface CreateCategoryDialogProps {
  type: string;
  onCreated: (categoryId: number) => void;
}

export default function CreateCategoryDialog({ type, onCreated }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({ name: '', type });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('category.store'), {
      onSuccess: (page: any) => {
        const category = page.props?.flash?.category;
        if (category) onCreated(Number(category.id));
        reset();
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">إضافة تصنيف جديد</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            إضافة تصنيف {type === 'expense' ? 'للمصروفات' : type === 'income' ? 'للإيرادات' : ''}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className='text-muted'>اسم التصنيف</Label>
            <Input id="name" autoComplete="off" value={data.name} onChange={e => setData('name', e.target.value)} required />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
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