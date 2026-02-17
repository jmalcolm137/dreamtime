import { streamText, convertToModelMessages } from 'ai'

export async function POST(req: Request) {
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

  let childName = 'the child'
  let childAge = 6
  let interests: string[] = []
  let theme = 'a magical adventure'

  try {
    const data = JSON.parse(userText)
    childName = data.childName ?? childName
    childAge = data.childAge ?? childAge
    interests = data.interests ?? interests
    theme = data.theme ?? theme
  } catch {
    theme = userText || theme
  }

  const interestsList = interests.length > 0 ? interests.join(', ') : 'adventures'

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: `You are a master storyteller who writes enchanting, age-appropriate bedtime stories for children. 
Your stories are warm, imaginative, and always have a gentle, positive ending that helps children feel safe and sleepy.
You write in a soothing narrative style with vivid but calming imagery.
Stories should be around 400-600 words, broken into short paragraphs.
Always make the child the hero of their own story.
Never include anything scary, violent, or inappropriate.
Adjust vocabulary and complexity to be appropriate for the child's age.`,
    prompt: `Write a bedtime story for ${childName}, who is ${childAge} years old.
${childName} loves: ${interestsList}.
The theme of tonight's story is: "${theme}".

Make ${childName} the main character. Weave their interests naturally into the adventure.
End the story on a cozy, sleepy note that encourages sweet dreams.`,
  })

  return result.toUIMessageStreamResponse()
}
