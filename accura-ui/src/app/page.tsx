import { redirect } from "next/navigation"

// The app hosts three prototypes — CAPA, Documents and Training — reachable
// from the shared sidebar. There is no separate home screen; "/" lands on CAPA.
// Without this redirect "/" returns 404, and an agent arriving at the dev
// server reasonably concludes the app is broken and starts building a landing
// page. Component documentation lives in Storybook (npm run storybook).
//
// CATALOG_SITE=1 is set only on the separate catalog deployment, which serves
// this same app but should open on /catalog. The prototype routes stay
// reachable there: the catalog's template previews load them.
export default function RootPage() {
  redirect(process.env.CATALOG_SITE === "1" ? "/catalog" : "/prototype/accura/capa")
}
