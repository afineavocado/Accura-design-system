import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NorthwindShell } from './Shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Plus, Search, Ellipsis } from 'lucide-react';

// ─── Northwind — Orders (list) ────────────────────────────────────────────────
// Data-table screen: page header + toolbar (search + status filter) + table +
// pagination. Renders inside <NorthwindShell active="Orders">.

const meta = {
  title: 'Screens/Northwind/Orders',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type OrderStatus = 'Paid' | 'Pending' | 'Refunded' | 'Processing';
const statusVariant: Record<OrderStatus, 'success' | 'warning' | 'danger' | 'secondary'> = {
  Paid: 'success',
  Pending: 'warning',
  Refunded: 'danger',
  Processing: 'secondary',
};

const orders: { id: string; customer: string; status: OrderStatus; items: number; total: string; date: string }[] = [
  { id: '#1042', customer: 'Ada Lovelace', status: 'Paid', items: 3, total: '$320.00', date: 'Jun 17, 2026' },
  { id: '#1041', customer: 'Grace Hopper', status: 'Processing', items: 1, total: '$118.50', date: 'Jun 17, 2026' },
  { id: '#1040', customer: 'Katherine Johnson', status: 'Pending', items: 5, total: '$640.00', date: 'Jun 16, 2026' },
  { id: '#1039', customer: 'Margaret Hamilton', status: 'Paid', items: 1, total: '$59.00', date: 'Jun 16, 2026' },
  { id: '#1038', customer: 'Radia Perlman', status: 'Refunded', items: 2, total: '$210.00', date: 'Jun 15, 2026' },
  { id: '#1037', customer: 'Barbara Liskov', status: 'Paid', items: 4, total: '$412.00', date: 'Jun 15, 2026' },
  { id: '#1036', customer: 'Frances Allen', status: 'Processing', items: 2, total: '$98.00', date: 'Jun 14, 2026' },
  { id: '#1035', customer: 'Karen Sparck Jones', status: 'Paid', items: 1, total: '$45.50', date: 'Jun 14, 2026' },
  { id: '#1034', customer: 'Shafi Goldwasser', status: 'Pending', items: 6, total: '$780.00', date: 'Jun 13, 2026' },
  { id: '#1033', customer: 'Sophie Wilson', status: 'Paid', items: 2, total: '$160.00', date: 'Jun 13, 2026' },
];

function OrdersContent() {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-lg)]">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-[var(--color-background-default-foreground)]">Orders</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">128 orders</p>
        </div>
        <Button>
          <Plus className="size-4" aria-hidden="true" />
          Add order
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-[var(--spacing-component-sm)]">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-[var(--spacing-component-md)] top-1/2 size-4 -translate-y-1/2 text-[var(--color-icon-default)]" aria-hidden="true" />
          <Input placeholder="Search orders…" className="pl-9" />
        </div>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-10" />
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
                <TableCell className="text-right">{o.items}</TableCell>
                <TableCell className="text-right">{o.total}</TableCell>
                <TableCell className="text-[var(--color-text-secondary)]">{o.date}</TableCell>
                <TableCell>
                  <button
                    aria-label={`Actions for order ${o.id}`}
                    className="flex size-7 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-icon-default)] hover:bg-[var(--color-background-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                  >
                    <Ellipsis className="size-4" aria-hidden="true" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer: count + pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">Showing 1–10 of 128</p>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">13</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <NorthwindShell active="Orders" title="Orders">
      <OrdersContent />
    </NorthwindShell>
  ),
};
