/** Public URL for a published blog post (prefer slug when set). */
export function blogPostHref(post: { id: string; slug: string | null }) {
  return post.slug ? `/blog/${encodeURIComponent(post.slug)}` : `/blog/${post.id}`
}
