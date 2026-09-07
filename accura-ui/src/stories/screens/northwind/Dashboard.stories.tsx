import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NorthwindShell } from './Shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CircleCheck,
  Clock,
} from 'lucide-react';

// ─── Northwind — Dashboard ────────────────────────────────────────────────────
// Sales overview: KPI cards + recent orders table + activity feed.
// Renders INSIDE the shared <NorthwindShell> — the shell is not re-implemented here.

const meta = {
  title: 'Screens/Northwind/Dashboard',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const metrics = [
  { label: 'Total revenue', value: '$128,420', change: '+12.5%', up: true, icon: DollarSign },
  { label: 'Orders', value: '1,284', change: '+8.2%', up: true, icon: ShoppingCart },
  { label: 'New customers', value: '342', change: '-3.1%', up: false, icon: Users },
  { label: 'Avg. order value', value: '$99.40', change: '+2.4%', up: true, icon: Package },
];

type OrderStatus = 'Paid' | 'Pending' | 'Refunded' | 'Processing';
const statusVariant: Record<OrderStatus, 'success' | 'warning' | 'danger' | 'secondary'> = {
  Paid: 'success',
  Pending: 'warning',
  Refunded: 'danger',
  Processing: 'secondary',
};

const orders: { id: string; customer: string; status: OrderStatus; total: string; date: string }[] = [
  { id: '#1042', customer: 'Ada Lovelace', status: 'Paid', total: '$320.00', date: 'Jun 17' },
  { id: '#1041', customer: 'Grace Hopper', status: 'Processing', total: '$118.50', date: 'Jun 17' },
  { id: '#1040', customer: 'Katherine Johnson', status: 'Pending', total: '$640.00', date: 'Jun 16' },
  { id: '#1039', customer: 'Margaret Hamilton', status: 'Paid', total: '$59.00', date: 'Jun 16' },
  { id: '#1038', customer: 'Radia Perlman', status: 'Refunded', total: '$210.00', date: 'Jun 15' },
];

const activity = [
  { icon: CircleCheck, text: 'Order #1042 marked as paid', time: '5m ago' },
  { icon: ShoppingCart, text: 'New order #1041 from Grace Hopper', time: '22m ago' },
  { icon: Users, text: 'Katherine Johnson created an account', time: '1h ago' },
  { icon: Clock, text: 'Order #1040 awaiting payment', time: '3h ago' },
];

function DashboardContent() {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-lg)]">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-[var(--spacing-component-lg)] sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          const Trend = m.up ? TrendingUp : TrendingDown;
          return (
            <Card key={m.label}>
              <CardContent className="gap-[var(--spacing-component-xs)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--color-text-secondary)]">{m.label}</p>
                  <Icon className="size-4 text-[var(--color-icon-default)]" aria-hidden="true" />
                </div>
                <p className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">{m.value}</p>
                <p
                  className={
                    'flex items-center gap-1 text-xs ' +
                    (m.up ? 'text-[var(--color-text-success)]' : 'text-[var(--color-text-invalid)]')
                  }
                >
                  <Trend className="size-3.5" aria-hidden="true" />
                  {m.change} vs last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 2/3 + 1/3 split */}
      <div className="grid grid-cols-1 gap-[var(--spacing-component-lg)] lg:grid-cols-3">
        {/* Recent orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Table gets its own border + radius */}
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.id}</TableCell>
                      <TableCell>{o.customer}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{o.total}</TableCell>
                      <TableCell className="text-right text-[var(--color-text-secondary)]">{o.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-[var(--spacing-component-md)]">
            {activity.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-[var(--spacing-component-sm)]">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-icon-default)]">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-[var(--color-background-default-foreground)]">{a.text}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">{a.time}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <NorthwindShell active="Dashboard" title="Dashboard">
      <DashboardContent />
    </NorthwindShell>
  ),
};
