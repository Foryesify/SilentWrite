import { computed, reactive, watch } from 'vue'

const STORAGE_KEY = 'silentwrite.library'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) => item && typeof item.id === 'string' && typeof item.content === 'string',
    )
  } catch {
    return []
  }
}

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function titleFromContent(content) {
  const line = content.split(/\r?\n/).find((part) => part.trim())
  if (!line) return ''
  return line
    .replace(/^#{1,6}\s+/, '')
    .replace(/^[*_`~>|-]+\s*/, '')
    .trim()
    .slice(0, 80)
}

const state = reactive({
  essays: load(),
})

watch(
  () => state.essays,
  (essays) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(essays))
  },
  { deep: true },
)

export const essays = computed(() =>
  [...state.essays].sort((a, b) => b.updatedAt - a.updatedAt),
)

export function getEssay(id) {
  return state.essays.find((essay) => essay.id === id) ?? null
}

export function createEssay({ title = '', content = '' } = {}) {
  const now = Date.now()
  const essay = {
    id: uid(),
    title: title.trim(),
    content,
    createdAt: now,
    updatedAt: now,
  }
  state.essays.push(essay)
  return essay
}

export function updateEssay(id, patch) {
  const essay = getEssay(id)
  if (!essay) return null

  if (typeof patch.title === 'string') essay.title = patch.title.trim()
  if (typeof patch.content === 'string') {
    essay.content = patch.content
    if (!essay.title) {
      essay.title = titleFromContent(patch.content)
    }
  }

  essay.updatedAt = Date.now()
  return essay
}

export function deleteEssay(id) {
  const index = state.essays.findIndex((essay) => essay.id === id)
  if (index === -1) return false
  state.essays.splice(index, 1)
  return true
}

export function displayTitle(essay, untitled) {
  const title = essay?.title?.trim()
  if (title) return title
  const derived = titleFromContent(essay?.content ?? '')
  return derived || untitled
}
