import AppLayout from "./AppLayout";
import { PageProps, Period } from "@/types";
import React, { useState } from "react";
import { Dayjs } from "dayjs";
import PeriodSelector from "./PeriodSelector";
import Riyal from "@/components/icons/Riyal";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MoneyLabel } from "@/components/MoneyLabel";
import { Icon } from "@iconify/react/dist/iconify.js";
import IncomeExpense from "./IncomeExpense";

interface IndexProps extends PageProps {
    balance: number;
    income: number;
    expense: number;
}

function Index({
    auth,
    balance,
    income,
    expense,
}: IndexProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<Period | undefined>(undefined);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <h5>هلا {auth.user.name}</h5>
                <PeriodSelector
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                    monthStartDay={auth.tenant.month_start_day}
                />
            </header>
            <main className="space-y-4">

                <Card>
                    <CardHeader>
                        <CardDescription>إجمالي الرصيد</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MoneyLabel amount={balance} size='lg' />
                    </CardContent>
                </Card>

                {/* <section className="grid grid-cols-2 gap-2">
                    <Card>
                        <CardHeader>
                            <CardDescription className="flex gap-1">
                                <span>
                                    الإيرادات
                                </span>
                                <Icon icon="material-symbols:arrow-back-2-outline-rounded" className="text-green-500 rotate-270 size-4" />
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MoneyLabel amount={income} size='md' />
                        </CardContent>
                    </Card>
                </section> */}

                <IncomeExpense />

            </main>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Index;
