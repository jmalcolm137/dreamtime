import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

function getModel() {
  // DeepSeek (OpenAI-compatible API)
  if (process.env.DEEPSEEK_API_KEY) {
    const deepseek = createOpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    })
    return deepseek('deepseek-chat')
  }
  // Direct OpenAI API key
  if (process.env.OPENAI_API_KEY) {
    const provider = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return provider('gpt-4o-mini')
  }
  // Fall back to Vercel AI Gateway string (only works in Vercel environment)
  return 'openai/gpt-4o-mini' as const
}

export async function POST(req: Request) {
  console.log('[v0] ENV CHECK - DEEPSEEK_API_KEY set:', !!process.env.DEEPSEEK_API_KEY)
  console.log('[v0] ENV CHECK - OPENAI_API_KEY set:', !!process.env.OPENAI_API_KEY)
  console.log('[v0] ENV CHECK - AI_GATEWAY_API_KEY set:', !!process.env.AI_GATEWAY_API_KEY)

  // Check if any AI provider is configured
  if (!process.env.DEEPSEEK_API_KEY && !process.env.OPENAI_API_KEY && !process.env.AI_GATEWAY_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'No AI provider configured. Set DEEPSEEK_API_KEY or OPENAI_API_KEY in your .env.local file.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {

  const { messages } = await req.json()

  // Extract the user's message text which contains JSON with child info
  const lastUserMessage = [...messages].reverse().find(
    (m: { role: string }) => m.role === 'user'
  )

  let userText = ''
  if (lastUserMessage?.parts) {
    userText = lastUserMessage.parts
      .filter((p: { type: string }) => p.type === 'text')
      .map((p: { text: string }) => p.text)
      .join('')
  } else if (lastUserMessage?.content) {
    userText = typeof lastUserMessage.content === 'string'
      ? lastUserMessage.content
      : ''
  }

  interface ChildData {
    name: string
    age: number
    interests: string[]
  }

  let children: ChildData[] = []
  let theme = 'a magical adventure'

  try {
    const data = JSON.parse(userText)
    children = data.children ?? []
    theme = data.theme ?? theme
  } catch {
    theme = userText || theme
  }

  if (children.length === 0) {
    children = [{ name: 'the child', age: 6, interests: ['adventures'] }]
  }

  const isSingle = children.length === 1
  const youngestAge = Math.min(...children.map((c) => c.age))
  const allInterests = [...new Set(children.flatMap((c) => c.interests))]
  const interestsList = allInterests.length > 0 ? allInterests.join(', ') : 'adventures'
  const childNames = children.map((c) => c.name)
  const namesList = childNames.length === 1
    ? childNames[0]
    : childNames.slice(0, -1).join(', ') + ' and ' + childNames[childNames.length - 1]

  const childDescriptions = children
    .map((c) => `- ${c.name} (age ${c.age}, loves ${c.interests.length > 0 ? c.interests.join(', ') : 'adventures'})`)
    .join('\n')

  const result = streamText({
    model: getModel(),
    system: `You are a master storyteller who writes enchanting, age-appropriate bedtime stories for children. 
Your stories are warm, imaginative, and always have a gentle, positive ending that helps children feel safe and sleepy.
You write in a soothing narrative style with vivid but calming imagery.
Stories should be around 400-600 words, broken into short paragraphs.
Always make the ${isSingle ? 'child the hero of their own story' : 'children the heroes of the story together'}.
Never include anything scary, violent, or inappropriate.
Adjust vocabulary and complexity to be appropriate for age ${youngestAge}.`,
    prompt: `Write a bedtime story featuring ${isSingle ? 'this child' : 'these children as the main characters together'}:
${childDescriptions}

Their combined interests include: ${interestsList}.
The theme of tonight's story is: "${theme}".

Make ${namesList} the main ${isSingle ? 'character' : 'characters'}. Weave their individual interests naturally into the adventure${!isSingle ? ', showing them working together and supporting each other' : ''}.
End the story on a cozy, sleepy note that encourages sweet dreams.`,
  })

  return result.toUIMessageStreamResponse()

  } catch (error) {
    console.error('Story generation error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to generate story',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
