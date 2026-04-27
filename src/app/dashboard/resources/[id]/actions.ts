'use server'

import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function createPrintableMaterialAction(input: {
  resourceId: string
  title: string
  description: string | null
  filePath: string
  fileType: string | null
  pagesCount: number | null
  colorRequired: boolean
  doubleSidedRecommended: boolean
  paperSize: string
}) {
  const profile = await requireRole(['admin', 'teacher'])
  const supabase = await createSupabaseServerClient()

  const title = input.title.trim()
  if (!title) throw new Error('Title is required')

  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('id, created_by')
    .eq('id', input.resourceId)
    .single()

  if (resourceError) throw resourceError

  if (profile.role === 'teacher' && resource.created_by !== profile.id) {
    throw new Error('Access denied')
  }

  const { error } = await supabase.from('printable_materials').insert({
    resource_id: input.resourceId,
    title,
    description: input.description?.trim() || null,
    file_url: input.filePath,
    file_type: input.fileType,
    pages_count: input.pagesCount,
    color_required: input.colorRequired,
    double_sided_recommended: input.doubleSidedRecommended,
    paper_size: input.paperSize,
    uploaded_by: profile.id,
  })

  if (error) throw error
}
