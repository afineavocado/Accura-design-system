"use client"

import { use } from "react"

import { DeviationDetail } from "../deviation-detail"
import { seeds } from "../mock-data"
import { Unbuilt } from "../unbuilt"

export default function DeviationDetailPage({
  params,
}: {
  params: Promise<{ key: string }>
}) {
  const { key } = use(params)
  const record = seeds.find((candidate) => candidate.key === key)

  if (!record)
    return (
      <Unbuilt
        name="That deviation"
        detail="— no seeded record matches this address. The registry lists every record in the prototype."
      />
    )

  return <DeviationDetail record={record} />
}
