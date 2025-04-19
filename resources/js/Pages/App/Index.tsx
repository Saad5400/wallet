import AppLayout from "./AppLayout";
import { PageProps, Period } from "@/types";
import React, { useState } from "react";
import PeriodSelector from "./PeriodSelector";
import { MoneyCard } from "@/components/MoneyCard";
import dayjs from "dayjs";
import TopExpenseCategoriesChart from "./Categories/TopExpenseCategoriesChart";

interface AmountWithChart {
	value: number;
	chartData: {
		month: string;
		[key: string]: number | string;
	}[];
}

// Define the subcategory data structure
interface SubCategoryData {
	id: number;
	name: string;
	total: number;
}

// Define the category data structure with subcategories
interface CategoryData {
	id: number;
	name: string;
	total: number;
	subCategories: SubCategoryData[];
}

type IndexProps = PageProps & {
	balance: AmountWithChart;
	income: AmountWithChart;
	expense: AmountWithChart;
	defaultPeriod: {
		startDate: string;
		endDate: string;
	};
	expenseCategories: CategoryData[];
}

function Index({
	auth,
	balance,
	income,
	expense,
	defaultPeriod,
	expenseCategories,
}: IndexProps) {
	const [selectedPeriod, setSelectedPeriod] = useState<Period>({
		startDate: dayjs(defaultPeriod.startDate),
		endDate: dayjs(defaultPeriod.endDate),
	});

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
					amount={balance.value}
					chartData={balance.chartData}
					dataKey="balance"
					size="lg"
				/>
				<section className="grid grid-cols-2 gap-4">
					<MoneyCard
						description="الإيرادات"
						color="var(--success)"
						amount={income.value}
						chartData={income.chartData}
						dataKey="income"
						size="md"
					/>
					<MoneyCard
						description="المصروفات"
						color="var(--destructive)"
						amount={expense.value}
						chartData={expense.chartData}
						dataKey="expense"
						size="md"
					/>
				</section>
				<section className="mt-4">
					<TopExpenseCategoriesChart
						data={expenseCategories}
						startDate={selectedPeriod.startDate}
						endDate={selectedPeriod.endDate}
					/>
				</section>
			</main>
		</div>
	);
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Index;