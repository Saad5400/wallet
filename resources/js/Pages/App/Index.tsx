import AppLayout from "./AppLayout";
import { PageProps, Period } from "@/types";
import React, { useState } from "react";
import { Dayjs } from "dayjs";
import PeriodSelector from "./PeriodSelector";

function Index({ auth }: PageProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<Period | undefined>(undefined);

    return (
        <>
            <header className="flex justify-between items-center">
                <h5>هلا {auth.user.name}</h5>
                <PeriodSelector
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                    monthStartDay={27}
                />
            </header>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Index;
