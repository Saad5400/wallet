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

// Predefined period types
type PeriodPreset = 'currentMonth' | 'lastWeek' | 'lastMonth' | 'lastYear' | 'custom';

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
    selectedPeriod,
    setSelectedPeriod,
    monthStartDay = 27,
    defaultPeriod,
}) => {
    const [open, setOpen] = useState(false);
    const [periodType, setPeriodType] = useState<PeriodPreset>('currentMonth');
    const [customStartDate, setCustomStartDate] = useState<dayjs.Dayjs>(selectedPeriod.startDate);
    const [customEndDate, setCustomEndDate] = useState<dayjs.Dayjs>(selectedPeriod.endDate);
    
    // Check if selected period matches default period
    const isDefaultPeriod = useMemo(() => {
        return selectedPeriod.startDate.isSame(defaultPeriod.startDate, 'day') && 
               selectedPeriod.endDate.isSame(defaultPeriod.endDate, 'day');
    }, [selectedPeriod, defaultPeriod]);

    // Generate a human-readable label for the selected period
    const periodLabel = useMemo(() => {
        if (isDefaultPeriod) {
            return "الشهر الحالي";
        }

        const start = selectedPeriod.startDate.locale('ar');
        const end = selectedPeriod.endDate.locale('ar');

        // Check if it's a full month from start day to next start day
        const nextMonthStartDay = start.clone().add(1, 'month').date(monthStartDay).subtract(1, 'day');
        const isFullCustomMonth = start.date() === monthStartDay && end.isSame(nextMonthStartDay, 'day');

        if (isFullCustomMonth) {
            return start.format('MMMM YYYY');
        }

        const sameYear = start.year() === end.year();
        const sameMonth = start.month() === end.month() && sameYear;

        if (sameMonth) {
            return `${start.format('MMMM')} (${start.date()} - ${end.date()})`;
        }

        if (sameYear) {
            return `${start.format('D MMMM')} - ${end.format('D MMMM YYYY')}`;
        }

        return `${start.format('D MMMM YYYY')} - ${end.format('D MMMM YYYY')}`;
    }, [selectedPeriod, defaultPeriod, monthStartDay, isDefaultPeriod]);

    // Apply a preset period
    const applyPreset = (preset: PeriodPreset) => {
        setPeriodType(preset);
        
        const now = dayjs();
        let start: dayjs.Dayjs;
        let end: dayjs.Dayjs;
        
        switch (preset) {
            case 'lastWeek':
                start = now.subtract(6, 'day').startOf('day');
                end = now.endOf('day');
                break;
                
            case 'lastMonth':
                start = now.subtract(29, 'day').startOf('day');
                end = now.endOf('day');
                break;
                
            case 'lastYear':
                start = now.subtract(364, 'day').startOf('day');
                end = now.endOf('day');
                break;
                
            case 'currentMonth':
                start = defaultPeriod.startDate.clone();
                end = defaultPeriod.endDate.clone();
                break;
                
            case 'custom':
                // When switching to custom, initialize with current selection
                setCustomStartDate(selectedPeriod.startDate);
                setCustomEndDate(selectedPeriod.endDate);
                return;
                
            default:
                return;
        }
        
        // Update the period and close dialog
        setSelectedPeriod({ startDate: start, endDate: end });
        setOpen(false);
    };

    // Apply custom date range
    const applyCustomDateRange = () => {
        // Validate date range
        if (customStartDate.isAfter(customEndDate)) {
            return;
        }
        
        setSelectedPeriod({ 
            startDate: customStartDate.startOf('day'), 
            endDate: customEndDate.endOf('day') 
        });
        setPeriodType('custom');
        setOpen(false);
    };

    // Handle URL updates when period changes
    const initialMount = useRef(true);
    useEffect(() => {
        // Skip on initial mount
        if (initialMount.current) {
            initialMount.current = false;
            return;
        }

        // Update URL query parameters with selected period
        // Only include date params if not using default period
        if (isDefaultPeriod) {
            router.get(window.location.pathname, {}, { 
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        } else {
            router.get(window.location.pathname, {
                startDate: selectedPeriod.startDate.toISOString(),
                endDate: selectedPeriod.endDate.toISOString()
            }, { 
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }
    }, [selectedPeriod, isDefaultPeriod]);

    // When dialog opens, set current period type and custom dates
    useEffect(() => {
        if (open) {
            // Detect current period type
            if (isDefaultPeriod) {
                setPeriodType('currentMonth');
            } else {
                // Check if it matches any preset
                const now = dayjs();
                const lastWeekStart = now.subtract(6, 'day').startOf('day');
                const lastMonthStart = now.subtract(29, 'day').startOf('day');
                const lastYearStart = now.subtract(364, 'day').startOf('day');
                
                if (selectedPeriod.startDate.isSame(lastWeekStart, 'day') && 
                    selectedPeriod.endDate.isSame(now.endOf('day'), 'day')) {
                    setPeriodType('lastWeek');
                } else if (selectedPeriod.startDate.isSame(lastMonthStart, 'day') && 
                          selectedPeriod.endDate.isSame(now.endOf('day'), 'day')) {
                    setPeriodType('lastMonth');
                } else if (selectedPeriod.startDate.isSame(lastYearStart, 'day') && 
                          selectedPeriod.endDate.isSame(now.endOf('day'), 'day')) {
                    setPeriodType('lastYear');
                } else {
                    setPeriodType('custom');
                    setCustomStartDate(selectedPeriod.startDate);
                    setCustomEndDate(selectedPeriod.endDate);
                }
            }
        }
    }, [open, selectedPeriod, isDefaultPeriod]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='card'>
                    {periodLabel}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>اختر الفترة الزمنية</DialogTitle>
                    <DialogDescription>حدد فترة مسبقة أو قم بتخصيص التواريخ</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Button 
                            variant={periodType === "currentMonth" ? "default" : "outline"} 
                            onClick={() => applyPreset('currentMonth')}>
                            الشهر الحالي
                        </Button>
                        <Button 
                            variant={periodType === "lastWeek" ? "default" : "outline"} 
                            onClick={() => applyPreset('lastWeek')}>
                            آخر أسبوع
                        </Button>
                        <Button 
                            variant={periodType === "lastMonth" ? "default" : "outline"} 
                            onClick={() => applyPreset('lastMonth')}>
                            آخر شهر
                        </Button>
                        <Button 
                            variant={periodType === "lastYear" ? "default" : "outline"} 
                            onClick={() => applyPreset('lastYear')}>
                            آخر سنة
                        </Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                        <h4 className="mb-4 text-sm font-medium">فترة مخصصة</h4>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="block text-sm font-medium">تاريخ البداية</Label>
                                <DateTimePicker
                                    locale={ar}
                                    value={customStartDate.toDate()}
                                    onChange={date => date && setCustomStartDate(dayjs(date))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="block text-sm font-medium">تاريخ النهاية</Label>
                                <DateTimePicker
                                    locale={ar}
                                    value={customEndDate.toDate()}
                                    onChange={date => date && setCustomEndDate(dayjs(date))}
                                />
                            </div>
                            
                            <Button 
                                onClick={applyCustomDateRange}
                                className="w-full"
                                variant={periodType === "custom" ? "default" : "outline"}>
                                تطبيق التاريخ المخصص
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PeriodSelector;
