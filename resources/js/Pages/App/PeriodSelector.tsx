import { Button } from "@/components/ui/button";
import React, { useMemo, useEffect, useState, useRef } from "react";
import "dayjs/locale/ar";
import { Period } from "@/types";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import dayjs from 'dayjs';
import { router } from '@inertiajs/react'
import { ar } from "react-day-picker/locale";
import { Label } from "@/components/ui/label";

interface PeriodSelectorProps {
    selectedPeriod: Period;
    setSelectedPeriod: (period: Period) => void;
    monthStartDay?: number;
    defaultPeriod: Period;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
    selectedPeriod,
    setSelectedPeriod,
    monthStartDay = 27,
    defaultPeriod,
}) => {
    const [open, setOpen] = useState(false);

    const periodLabel = useMemo(() => {
        const start = selectedPeriod.startDate.locale('ar');
        const end = selectedPeriod.endDate.locale('ar');

        const defaultEndDate = start.clone().add(1, 'month').subtract(1, 'second');
        const isDefaultFullMonth = start.date() === monthStartDay && end.isSame(defaultEndDate, 'day');

        if (isDefaultFullMonth) {
            // Calculate days in start month within the period
            const startMonthEnd = start.clone().endOf('month');
            const startMonthDays = startMonthEnd.diff(start, 'day') + 1;

            // Calculate days in end month within the period
            const endMonthStart = end.clone().startOf('month');
            const endMonthDays = end.diff(endMonthStart, 'day');

            // Decide which month has more days in the period
            return startMonthDays >= endMonthDays ? start.format('MMMM') : end.subtract(1, 'day').format('MMMM');
        }

        const sameYear = start.year() === end.year();
        const sameMonth = start.month() === end.month() && sameYear;

        if (sameMonth) {
            return `${start.format('MMMM')} (${start.date()} - ${end.date()})`;
        }

        if (sameYear) {
            const startFormat = start.format('MMMM D');
            const endFormat = end.format('MMMM D');
            return `${startFormat} - ${endFormat}`;
        }

        const startFormat = start.format('MMMM D YYYY');
        const endFormat = end.format('MMMM D YYYY');

        return `${startFormat} - ${endFormat}`;
    }, [selectedPeriod, monthStartDay]);

    // Preset handlers
    const applyPreset = (type: string) => {
        let start, end;
        const now = dayjs();
        switch (type) {
            case 'lastWeek':
                start = now.subtract(6, 'day').startOf('day');
                end = now;
                break;
            case 'lastMonth':
                start = now.subtract(29, 'day').startOf('day');
                end = now;
                break;
            case 'lastYear':
                start = now.subtract(364, 'day').startOf('day');
                end = now;
                break;
            default:
                setSelectedPeriod({ startDate: null, endDate: null });
                return;
        }
        setSelectedPeriod({ startDate: start, endDate: end });
    };

    const initialMount = useRef(true);
    useEffect(() => {
        if (initialMount.current) {
            initialMount.current = false;
            return;
        }
        // If period equals default, clear query params, else set them
        const isDefault = selectedPeriod.startDate.isSame(defaultPeriod.startDate) &&
            selectedPeriod.endDate.isSame(defaultPeriod.endDate);
        if (isDefault) {
            router.get(route('home'), {
                startDate: defaultPeriod.startDate.toISOString(),
                endDate: defaultPeriod.endDate.toISOString(),
            }, { preserveState: true });
        } else {
            router.get(route('home'), {
                startDate: selectedPeriod.startDate.toISOString(),
                endDate: selectedPeriod.endDate.toISOString(),
            }, { preserveState: true });
        }
    }, [selectedPeriod]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='card'>
                    {periodLabel}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription>حدد فترة مسبقة أو قم بتخصيص التواريخ</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => applyPreset('lastWeek')}>آخر أسبوع</Button>
                        <Button variant="outline" onClick={() => applyPreset('lastMonth')}>آخر شهر</Button>
                        <Button variant="outline" onClick={() => applyPreset('lastYear')}>آخر سنة</Button>
                        <Button variant="outline" onClick={() => {
                            // Reset to default period and clear query params
                            setSelectedPeriod(defaultPeriod);
                        }}>
                            الشهر الحالي
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label className="block text-sm font-medium">تاريخ البداية</Label>
                        <DateTimePicker
                            locale={ar}
                            value={selectedPeriod.startDate.toDate()}
                            onChange={date => date && setSelectedPeriod({ startDate: dayjs(date), endDate: selectedPeriod.endDate })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="block text-sm font-medium">تاريخ النهاية</Label>
                        <DateTimePicker
                            locale={ar}
                            value={selectedPeriod.endDate.toDate()}
                            onChange={date => date && setSelectedPeriod({ startDate: selectedPeriod.startDate, endDate: dayjs(date) })}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PeriodSelector;
