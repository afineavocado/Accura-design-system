import { redirect } from "next/navigation"

// The app serves the CAPA prototype only — there is no separate home screen.
// Without this, "/" returns 404 and an agent arriving at the dev server
// reasonably concludes the app is broken and starts building a landing page.
// Component documentation lives in Storybook (npm run storybook), not here.
export default function RootPage() {
  redirect("/prototype/accura/capa")
}
