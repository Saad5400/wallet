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

export default function AddRecord() {

    const [recordType, setRecordType] = useState<'expense' | 'income' | 'transfer'>('expense');
    const [amount, setAmount] = useState<number>();
    const [account, setAccount] = useState<number>(0);
    const [category, setCategory] = useState<number>(0);
    const [subCategory, setSubCategory] = useState<number>(0);
    const [datetime, setDatetime] = useState<Date>(new Date());

    return (
        <Drawer defaultOpen={true}>
            <DrawerTrigger asChild>
                <Button className="rounded-full size-14">
                    <Icon icon='material-symbols:add-2-rounded' className="size-8" />
                </Button>
            </DrawerTrigger>
            <DrawerContent asChild className="p-2 bg-card [&>*]:py-4 [&>*]:border-b">
                <form>
                    <DrawerTitle className="hidden">
                        إضافة عملية
                    </DrawerTitle>
                    <DrawerDescription className="hidden">
                        يمكنك تحديد نوع العملية والمبلغ والحساب والفئة
                    </DrawerDescription>

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
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                                setAmount(value);
                            }
                        }}
                        className={cn(
                            "bg-transparent border-0 text-5xl text-center w-full !py-12",
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
                            <Icon icon='material-symbols:credit-card' className="size-8" />
                        </Button>
                    </section>

                    <section>
                        <Button
                            variant='ghost'
                            className="flex items-center justify-between w-full text-primary"
                        >
                            <span className="text-sm">مواصلات</span>
                            <Icon icon='material-symbols:category' className="size-8" />
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
                        <Input
                            type="datetime-local"
                            className="w-full border-none"
                            value={datetime.toISOString().slice(0, 16)}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                setDatetime(date);
                            }}
                        />
                    </section>
                </form>
            </DrawerContent>
        </Drawer >
    );
}
