import React, { useState, useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';

type CategoryData = { name: string; total: number; id?: number; subCategories?: SubCategoryData[] };
type SubCategoryData = { name: string; total: number; id: number };

interface TopExpenseCategoriesChartProps {
	data: CategoryData[];
	startDate: Dayjs;
	endDate: Dayjs;
}

const chartConfig: ChartConfig = {
	total: { label: 'Total', color: 'hsl(var(--destructive))' },
	label: { color: 'hsl(var(--background))' },
};

export function TopExpenseCategoriesChart({ data, startDate, endDate }: TopExpenseCategoriesChartProps) {
	// State to track the selected category and whether we're viewing subcategories
	const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

	// Memoize the subcategories data to avoid recalculating on every render
	const subCategoriesData = useMemo(() => {
		if (!selectedCategory || !selectedCategory.subCategories) return [];

		// Get top 6 subcategories by total expense
		return selectedCategory.subCategories
			.sort((a, b) => b.total - a.total)
			.slice(0, 6);
	}, [selectedCategory]);

	// Handle bar click to show subcategories
	const handleBarClick = (data: any) => {
		const category = data && data.activePayload && data.activePayload[0] ?
			data.activePayload[0].payload : null;

		if (category) {
			setSelectedCategory(category);
		}
	};

	// Handle back button click to return to main categories
	const handleBackClick = () => {
		setSelectedCategory(null);
	};

	return (
		<Card>
			<CardDescription className="flex items-center justify-between">
				{selectedCategory ? (
					<>
						<Button
							variant="ghost"
							className="flex items-center justify-center p-0 text-xs"
							onClick={handleBackClick}
						>
							<ArrowRight className="size-4" />
							<span>{selectedCategory.name} - التصنيفات الفرعية</span>
						</Button>
					</>
				) : (
					<span className='flex items-center justify-center h-10'>أعلى التصنيفات صرفا</span>
				)}
			</CardDescription>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<ResponsiveContainer
						width="100%"
						height={selectedCategory ? subCategoriesData.length * 50 : data.length * 50}
						minHeight={100}
					>
						<BarChart
							data={selectedCategory ? subCategoriesData : data}
							layout="vertical"
							onClick={selectedCategory ? undefined : handleBarClick}
						>
							<CartesianGrid horizontal={false} />
							<YAxis
								dataKey="name"
								type="category"
								axisLine={false}
								tickLine={false}
								orientation="left"
								tick={{ fontSize: 8, textAnchor: 'start', width: 130 }}
								width={90}
							/>
							<XAxis dataKey="total" type="number" hide />
							<Bar
								dataKey="total"
								layout="vertical"
								fill="var(--destructive)"
								radius={4}
								cursor={selectedCategory ? undefined : "pointer"}
							>
								<LabelList
									dataKey="total"
									position="insideRight"
									fontSize={10}
									offset={10}
									fill="var(--foreground)"
									style={{ textAnchor: 'middle' }}
								/>
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default TopExpenseCategoriesChart;
