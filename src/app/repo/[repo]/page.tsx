'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

type Asset = {
  name: string
  url: string
}

type Release = {
  tag: string
  source_zip: string
  source_tar: string
  assets: Asset[]
}


type RepoData = {
  repo: string
  releases: Release[]
}

export default function RepoDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [repoData, setRepoData] = useState<RepoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRepoData() {
      try {
        const repoName = decodeURIComponent(params.repo as string)
        const res = await fetch(`/api/releases?repo=${encodeURIComponent(repoName)}`)
        const data: RepoData[] = await res.json()
        const selectedRepo = data.find(r => r.repo === repoName)
        if (selectedRepo) {
          setRepoData(selectedRepo)
        } else {
          router.push('/')
        }
      } catch (err) {
        console.error('加载失败:', err)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchRepoData()
  }, [params.repo, router])

  if (loading) {
    return (
      <main className="min-h-screen p-6 sm:p-12 bg-white">
        <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!repoData) {
    return (
      <main className="min-h-screen p-6 sm:p-12 bg-white">
        <div className="max-w-4xl mx-auto text-center py-16">
          <p className="text-gray-600">仓库信息不存在</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 sm:p-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          返回
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-medium text-gray-900">{repoData.repo}</h2>
          <p className="text-sm text-gray-500 mt-2">
            {repoData.releases.length} 个发布版本
          </p>
        </div>

        <div className="space-y-6">
{repoData.releases.map((release) => (
  <div key={release.tag} className="group">
    <h3 className="text-lg font-normal text-gray-900 mb-2">版本 {release.tag}</h3>

    <ul className="space-y-2">
      {/* assets 部分 */}
      {release.assets.length > 0 ? (
        release.assets.map((asset) => (
          <li key={asset.name} className="flex items-start justify-between">
            <span className="text-sm text-gray-600 truncate flex-1 mr-4">
              {asset.name}
            </span>
            <div className="flex space-x-3">
              <a
                href={asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                普通下载
              </a>
              <a
                href={`https://ghfast.top/${asset.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                加速下载
              </a>
            </div>
          </li>
        ))
      ) : (
        <li className="text-sm text-gray-400">此版本没有可用文件</li>
      )}

      {/* 源代码 zip */}
      <li className="flex items-start justify-between">
        <span className="text-sm text-gray-600 flex-1 mr-4">Source code (zip)</span>
        <div className="flex space-x-3">
          <a
            href={release.source_zip}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            普通下载
          </a>
          <a
            href={`https://ghfast.top/${release.source_zip}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            加速下载
          </a>
        </div>
      </li>

      {/* 源代码 tar.gz */}
      <li className="flex items-start justify-between">
        <span className="text-sm text-gray-600 flex-1 mr-4">Source code (tar.gz)</span>
        <div className="flex space-x-3">
          <a
            href={release.source_tar}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            普通下载
          </a>
          <a
            href={`https://ghfast.top/${release.source_tar}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            加速下载
          </a>
        </div>
      </li>
    </ul>
  </div>
))}


        </div>
      </div>
    </main>
  )
}
