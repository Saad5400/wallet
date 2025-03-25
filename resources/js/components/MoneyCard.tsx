import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MoneyLabel } from "@/components/MoneyLabel";
import { Area, AreaChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

// Define the chart data interface
interface ChartData {
    month: number;
    [key: string]: number;
}

// Define the props interface
interface MoneyCardProps {
    description: string;
    color: string;
    amount: number;
    chartData: ChartData[];
    dataKey: string; // Key for the chart data (e.g., 'balance', 'income', 'expense')
    size: 'lg' | 'md';
    icon?: JSX.Element; // Optional icon
}

// MoneyCard component
export function MoneyCard({
    description,
    color,
    amount,
    chartData,
    dataKey,
    size,
    icon,
}: MoneyCardProps) {
    return (
        <Card className="relative">
            <div className="absolute bottom-1 mb-0 opacity-75 w-full h-[80%] start-0">
                <ChartContainer config={{}} className="w-full h-[4.5rem]">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 2 }}
                    >
                        <defs>
                            <linearGradient id={`fill${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey={dataKey}
                            type="natural"
                            fill={`url(#fill${dataKey})`}
                            fillOpacity={0.4}
                            stroke={color}
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
            <CardHeader>
                <CardDescription className="flex gap-1">
                    <span>{description}</span>
                    {icon}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MoneyLabel amount={amount} size={size} />
            </CardContent>
        </Card>
    );
}