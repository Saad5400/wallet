import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import moneyFormat from "@/lib/moneyFormat"


const chartData = [{
    income: 1260,
    expense: 800,
}]

const chartConfig = {
    desktop: {
        label: "الإيرادات",
        color: "var(--success)",
    },
    mobile: {
        label: "المصروفات",
        color: "var(--destructive)",
    },
} satisfies ChartConfig

function IncomeExpense() {

    const cashflow = chartData[0].income - chartData[0].expense;

    return (
        <Card>
            <CardHeader>
                <CardDescription>
                    الإيرادات والمصروفات
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    style={{ maxHeight: "8rem" }}
                    className="mx-auto"
                >
                    <RadialBarChart
                        style={{ width: "100%", maxHeight: "8rem" }}
                        data={chartData}
                        endAngle={180}
                        innerRadius={100}
                        outerRadius={140}
                        cy='90%'
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <>
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 16}
                                                        className="text-2xl fill-foreground"
                                                    >
                                                        {moneyFormat(Math.abs(cashflow))}
                                                        {cashflow >= 0 ? " +" : " -"}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 4}
                                                        className="fill-muted"
                                                    >
                                                        التدفق النقدي
                                                    </tspan>
                                                </text>
                                            </>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="income"
                            stackId="a"
                            fill="var(--success)"
                            cornerRadius={5}
                            label={{ position: 'insideStart', fill: 'var(--success-foreground)' }}
                        />
                        <RadialBar
                            dataKey="expense"
                            fill="var(--destructive)"
                            stackId="a"
                            cornerRadius={5}
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default IncomeExpense;
