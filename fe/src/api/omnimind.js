const API_BASE = 'https://omnimind-api.vercel.app'

const request = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    let message = `Request gagal (${res.status})`

    try {
      const body = await res.json()
      if (body && body.error) message = body.error
    } catch {
      message = `Request gagal (${res.status})`
    }

    throw new Error(message)
  }

  return res.json()
}

// GET /api/tools
export const getTools = async ({ category } = {}) => {
  const query = new URLSearchParams()
  if (category) query.append('category', category)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const json = await request(`/api/tools${suffix}`)

  return json.data || []
}

// GET /api/tools/:id
export const getTool = async (id) => request(`/api/tools/${id}`)

// GET /api/categories
export const getCategories = async () => {
  const json = await request('/api/categories')

  return json.data || []
}
