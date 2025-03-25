import { Button } from "@/components/ui/button";
import React, { useMemo, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ar";
import { Period } from "@/types";

interface PeriodSelectorProps {
    selectedPeriod?: Period;
    setSelectedPeriod: (period: Period) => void;
    monthStartDay?: number;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
    selectedPeriod,
    setSelectedPeriod,
    monthStartDay = 27,
}) => {

    const defaultPeriod = useMemo(() => {
        const today = dayjs();
        const isBeforeMonthStart = today.date() < monthStartDay;

        const startDate = (isBeforeMonthStart
            ? today.subtract(1, 'month').date(monthStartDay)
            : today.date(monthStartDay)
        ).startOf('day');

        const endDate = startDate.add(1, 'month').startOf('day');

        return { startDate, endDate };
    }, [monthStartDay]);


    // Initialize with default if no period is set
    useEffect(() => {
        if (!selectedPeriod) {
            setSelectedPeriod(defaultPeriod);
        }
    }, [selectedPeriod, setSelectedPeriod, defaultPeriod]);

    const currentPeriod = selectedPeriod || defaultPeriod;

    const periodLabel = useMemo(() => {
        const start = currentPeriod.startDate.locale('ar');
        const end = currentPeriod.endDate.locale('ar');

        const defaultEndDate = start.clone().add(1, 'month').startOf('day');
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
    }, [currentPeriod, monthStartDay]);


    return (
        <Button
            onClick={() => console.log('Open calendar or range picker', currentPeriod)}
            variant='card'
        >
            {periodLabel}
        </Button>
    );
};

export default PeriodSelector;
