import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Icon } from '@iconify/react';

interface CreateSubCategoryDialogProps {
  categoryId: number;
  categoryName?: string;
  onCreated: (subCategoryId: number) => void;
}

export default function CreateSubCategoryDialog({ categoryId, categoryName, onCreated }: CreateSubCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm<{ name: string; category_id: number }>({ name: '', category_id: categoryId });

  // update category_id if prop changes
  React.useEffect(() => {
    setData('category_id', categoryId);
  }, [categoryId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('subCategory.store'), {
      onSuccess: (page: any) => {
        const subCategory = page.props?.flash?.subCategory;
        if (subCategory) onCreated(Number(subCategory.id));
        reset();
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-10 rounded-lg h-h-full" aria-label="Add subcategory">
          <Icon icon="material-symbols:add" className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {categoryName ? `إضافة تصنيف فرعي لـ ${categoryName}` : 'إضافة تصنيف فرعي'}
          </DialogTitle>
          <DialogDescription>
            {categoryName ? `أنشئ تصنيفًا فرعيًا جديدًا تحت ${categoryName}` : 'أنشئ تصنيفًا فرعيًا جديدًا'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">اسم التصنيف الفرعي</Label>
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