import type { GiscusProps } from '@giscus/react'
import type { SocialSite } from '@/lib/social'
import type { GitHub } from '@/types'
import { colors } from '@/lib/colors'

interface SiteConfig {
  author: string
  email: string
  themeColor: string
  url: string
  socials: Record<SocialSite, string>
  maxLandingStars: number
  minRepoStars: number
  contentPath: string
  githubData: GitHub
  giscus?: GiscusProps
}

const siteConfig: SiteConfig = {
  author: 'Paul',
  email: 'me@paulapplegate.com',
  themeColor: colors.black,
  url: 'https://theblog.paulapplegate.com',
  socials: {
    github: 'theapplegates',
    x: 'papplegate',
    facebook: '',
    weibo: '',
    rss: '',
  },
  maxLandingStars: 800,
  minRepoStars: 3,
  contentPath: 'content',
  githubData: {
    profile: {
      username: 'theapplegates',
      name: 'Paul',
      avatar: 'https://avatars.githubusercontent.com/u/12670482?v=4',
      bio: 'Web Developer',
      location: 'Undefined',
      url: 'https://github.com/theapplegates',
      followers: 72,
      followersUrl: 'https://github.com/theapplegates?tab=followers',
      following: 206,
      followingUrl: 'https://github.com/theapplegates?tab=following',
      publicRepos: 15,
      publicGists: 0,
      totalStars: 175,
      createDate: 'Sat May 30 2015',
    },
    repos: [
      {
        name: 'blog',
        stars: 42,
        language: 'TypeScript',
        repoUrl: 'https://github.com/theapplegates/blog',
      },
      {
        name: 'awesome-notes',
        stars: 44,
        language: 'TypeScript',
        repoUrl: 'https://github.com/theapplegates/awesome-notes',
      },
      {
        name: 'hust-lab',
        stars: 31,
        language: 'C',
        repoUrl: 'https://github.com/theapplegates/hust-lab',
      },
      {
        name: 'LaTeX-snippets',
        stars: 15,
        language: 'JSON',
        repoUrl: 'https://github.com/LaTeX-snippets',
      },
      {
        name: 'dragon-zsh-theme',
        stars: 13,
        language: 'Shell',
        repoUrl: 'https://github.com/dragon-zsh-theme',
      },
      {
        name: 'bod',
        stars: 5,
        language: 'TypeScript',
        repoUrl: 'https://github.com/bod',
      },
    ],
  },
}

export { siteConfig }
export type { SiteConfig }
