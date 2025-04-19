import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import dayjs, { Dayjs } from 'dayjs';

type CategoryData = { name: string; total: number };

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
	return (
		<Card>
			<CardDescription>
				أعلى التصنيفات صرفا
			</CardDescription>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<ResponsiveContainer width="100%" height={data.length * 50}>
						<BarChart data={data} layout="vertical">
							<CartesianGrid horizontal={false} />
							<YAxis dataKey="name" type="category" hide />
							<XAxis dataKey="total" type="number" hide />
							<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
							<Bar dataKey="total" layout="vertical" fill="var(--destructive)" radius={4}>
								<LabelList dataKey="name" position="insideLeft" offset={100} className="fill-[--background]" fontSize={12} />
								<LabelList dataKey="total" position="insideRight" offset={-12} className="fill-foreground" fontSize={12} />
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default TopExpenseCategoriesChart;
