import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { validateGuideDoc } from '../../src/guide/schema'
import { readGuideFixture } from '../helpers/fixtures'

const REPO = new URL('../../', import.meta.url)
const CAMEL_CASE = /\b[a-z]+[A-Z]\w*/
const ANTITHESIS = /\bnot\b[^.]*\bbut\b|it'?s not\b/i

function parseGuide(text: string, label: string): Record<string, unknown> {
  const doc = JSON.parse(text) as unknown
  const result = validateGuideDoc(doc)
  if (!result.ok)
    throw new Error(`${label} is not a valid guide: ${JSON.stringify(result.error)}`)
  if (typeof doc !== 'object' || doc === null || Array.isArray(doc))
    throw new Error(`${label} is not a guide object`)
  return doc
}

function skillExample(): Record<string, unknown> {
  const skill = readFileSync(new URL('res/skill/tabthrough/SKILL.md', REPO), 'utf8')
  const blocks = [...skill.matchAll(/```json\r?\n([\s\S]*?)```/g)]
    .map(match => match[1] ?? '')
  for (const text of blocks) {
    try {
      const doc = JSON.parse(text) as unknown
      if (typeof doc === 'object' && doc !== null && !Array.isArray(doc) && 'version' in doc)
        return parseGuide(text, 'skill example')
    }
    catch {
      continue
    }
  }
  throw new Error('skill has no example guide')
}

function sessionIdleGit(): Record<string, unknown> {
  return parseGuide(
    readFileSync(new URL('.tabthrough.session-idle-git.guide.json', REPO), 'utf8'),
    'session-idle-git',
  )
}

type GuideWords = {
  readonly titles: readonly string[]
  readonly rationales: readonly string[]
  readonly notes: readonly string[]
}

function wordsOf(doc: Record<string, unknown>): GuideWords {
  const steps = Array.isArray(doc.steps) ? doc.steps : []
  const titles: string[] = []
  const rationales: string[] = []
  const notes: string[] = []
  for (const step of steps) {
    if (typeof step !== 'object' || step === null)
      continue
    const record = step as Record<string, unknown>
    if (typeof record.title === 'string')
      titles.push(record.title)
    if (typeof record.rationale === 'string')
      rationales.push(record.rationale)
    if (typeof record.notes === 'string')
      notes.push(record.notes)
  }
  return { titles, rationales, notes }
}

describe('golden examples stay in the writing voice', () => {
  it.each([
    ['skill example', skillExample],
    ['helper-consumer.guide.json', () => parseGuide(JSON.stringify(readGuideFixture('helper-consumer.guide.json')), 'helper-consumer')],
    ['.tabthrough.session-idle-git.guide.json', sessionIdleGit],
  ])('%s', (_label, load) => {
    const { titles, rationales, notes } = wordsOf(load())

    for (const rationale of rationales) {
      expect(rationale, rationale).not.toContain('`')
      expect(rationale, rationale).not.toMatch(CAMEL_CASE)
      expect(rationale.toLowerCase(), rationale).not.toContain('above')
    }

    for (const note of notes)
      expect(note.length, note).toBeLessThanOrEqual(480)

    for (const text of [...titles, ...rationales, ...notes])
      expect(text, text).not.toMatch(ANTITHESIS)
  })
})
