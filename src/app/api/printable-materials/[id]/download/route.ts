import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseServiceRoleClient } from '@/lib/supabase/service'

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params

  const service = createSupabaseServiceRoleClient()
  const { data, error } = await service
    .from('printable_materials')
    .select('id, file_url, resource_id, resources(status, visibility, created_by)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Download lookup failed', { id, error })
    return new NextResponse('Failed to lookup printable material', { status: 500 })
  }

  if (!data) {
    return new NextResponse('Not found', { status: 404 })
  }

  const resource = Array.isArray(data.resources) ? data.resources[0] : data.resources

  const isPublic = resource?.status === 'published' && resource?.visibility === 'public'

  if (!isPublic) {
    const supabase = await createSupabaseServerClient()
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const { data: profile } = await supabase.from('profiles').select('id, role, status').eq('id', user.id).single()

    const isActive = profile?.status === 'active'
    const isTeacherOrAdmin = profile?.role === 'teacher' || profile?.role === 'admin'
    const ownsResource = resource?.created_by === user.id

    if (!isActive || !isTeacherOrAdmin || (profile?.role === 'teacher' && !ownsResource)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  const { data: signed, error: signError } = await service.storage
    .from('printable-materials')
    .createSignedUrl(data.file_url, 60)

  if (signError || !signed?.signedUrl) {
    return new NextResponse('Failed to generate download URL', { status: 500 })
  }

  return NextResponse.redirect(signed.signedUrl)
}
