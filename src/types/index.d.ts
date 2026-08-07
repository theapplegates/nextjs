import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

export declare type BuildTime = string | number | Date

export declare type Tag = string
export declare type Tags = Record<Tag, number>

/** Structured photo credit, sourced from post frontmatter `imageCredit:` */
export interface ImageCredit {
  /** The display caption shown before the attribution line. */
  caption?: string
  /** Photographer / creator display name. */
  author: string
  /** URL to the photographer's profile page. */
  authorUrl: string
  /** Name of the image host, e.g. "Unsplash". */
  source: string
  /** URL to the specific image page on the host. */
  sourceUrl: string
}

export interface PostMeta {
  slug: string
  title: string
  description?: string
  author?: string
  thumbnail?: string
  /** Optional structured image credit rendered below the hero thumbnail. */
  imageCredit?: ImageCredit
  createTime?: string
  updateTime?: string
  readingTime: number
  tags?: Tag[]
  prevPost: {
    slug: string
    title: string
    description?: string
  } | null
  nextPost: {
    slug: string
    title: string
    description?: string
  } | null
}

export interface PostContent {
  excerpt?: string
  source: MDXRemoteSerializeResult
}

export declare type Post = PostMeta & PostContent

export declare type PostsMeta = PostMeta[]

export interface TagsMeta {
  allTags: Tag[]
  tagCounts: Tags
}

export interface Metadata {
  posts: PostsMeta
  tags: TagsMeta
}

export interface MDXFrontMatter {
  layout: string
  title: string
  description?: string
  author?: string
  date?: string
  thumbnail?: string
  imageCredit?: ImageCredit
  tags?: Tag[]
}

export interface Profile {
  username: string
  name: string
  avatar: string
  bio?: string
  location?: string
  url: string
  followers: number
  followersUrl: string
  following: number
  followingUrl: string
  publicRepos: number
  publicGists: number
  totalStars: number
  createDate: string
}

export interface Repo {
  name: string
  stars: number
  language: string
  repoUrl: string
}

export interface GitHub {
  profile: Profile
  repos: Repo[]
}

export type { PaletteColor } from '@/lib/colors'
export type { Route } from '@/lib/get-routes'
export type { SiteConfig } from '@/lib/site'
export type { SocialSite } from '@/lib/social'
