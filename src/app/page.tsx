'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Asset = {
  name: string
  browser_download_url: string
}

type Release = {
  tag: string
  assets: Asset[]
}

type RepoData = {
  repo: string
  releases: Release[]
}

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<RepoData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/releases')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('加载失败:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRepoClick = (repo: string) => {
    router.push(`/repo/${encodeURIComponent(repo)}`)
  }

  return (
    <main className="min-h-screen p-6 sm:p-12 bg-white">
      <div className="max-w-4xl mx-auto">


        <div className="mb-12 ">
          <h1 className="text-xl font-medium text-gray-900 mb-10 mt-10">镜像下载</h1>

          {loading && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 ">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.map((repoData) => (
                <div
                  key={repoData.repo}
                  onClick={() => handleRepoClick(repoData.repo)}
                  className="cursor-pointer p-6 rounded bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h2 className="text-lg font-normal text-gray-900 truncate">
                        {repoData.repo.split('/')[1] || repoData.repo}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {repoData.repo}
                      </p>
                    </div>
                    <div className="mt-4">
                      <span className="text-xs text-gray-400">
                        {repoData.releases.length} releases
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">暂无可用仓库</p>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 pt-6">
          <p className="mb-2">itch 镜像每天同步一次。</p>
        </div>
      </div>
    </main>
  )
}