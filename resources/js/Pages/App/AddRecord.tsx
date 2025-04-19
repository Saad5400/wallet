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

export default function AddRecord() {

    const { user, tenant } = useAuth();

    const [recordType, setRecordType] = useState<RecordType>(user.lastRecord?.type || 'expense');
    const [amount, setAmount] = useState<number | string>('');
    const [account, setAccount] = useState<number>(user.lastRecord?.account_id || tenant.accounts[0]?.id || -1);
    const [category, setCategory] = useState<number>(user.lastRecord?.category_id || tenant.categories[0]?.id || -1);
    const [subCategory, setSubCategory] = useState<number>(user.lastRecord?.sub_category_id || tenant.categories[0]?.sub_categories[0]?.id || -1);
    const [datetime, setDatetime] = useState<Date>(new Date());

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className="rounded-full size-14">
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
            <DrawerContent asChild className="p-2 bg-card space-y-2">
                <form>
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
                        <Button
                            variant='ghost'
                            className="flex items-center justify-between w-full"
                        >
                            <span>مدى الراجحي</span>
                            <Icon icon='material-symbols:credit-card' className="size-6" />
                        </Button>
                    </section>

                    <section>
                        <Button
                            variant='ghost'
                            className="flex items-center justify-between w-full text-primary"
                        >
                            <span className="text-sm">مواصلات</span>
                            <Icon icon='material-symbols:category' className="size-6" />
                        </Button>
                    </section>

                    <section className="flex w-full overflow-x-auto">
                        <ToggleGroup
                            type="single"
                            variant='outline'
                            size='lg'
                            className="text-sm"
                        >
                            <ToggleGroupItem
                                value="0"
                            >
                                <Icon icon='material-symbols:local-taxi' className="!size-6" />
                                <span>تكسي</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="1"
                            >
                                <Icon icon='material-symbols:local-taxi' className="!size-6" />

                                <span>تكسي</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="2"
                            >
                                <Icon icon='material-symbols:local-taxi' className="!size-6" />

                                <span>تكسي</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="3"
                            >
                                <Icon icon='material-symbols:local-taxi' className="!size-6" />

                                <span>تكسي</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="4"
                            >
                                <Icon icon='material-symbols:local-taxi' className="!size-6" />

                                <span>تكسي</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="5"
                            >
                                <Icon icon='material-symbols:local-taxi' className="!size-6" />
                                <span>تكسي</span>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </section>

                    <section>
                        <DateTimePicker
                            className="w-full border-none bg-transparent"
                            locale={ar}
                            value={datetime}
                            onChange={(date) => date && setDatetime(date)}
                        />
                    </section>

                    <DrawerFooter className="flex flex-row justify-between">
                        <Button type="submit" className="flex-1">حفظ</Button>
                        <DrawerClose asChild>
                            <Button variant="ghost" className="flex-1">إلغاء</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer >
    );
}
