import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChatBubble, ChatLog, TypingIndicator, SuggestionChip, ChatInput } from '@/components/ui/chat-bubble'

const meta = {
  title: 'Chat/ChatBubble',
  component: ChatBubble,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    role: {
      control: 'select',
      options: ['bot', 'user'],
      description: 'Who sent the message — determines alignment and color',
    },
    timestamp: {
      control: 'text',
      description: 'Timestamp string shown below the bubble',
    },
    avatarFallback: {
      control: 'text',
      description: 'Fallback initials for bot avatar',
    },
  },
  args: {
    role: 'bot',
    children: 'Hi there! I\'m here to answer questions about my work and experience.',
    timestamp: '2:34 PM',
    avatarFallback: 'VD',
  },
} satisfies Meta<typeof ChatBubble>

export default meta
type Story = StoryObj<typeof meta>

// ─── Single bubbles ────────────────────────────────────────────────────────────

export const BotMessage: Story = {
  args: {
    role: 'bot',
    children: 'Hi there! I\'m here to answer questions about my work and experience.',
    timestamp: '2:34 PM',
    avatarFallback: 'VD',
  },
}

export const UserMessage: Story = {
  args: {
    role: 'user',
    children: 'What tools do you use?',
    timestamp: '2:35 PM',
  },
}

export const LongBotMessage: Story = {
  args: {
    role: 'bot',
    children: 'I\'ve been designing digital products for over 5 years, working across mobile and web. My core tools are Figma for design, and I\'m comfortable reading and writing React + Tailwind for prototyping and handoff.',
    timestamp: '2:36 PM',
    avatarFallback: 'VD',
  },
}

// ─── Typing indicator ──────────────────────────────────────────────────────────

export const Typing: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <ChatBubble role="user" timestamp="2:35 PM">
        What tools do you use?
      </ChatBubble>
      <TypingIndicator avatarFallback="VD" />
    </div>
  ),
}

// ─── Suggestion chips ──────────────────────────────────────────────────────────

export const WithSuggestions: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <ChatBubble role="bot" timestamp="2:34 PM" avatarFallback="VD">
        Hi! I&apos;m Vu Ngoc Diep. Ask me anything about my work 👋
      </ChatBubble>
      <div className="flex flex-wrap gap-2 pl-10">
        <SuggestionChip>About me</SuggestionChip>
        <SuggestionChip>My process</SuggestionChip>
        <SuggestionChip>Tools I use</SuggestionChip>
        <SuggestionChip>Contact</SuggestionChip>
      </div>
    </div>
  ),
}

// ─── Chat input ────────────────────────────────────────────────────────────────

export const Input: Story = {
  render: () => (
    <div className="max-w-md">
      <ChatInput placeholder="Ask me anything..." />
    </div>
  ),
}

// ─── Full conversation ─────────────────────────────────────────────────────────

export const FullConversation: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<{ role: 'bot' | 'user'; text: string; time: string }[]>([
      { role: 'bot', text: 'Hi! I\'m Vu Ngoc Diep. Ask me anything about my work 👋', time: '2:34 PM' },
    ])
    const [typing, setTyping] = React.useState(false)

    const answers: Record<string, string> = {
      'about me': 'I\'m a product designer based in Singapore with 5+ years of experience across mobile and web.',
      'tools': 'Figma for design, React + Tailwind for prototyping. I also built my own design system — Agentic UI.',
      'process': 'I start with user research, move to wireframes, then high-fidelity. I prototype in code to test real interactions.',
      'contact': 'Best way to reach me is phuonglam.design@gmail.com — I\'d love to chat!',
    }

    function getAnswer(q: string): string {
      const lower = q.toLowerCase()
      for (const [key, val] of Object.entries(answers)) {
        if (lower.includes(key)) return val
      }
      return "Hmm, I don\'t have an answer for that yet — try asking about my process, tools, or contact 😊"
    }

    function handleSend(text: string) {
      setMessages(m => [...m, { role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { role: 'bot', text: getAnswer(text), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      }, 1200)
    }

    const suggestions = ['About me', 'Tools I use', 'My process', 'Contact']

    return (
      <div className="flex flex-col gap-4 max-w-md p-4 bg-[var(--color-background-default)] rounded-[var(--radius-xl)] border border-[var(--color-border-default)]" style={{ minHeight: 420 }}>
        {/* Messages — ChatLog provides role="log" aria-live so new messages are announced */}
        <ChatLog className="flex-1">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} timestamp={m.time} avatarFallback="VD">
              {m.text}
            </ChatBubble>
          ))}
          {typing && <TypingIndicator avatarFallback="VD" />}
        </ChatLog>

        {/* Suggestions */}
        {!typing && messages[messages.length - 1]?.role === 'bot' && (
          <div className="flex flex-wrap gap-2 pl-10">
            {suggestions.map(s => (
              <SuggestionChip key={s} onClick={() => handleSend(s)}>{s}</SuggestionChip>
            ))}
          </div>
        )}

        {/* Input */}
        <ChatInput placeholder="Ask me anything..." onSend={handleSend} />
      </div>
    )
  },
}
