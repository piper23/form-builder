function shortId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8)
}

export const ids = {
  template: () => `tmpl_${shortId()}`,
  field: () => `fld_${shortId()}`,
  condition: () => `cnd_${shortId()}`,
  response: () => `rsp_${shortId()}`,
  option: () => `opt_${shortId()}`,
}
