import { motionTokens, type MotionTokens, type TokenGroup } from './motion'

const GROUPS = Object.keys(motionTokens) as TokenGroup[]

/** True when a token no longer matches tokens.json. */
export function isTokenChanged<G extends TokenGroup>(tokens: MotionTokens, group: G, name: keyof MotionTokens[G]): boolean {
  return JSON.stringify(tokens[group][name]) !== JSON.stringify(motionTokens[group][name])
}

/** How many tokens differ from tokens.json, in one family or across all of them. */
export function countChangedTokens(tokens: MotionTokens, group?: TokenGroup): number {
  return (group ? [group] : GROUPS).reduce(
    (total, g) => total + Object.keys(tokens[g]).filter((name) => isTokenChanged(tokens, g, name as never)).length,
    0,
  )
}
