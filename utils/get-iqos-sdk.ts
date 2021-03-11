import jadx from '@modmyiqos/jadx-node'
import { Octokit } from '@octokit/rest'
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFile, rm, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { copy } from 'fs-extra'
import fetch from 'node-fetch'

const octokit = new Octokit()

const apkPath = join(tmpdir(), 'iqos_connect.apk')
const decompilationPath = join(tmpdir(), 'iqos_connect')
const sdkPath = join(process.cwd(), '..', 'iqossdk')

export const run = async (): Promise<void> => {
  if (!existsSync(sdkPath)) {
    await mkdir(sdkPath)
  }

  const { data: releases } = await octokit.repos.listReleases({ owner: 'modmyiqos', repo: 'reverse-engineering' })

  const [assetsRelease] = releases.filter(
    (release) => !release.prerelease &&
            release.tag_name.includes('assets') &&
            release.assets.some(({ name }) => name === 'iqos_connect.apk')
  )

  console.log('Selecting', assetsRelease.tag_name)

  const apkAsset = assetsRelease.assets.find(asset => asset.name === 'iqos_connect.apk')

  if (!apkAsset) {
    throw new Error('Apk asset: iqos_connect.apk not found')
  }

  const { data: apk } = await octokit.repos.getReleaseAsset({ owner: 'modmyiqos', repo: 'reverse-engineering', asset_id: apkAsset.id })

  const res = await fetch(apk.browser_download_url)

  console.log('Downloading apk from', apk.browser_download_url)

  await writeFile(apkPath, await res.buffer())

  console.log('Starting decompilation of', apkPath)
  await jadx(apkPath, decompilationPath)

  console.log('Copying com.pmi.iqossdk')
  await copy(join(decompilationPath, 'sources', 'com', 'pmi', 'iqossdk'), sdkPath, { recursive: true })

  console.log('Cleaning up')
  await rm(apkPath, { recursive: true })
  await rm(decompilationPath, { recursive: true })
}

run().catch(console.error)
