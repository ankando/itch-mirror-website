import { NextResponse } from 'next/server'

const repos = [
  'Anuken/Mindustry',
  'ankando/itch-mirror',
  'TinyLake/MindustryX',
  'Jackson11500/Mindustry-CN-ARC-Builds',
  'mindustry-antigrief/mindustry-client-v8-builds'
]

const token = process.env.GITHUB_TOKEN || ''

type GitHubAsset = {
  name: string
  browser_download_url: string
}

type GitHubRelease = {
  tag_name: string
  assets: GitHubAsset[]
}

export async function GET() {
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {}

  const results = await Promise.all(repos.map(async (fullName) => {
    const [owner, repo] = fullName.split('/')
    const url = `https://api.github.com/repos/${owner}/${repo}/releases`

    try {
      const res = await fetch(url, { headers })

      if (!res.ok) {
        return {
          repo: fullName,
          error: `GitHub API error: ${res.status} ${res.statusText}`
        }
      }

      const data: GitHubRelease[] = await res.json()

      return {
        repo: fullName,
        releases: data.map((release) => {
          const tag = release.tag_name
          return {
            tag,
            source_zip: `https://github.com/${owner}/${repo}/archive/refs/tags/${tag}.zip`,
            source_tar: `https://github.com/${owner}/${repo}/archive/refs/tags/${tag}.tar.gz`,
            assets: (release.assets || []).map((a) => ({
              name: a.name,
              url: a.browser_download_url
            }))
          }
        })
      }

    } catch (err: unknown) {
      return {
        repo: fullName,
        error: `Fetch failed: ${err instanceof Error ? err.message : String(err)}`
      }
    }
  }))

  return NextResponse.json(results)
}
