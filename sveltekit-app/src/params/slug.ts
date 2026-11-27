import type {ParamMatcher} from '@sveltejs/kit'

export const match = ((param: string): param is string =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(param)) satisfies ParamMatcher
