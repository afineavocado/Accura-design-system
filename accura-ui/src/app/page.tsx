import { redirect } from "next/navigation"

// The app hosts three prototypes — CAPA, Documents and Training — reachable
// from the shared sidebar. There is no separate home screen; "/" lands on CAPA.
// Without this redirect "/" returns 404, and an agent arriving at the dev
// server reasonably concludes the app is broken and starts building a landing
// page. Component documentation lives in Storybook (npm run storybook).
export default function RootPage() {
  redirect("/prototype/accura/capa")
}
