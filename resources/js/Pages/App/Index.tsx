import AppLayout from "./AppLayout";
import { PageProps, Period } from "@/types";
import React, { useState } from "react";
import PeriodSelector from "./PeriodSelector";
import { Icon } from "@iconify/react/dist/iconify.js";
import { MoneyCard } from "@/components/MoneyCard";

interface IndexProps extends PageProps {
    balance: number;
    income: number;
    expense: number;
}

function Index({ auth, balance, income, expense }: IndexProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<Period | undefined>(undefined);

    // Chart data for balance
    const balanceChartData = [
        { month: 1, balance: 1000 },
        { month: 2, balance: 1200 },
        { month: 3, balance: 1500 },
        { month: 4, balance: 1300 },
        { month: 5, balance: 1600 },
        { month: 6, balance: 1800 },
    ];

    // Chart data for income
    const incomeChartData = [
        { month: 1, income: 100 },
        { month: 2, income: 500 },
        { month: 3, income: 0 },
        { month: 4, income: 500 },
        { month: 5, income: 0 },
        { month: 6, income: 0 },
    ];

    // Chart data for expense
    const expenseChartData = [
        { month: 1, expense: 100 },
        { month: 2, expense: 150 },
        { month: 3, expense: 200 },
        { month: 4, expense: 180 },
        { month: 5, expense: 220 },
        { month: 6, expense: 250 },
    ];

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
                <MoneyCard
                    description="إجمالي الرصيد"
                    color="var(--primary)"
                    amount={balance}
                    chartData={balanceChartData}
                    dataKey="balance"
                    size="lg"
                />
                <section className="grid grid-cols-2 gap-4">
                    <MoneyCard
                        description="الإيرادات"
                        color="var(--success)"
                        amount={income}
                        chartData={incomeChartData}
                        dataKey="income"
                        size="md"
                    />
                    <MoneyCard
                        description="المصروفات"
                        color="var(--destructive)"
                        amount={expense}
                        chartData={expenseChartData}
                        dataKey="expense"
                        size="md"
                    />
                </section>
            </main>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Index;