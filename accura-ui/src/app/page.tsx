import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Mail, Eye, Copy } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-12 flex flex-col gap-12">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agentic Design System</h1>
        <p className="text-muted-foreground mt-1">Token pipeline working — Figma → CSS → Components</p>
      </div>

      {/* Buttons */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Buttons — Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>

        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Buttons — Disabled state</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" disabled>Primary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
          <Button variant="outline" disabled>Outline</Button>
          <Button variant="ghost" disabled>Ghost</Button>
          <Button variant="destructive" disabled>Destructive</Button>
          <Button variant="link" disabled>Link</Button>
        </div>

        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Buttons — Sizes</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Badges — Brand (pill)</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="outline" shape="dashed">Dashed</Badge>
        </div>

        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Badges — Brand (rect)</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" shape="default">Default</Badge>
          <Badge variant="secondary" shape="default">Secondary</Badge>
          <Badge variant="destructive" shape="default">Destructive</Badge>
          <Badge variant="outline" shape="default">Outline</Badge>
        </div>

        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Badges — Status</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="blue">Blue</Badge>
          <Badge variant="online">Online</Badge>
          <Badge variant="offline">Offline</Badge>
          <Badge variant="notification">8</Badge>
        </div>

        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Badges — Sizes</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </section>

      {/* Inputs — States */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Inputs — States</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-2xl">

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="i-default">Default</Label>
            <Input id="i-default" placeholder="Placeholder text" />
            <p className="text-xs text-muted-foreground">Helper or description text</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="i-filled">Filled</Label>
            <Input id="i-filled" defaultValue="you@example.com" />
            <p className="text-xs text-muted-foreground">Helper or description text</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="i-disabled" className="opacity-50">Disabled</Label>
            <Input id="i-disabled" disabled placeholder="Disabled input" />
            <p className="text-xs text-muted-foreground opacity-50">Helper or description text</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="i-invalid">Invalid</Label>
            <Input id="i-invalid" aria-invalid="true" defaultValue="not-an-email" />
            <p className="text-xs text-destructive">Please enter a valid email address</p>
          </div>

        </div>
      </section>

      {/* Inputs — Addons */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Inputs — Addons</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-2xl">

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="i-leading">Leading icon</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input id="i-leading" className="pl-9" placeholder="Search…" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="i-trailing-icon">Trailing icon</Label>
            <div className="relative">
              <Input id="i-trailing-icon" className="pr-9" type="password" placeholder="Password" />
              <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="i-unit">Trailing unit</Label>
            <div className="relative flex items-center">
              <Input id="i-unit" className="pr-14" placeholder="0.00" />
              <span className="absolute right-3 text-sm text-muted-foreground pointer-events-none select-none">USD</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="i-btn">Trailing button</Label>
            <div className="relative flex items-center">
              <Input id="i-btn" className="pr-[72px]" defaultValue="https://acme.com/ref" readOnly />
              <Button size="sm" variant="outline" className="absolute right-1 h-7 gap-1 text-xs px-2">
                <Copy className="h-3 w-3" />Copy
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="i-email">Leading + type email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input id="i-email" className="pl-9" type="email" placeholder="you@example.com" />
            </div>
          </div>

        </div>
      </section>

      {/* Inputs — Textarea */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Inputs — Textarea</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-2xl">

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ta-default">Default</Label>
            <Textarea id="ta-default" placeholder="Write your message here…" />
            <p className="text-xs text-muted-foreground">Max 500 characters</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ta-filled">Filled</Label>
            <Textarea id="ta-filled" defaultValue="This is an example of filled textarea content. The value is visible in the filled state." />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ta-disabled" className="opacity-50">Disabled</Label>
            <Textarea id="ta-disabled" disabled placeholder="Disabled textarea" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ta-invalid">Invalid</Label>
            <Textarea id="ta-invalid" aria-invalid="true" placeholder="Write your message here…" />
            <p className="text-xs text-destructive">This field cannot be empty</p>
          </div>

        </div>
      </section>

      {/* Alerts */}
      <section className="flex flex-col gap-3 max-w-lg">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Alerts</h2>
        <Alert>
          <AlertTitle>Tokens connected</AlertTitle>
          <AlertDescription>
            Every color here comes from your Figma variables — exported as DTCG, built by Style Dictionary, loaded into Tailwind.
          </AlertDescription>
        </Alert>
      </section>

      {/* Token swatches */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Token swatches</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { label: "brand/primary", cls: "bg-primary" },
            { label: "brand/secondary", cls: "bg-secondary" },
            { label: "brand/destructive", cls: "bg-destructive" },
            { label: "surface/muted", cls: "bg-muted" },
            { label: "surface/default", cls: "bg-card border border-border" },
            { label: "border/default", cls: "bg-border" },
          ].map(({ label, cls }) => (
            <div key={label} className="flex flex-col gap-1.5 items-center">
              <div className={`w-14 h-14 rounded-lg ${cls}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
