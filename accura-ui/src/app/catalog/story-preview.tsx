"use client"

import * as React from "react"

/* Renders one story from a CSF module without Storybook running.

   The stories only import types from Storybook, so the module is plain React:
   meta.args merged with the story's args, the story's render (or the meta
   component), wrapped in the story's decorators and then the meta's, which is
   the order Storybook applies them. What this does not reproduce is anything
   Storybook itself supplies: the preview decorator (theme class), play
   functions and addon parameters. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CsfModule = Record<string, any>

function resolve(mod: CsfModule, exportName: string) {
  const meta = mod.default ?? {}
  const story = mod[exportName] ?? {}
  const args = { ...meta.args, ...story.args }
  return {
    args,
    context: {
      args,
      argTypes: meta.argTypes ?? {},
      parameters: { ...meta.parameters, ...story.parameters },
      globals: {},
      viewMode: "story",
      name: exportName,
    },
    render: story.render ?? meta.render,
    Component: meta.component,
    // Innermost first: the story's own, then the meta's. The last one is outermost.
    decorators: [...(story.decorators ?? []), ...(meta.decorators ?? [])],
  }
}

/* One static component renders every layer. A decorator receives `Layer` as
   its Story; the context tells that inner Layer which depth it is at, so no
   component is ever created during render. */
const LayerContext = React.createContext<{ mod: CsfModule; exportName: string; level: number } | null>(null)

function Layer() {
  const at = React.useContext(LayerContext)
  if (!at) return null
  const { mod, exportName, level } = at
  const { args, context, render, Component, decorators } = resolve(mod, exportName)
  if (level < decorators.length) {
    const decorate = decorators[decorators.length - 1 - level]
    return (
      <LayerContext.Provider value={{ mod, exportName, level: level + 1 }}>
        {decorate(Layer, context)}
      </LayerContext.Provider>
    )
  }
  if (render) return render(args, context)
  return Component ? <Component {...args} /> : null
}

export function storyLayout(mod: CsfModule, exportName: string): string | undefined {
  return mod[exportName]?.parameters?.layout ?? mod.default?.parameters?.layout
}

class PreviewBoundary extends React.Component<
  { children: React.ReactNode; resetKey: string },
  { error: Error | null }
> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null })
  }
  render() {
    if (this.state.error)
      return (
        <p className="p-[var(--spacing-component-md)] text-xs text-[var(--color-text-invalid)]">
          This story did not render outside Storybook: {this.state.error.message}
        </p>
      )
    return this.props.children
  }
}

export function StoryPreview({ mod, exportName }: { mod: CsfModule; exportName: string }) {
  return (
    <PreviewBoundary resetKey={exportName}>
      <LayerContext.Provider value={{ mod, exportName, level: 0 }}>
        <Layer />
      </LayerContext.Provider>
    </PreviewBoundary>
  )
}
