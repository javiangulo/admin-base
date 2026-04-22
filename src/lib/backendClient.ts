type QueryResult<T = unknown> = {
  data: T
  error: null
}

const createId = () =>
  `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

class QueryBuilder {
  private payload: unknown = null
  private singleResult = false
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select'

  select(_columns?: string) {
    this.operation = 'select'
    return this
  }

  insert(payload: unknown) {
    this.operation = 'insert'
    this.payload = payload
    return this
  }

  update(payload: unknown) {
    this.operation = 'update'
    this.payload = payload
    return this
  }

  delete() {
    this.operation = 'delete'
    return this
  }

  eq(_field: string, _value: unknown) {
    return this
  }

  gte(_field: string, _value: unknown) {
    return this
  }

  lte(_field: string, _value: unknown) {
    return this
  }

  in(_field: string, _values: unknown[]) {
    return this
  }

  not(_field: string, _operator: string, _value: unknown) {
    return this
  }

  or(_filters: string) {
    return this
  }

  filter(_field: string, _operator: string, _value: unknown) {
    return this
  }

  order(_field: string, _options?: {ascending?: boolean}) {
    return this
  }

  limit(_value: number) {
    return this
  }

  single() {
    this.singleResult = true
    return this
  }

  then<TResult1 = QueryResult<any>, TResult2 = never>(
    onfulfilled?:
      | ((value: QueryResult<any>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.resolve().then(onfulfilled as any, onrejected as any)
  }

  private async resolve(): Promise<QueryResult<any>> {
    if (this.operation === 'select') {
      return {
        data: this.singleResult ? null : [],
        error: null,
      }
    }

    if (this.operation === 'delete') {
      return {
        data: this.singleResult ? null : [],
        error: null,
      }
    }

    const base =
      this.payload &&
      typeof this.payload === 'object' &&
      !Array.isArray(this.payload)
        ? this.payload
        : {}

    const record = {
      id: createId(),
      ...(base as Record<string, unknown>),
    }

    return {
      data: this.singleResult ? record : [record],
      error: null,
    }
  }
}

const channelFactory = () => {
  const channel = {
    on: (..._args: unknown[]) => channel,
    subscribe: (..._args: unknown[]) => channel,
  }
  return channel
}

const backendClient = {
  from: (_table: string) => new QueryBuilder(),
  rpc: async (_fn: string, _args?: Record<string, unknown>) => ({
    data: null,
    error: null,
  }),
  channel: (_name: string) => channelFactory(),
  removeChannel: (_channel: unknown) => undefined,
  storage: {
    from: (_bucket: string) => ({
      upload: async (
        path: string,
        _file: File,
        _options?: Record<string, unknown>,
      ) => ({
        data: {path},
        error: null,
      }),
      remove: async (_paths: string[]) => ({error: null}),
      getPublicUrl: (path: string) => ({
        data: {publicUrl: `/uploads/${path}`},
      }),
    }),
  },
}

export default backendClient
