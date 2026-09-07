import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Table, TableBody, TableCaption, TableCell,
  TableFooter, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUp, ArrowDown, Ellipsis, TrendingUp, TrendingDown } from 'lucide-react';

// Source: table.meta.json — Figma verified 124:8531 / 105:25960 / 105:29158
//
// Tokens:
//   Container: border/default · radius/base · overflow-hidden (caller wraps Table)
//   Header/Footer row: bg color/surface/raised
//   TableHead: text color/surface/raised/foreground · text-xs font-medium · h-12 py-3 px-4
//   TableCell: text color/surface/default/foreground · py-3 px-4
//   TableRow hover: bg color/background/accent
//   TableRow selected: bg color/background/accent + border-l-2 color/brand/primary
//   Spacing: Tailwind utilities (py-3=12px, px-4=16px, h-12=48px, h-10=40px)
//
// NOTE: Table container border/radius applied by wrapping div, not by Table itself.

const meta = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// Container helper — applies border/radius per spec
const TableContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-[var(--radius-base)] border border-[var(--color-border-default)] overflow-hidden w-full">
    {children}
  </div>
);

const invoices = [
  { id: "INV-001", status: "Paid",    method: "Credit card",   amount: "$250.00" },
  { id: "INV-002", status: "Pending", method: "Bank transfer", amount: "$150.00" },
  { id: "INV-003", status: "Failed",  method: "PayPal",        amount: "$350.00" },
];

// ─── Basic — text cells + caption + footer ─────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableCaption>A list of recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Invoice</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col">Payment method</TableHead>
            <TableHead scope="col" className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium">{inv.id}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell>{inv.method}</TableCell>
              <TableCell className="text-right">{inv.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right font-medium">$750.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  ),
};

// ─── With sort indicators ──────────────────────────────────────────────────────
// Sort=Asc/Desc are visual-only — wire to TanStack Table for actual sorting.

export const WithSort: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">
              <button className="inline-flex items-center gap-1 hover:text-[var(--color-surface-raised-foreground)]" aria-sort="ascending">
                Invoice <ArrowUp className="h-3 w-3" />
              </button>
            </TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col">
              <button className="inline-flex items-center gap-1 hover:text-[var(--color-surface-raised-foreground)]" aria-sort="descending">
                Amount <ArrowDown className="h-3 w-3" />
              </button>
            </TableHead>
            <TableHead scope="col">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium">{inv.id}</TableCell>
              <TableCell>
                <Badge variant={inv.status === "Paid" ? "success" : inv.status === "Pending" ? "warning" : "destructive"} shape="pill" size="md">
                  {inv.status}
                </Badge>
              </TableCell>
              <TableCell>{inv.amount}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

// ─── With row selection ────────────────────────────────────────────────────────
// State=Selected: bg color/background/accent + border-l-2 color/brand/primary

export const WithSelection: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-12">
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead scope="col">Invoice</TableHead>
            <TableHead scope="col">Amount</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv, i) => (
            <TableRow key={inv.id} data-state={i === 1 ? "selected" : undefined} aria-selected={i === 1}>
              <TableCell><Checkbox checked={i === 1} aria-label={`Select ${inv.id}`} /></TableCell>
              <TableCell className="font-medium">{inv.id}</TableCell>
              <TableCell>{inv.amount}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell><Button size="sm" variant="outline">Edit</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

// ─── With avatars and badges ───────────────────────────────────────────────────

const members = [
  { name: "Phuong Lam", role: "Lead Designer", status: "Active", initials: "PL" },
  { name: "Alex Johnson", role: "Engineering", status: "Away", initials: "AJ" },
  { name: "Sarah Chen", role: "Product", status: "Active", initials: "SC" },
];

export const WithAvatars: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Member</TableHead>
            <TableHead scope="col">Role</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.name}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm" className="shrink-0">
                    <AvatarFallback>{m.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{m.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-[var(--color-text-secondary)]">{m.role}</TableCell>
              <TableCell>
                <Badge variant={m.status === "Active" ? "success" : "warning"} shape="pill" size="md">{m.status}</Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

// ─── With trend indicators ─────────────────────────────────────────────────────

const metrics = [
  { metric: "Revenue",     value: "$12,450", change: "+8.2%",  up: true },
  { metric: "Users",       value: "2,841",   change: "+12.5%", up: true },
  { metric: "Churn rate",  value: "2.4%",    change: "-0.3%",  up: false },
  { metric: "Avg. ticket", value: "$43.20",  change: "-5.1%",  up: false },
];

export const WithTrends: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Metric</TableHead>
            <TableHead scope="col">Value</TableHead>
            <TableHead scope="col">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((m) => (
            <TableRow key={m.metric}>
              <TableCell className="font-medium">{m.metric}</TableCell>
              <TableCell>{m.value}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${m.up ? "text-[var(--color-text-success)]" : "text-[var(--color-text-invalid)]"}`}>
                  {m.up
                    ? <TrendingUp className="h-4 w-4 text-[var(--color-icon-success)]" />
                    : <TrendingDown className="h-4 w-4 text-[var(--color-icon-danger)]" />}
                  {m.change}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};
