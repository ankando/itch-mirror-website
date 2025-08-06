import { NextResponse } from 'next/server'

const repos = [
  'Anuken/Mindustry',
  'ankando/itch-mirror',
  'TinyLake/MindustryX',
  'Jackson11500/Mindustry-CN-ARC-Builds',
  'Catana791/Asthosus'
]

const token = process.env.GITHUB_TOKEN || ''

export async function GET(req: Request) {
  const url = new URL(req.url)
  const queryRepo = url.searchParams.get('repo') // 获取 query 参数

  const targetRepos = queryRepo ? [queryRepo] : repos // 如果指定了 repo，就只查一个

  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {}

  const results = await Promise.all(targetRepos.map(async (fullName) => {
    const [owner, repo] = fullName.split('/')
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases`

    try {
      const res = await fetch(apiUrl, { headers })

      if (!res.ok) {
        return {
          repo: fullName,
          error: `GitHub API error: ${res.status} ${res.statusText}`
        }
      }

      const data = await res.json()

      return {
        repo: fullName,
        releases: data.map((release: any) => {
          const tag = release.tag_name
          return {
            tag,
            source_zip: `https://github.com/${owner}/${repo}/archive/refs/tags/${tag}.zip`,
            source_tar: `https://github.com/${owner}/${repo}/archive/refs/tags/${tag}.tar.gz`,
            assets: (release.assets || []).map((a: any) => ({
              name: a.name,
              url: a.browser_download_url
            }))
          }
        })
      }

    } catch (err: any) {
      return {
        repo: fullName,
        error: `Fetch failed: ${err.message || String(err)}`
      }
    }
  }))

  return NextResponse.json(results)
}
