export function isUrl(path: string): boolean {
    const reg =
      /^(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?(\/#\/)?(?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
    return reg.test(path)
  }

  export function isNull(val: unknown): val is null {
    return val === null
  }
  export function isDef<T = unknown>(val?: T): val is T {
    return typeof val !== 'undefined'
  }
  export function isNullOrUnDef(val: unknown): val is null | undefined {
    return typeof val === 'undefined' || isNull(val)
  }