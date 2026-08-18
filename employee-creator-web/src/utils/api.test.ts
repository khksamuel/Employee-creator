import apiFetch, { ApiError } from './api'

const fetchMock = jest.fn()

describe('apiFetch', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it('requests the relative API path and returns a successful JSON response', async () => {
    const employee = { id: 1, firstname: 'Ada' }
    fetchMock.mockResolvedValue(response({ status: 200, json: employee }))

    await expect(apiFetch<typeof employee>('/employees/1')).resolves.toEqual(employee)
    expect(fetchMock).toHaveBeenCalledWith('/api/employees/1', {
      headers: { Accept: 'application/json' },
    })
  })

  it('preserves request options and headers for API mutations', async () => {
    fetchMock.mockResolvedValue(response({ status: 201, json: { id: 2 } }))

    await apiFetch('/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"firstname":"Grace"}',
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/employees', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: '{"firstname":"Grace"}',
    })
  })

  it('returns undefined for a successful no-content response', async () => {
    fetchMock.mockResolvedValue(response({ status: 204 }))

    await expect(apiFetch('/employees/1', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('throws an ApiError with the response status and message for failed requests', async () => {
    fetchMock.mockResolvedValue(response({ status: 404, text: 'Employee not found' }))

    await expect(apiFetch('/employees/99')).rejects.toEqual(
      expect.objectContaining({
        name: 'ApiError',
        status: 404,
        message: 'Employee not found',
      }),
    )
  })

  it('surfaces network failures when the API cannot be reached', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(apiFetch('/employees')).rejects.toThrow('Failed to fetch')
  })
})

function response({
  status,
  json,
  text = '',
}: {
  status: number
  json?: unknown
  text?: string
}): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(json),
    text: jest.fn().mockResolvedValue(text),
  } as unknown as Response
}
