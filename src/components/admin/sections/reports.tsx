import { FC, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, BarChart2, TrendingUp, Car, Clock } from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { reportsService } from '@/lib/apis/api.reports'
import { format, subDays } from 'date-fns'
import { toast } from 'sonner'
import { DateRangePicker } from '@/components/ui/date-range-picker'

export const Reports: FC = () => {
    // Set default date range to last 30 days
    const [dateRange, setDateRange] = useState({
        from: subDays(new Date(), 30),
        to: new Date()
    })

    // Fetch all report data
    const { data: summary, isLoading: isLoadingSummary } = useQuery({
        queryKey: ['reports', 'summary', dateRange],
        queryFn: () =>
            reportsService.getSummary({
                start_date: format(dateRange.from, 'yyyy-MM-dd'),
                end_date: format(dateRange.to, 'yyyy-MM-dd')
            })
    })

    const { data: dailyReservations, isLoading: isLoadingReservations } = useQuery({
        queryKey: ['reports', 'daily-reservations', dateRange],
        queryFn: () =>
            reportsService.getDailyReservations({
                start_date: format(dateRange.from, 'yyyy-MM-dd'),
                end_date: format(dateRange.to, 'yyyy-MM-dd')
            })
    })

    const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
        queryKey: ['reports', 'revenue', dateRange],
        queryFn: () =>
            reportsService.getRevenueData({
                start_date: format(dateRange.from, 'yyyy-MM-dd'),
                end_date: format(dateRange.to, 'yyyy-MM-dd')
            })
    })

    const { data: peakHoursData, isLoading: isLoadingPeakHours } = useQuery({
        queryKey: ['reports', 'peak-hours', dateRange],
        queryFn: () =>
            reportsService.getPeakHours({
                start_date: format(dateRange.from, 'yyyy-MM-dd'),
                end_date: format(dateRange.to, 'yyyy-MM-dd')
            })
    })

    const isLoading =
        isLoadingSummary || isLoadingReservations || isLoadingRevenue || isLoadingPeakHours

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="text-muted-foreground">Loading reports...</div>
            </div>
        )
    }

    const handleExport = () => {
        // TODO: Implement export functionality
        toast.info('Export functionality coming soon!')
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Reports & Analytics</h3>
                <div className="flex gap-2">
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₱{summary?.total_reservations?.toLocaleString() ?? '0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {summary?.revenue_change
                                ? (summary.revenue_change > 0 ? '+' : '') + summary.revenue_change
                                : '0'}
                            % from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Reservations</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary?.daily_reservations ?? '0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {summary?.reservation_change
                                ? (summary.reservation_change > 0 ? '+' : '') +
                                  summary.reservation_change
                                : '0'}
                            % from last week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Parking Utilization</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary?.parking_utilization ?? '0'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {summary?.utilization_change
                                ? (summary.utilization_change > 0 ? '+' : '') +
                                  summary.utilization_change
                                : '0'}
                            % from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary?.average_duration ?? '0'}h
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {summary?.duration_change
                                ? (summary.duration_change > 0 ? '+' : '') + summary.duration_change
                                : '0'}
                            h from last month
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Daily Reservations</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyReservations}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => format(new Date(date), 'MMM d')}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        labelFormatter={(date) =>
                                            format(new Date(date), 'MMM d, yyyy')
                                        }
                                        formatter={(value) => [
                                            `${value} reservations`,
                                            'Reservations'
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="reservations"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => format(new Date(date), 'MMM yyyy')}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => `₱${value.toLocaleString()}`}
                                    />
                                    <Tooltip
                                        labelFormatter={(date) =>
                                            format(new Date(date), 'MMMM yyyy')
                                        }
                                        formatter={(value) => [
                                            `₱${value.toLocaleString()}`,
                                            'Revenue'
                                        ]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Peak Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={peakHoursData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                                    <Bar dataKey="usage" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
