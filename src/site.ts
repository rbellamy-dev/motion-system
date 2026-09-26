/**
 * Who made this and where the depth lives. Links left undefined are simply not shown,
 * so set `repoUrl` once the repo is public and the Source and Decisions links appear.
 */
export const site = {
  author: 'Ramona Bellamy',
  portfolioUrl: 'https://rbellamy.com',
  repoUrl: undefined as string | undefined,
}

export const decisionsUrl = site.repoUrl ? `${site.repoUrl}/blob/main/DECISIONS.md` : undefined
