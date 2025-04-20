import AppLayout from "./AppLayout";
import { PageProps, Period, Record } from "@/types";
import React, { useState, useEffect } from "react";
import PeriodSelector from "./PeriodSelector";
import { MoneyCard } from "@/components/MoneyCard";
import dayjs from "dayjs";
import TopExpenseCategoriesChart from "./Categories/TopExpenseCategoriesChart";
import LatestRecords from "./Records/LatestRecords";
import { router } from '@inertiajs/react';

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
	latestRecords: Array<Record & {
		account: { name: string };
		category?: { name: string };
		subCategory?: { name: string };
	}>;
}

function Index({
	auth,
	balance,
	income,
	expense,
	defaultPeriod,
	expenseCategories,
	latestRecords,
}: IndexProps) {
	// Initialize period from URL parameters or default period
	const [selectedPeriod, setSelectedPeriod] = useState<Period>(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const startDateParam = searchParams.get('startDate');
		const endDateParam = searchParams.get('endDate');
		
		// If URL has valid date parameters, use them; otherwise use default
		if (startDateParam && endDateParam) {
			return {
				startDate: dayjs(startDateParam),
				endDate: dayjs(endDateParam)
			};
		}
		
		return {
			startDate: dayjs(defaultPeriod.startDate),
			endDate: dayjs(defaultPeriod.endDate)
		};
	});

	// Update data when period changes
	const handlePeriodChange = (newPeriod: Period) => {
		setSelectedPeriod(newPeriod);
		
		// The URL update is handled in the PeriodSelector component now
		// The backend will fetch new data when the page refreshes with new parameters
	};

	return (
		<div className="space-y-4">
			<header className="flex items-center justify-between">
				<h5>هلا {auth.user.name}</h5>
				<PeriodSelector
					selectedPeriod={selectedPeriod}
					setSelectedPeriod={handlePeriodChange}
					monthStartDay={auth.tenant.month_start_day}
					defaultPeriod={{
						startDate: dayjs(defaultPeriod.startDate),
						endDate: dayjs(defaultPeriod.endDate)
					}}
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
				<section>
					<LatestRecords records={latestRecords} />
				</section>
			</main>
		</div>
	);
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Index;