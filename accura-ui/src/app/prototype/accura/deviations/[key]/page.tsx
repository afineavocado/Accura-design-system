"use client"

import { use } from "react"

import { DeviationDetail } from "../deviation-detail"
import { useDeviation } from "../store"
import { Unbuilt } from "../unbuilt"

export default function DeviationDetailPage({
  params,
}: {
  params: Promise<{ key: string }>
}) {
  const { key } = use(params)
  const record = useDeviation(key)

  if (!record)
    return (
      <Unbuilt
        name="That deviation"
        detail="but no seeded record matches this address. The registry lists every record in the prototype."
      />
    )

  return <DeviationDetail record={record} />
}
