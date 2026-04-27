export type ProfileRole = 'admin' | 'teacher' | 'alumni' | 'donor' | 'student_optional'
export type ProfileStatus = 'active' | 'pending' | 'inactive' | 'banned'

export type ResourceDifficultyLevel = 'easy' | 'medium' | 'hard'
export type ResourceType =
  | 'teaching_material'
  | 'printable_template'
  | 'activity_idea'
  | 'lesson_activity'
export type ResourceVisibility = 'public' | 'teacher_only' | 'logged_in_only' | 'private'
export type ResourceStatus =
  | 'draft'
  | 'pending'
  | 'published'
  | 'rejected'
  | 'archived'

export type Tables = {
  profiles: {
    Row: {
      id: string
      name: string | null
      email: string | null
      role: ProfileRole
      status: ProfileStatus
      profile_image_url: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id: string
      name?: string | null
      email?: string | null
      role?: ProfileRole
      status?: ProfileStatus
      profile_image_url?: string | null
      created_at?: string
      updated_at?: string
    }
    Update: {
      name?: string | null
      email?: string | null
      role?: ProfileRole
      status?: ProfileStatus
      profile_image_url?: string | null
      updated_at?: string
    }
  }
  resources: {
    Row: {
      id: string
      title: string
      description: string | null
      activity_type: string | null
      result_description: string | null
      preparation_time: string | null
      activity_duration: string | null
      group_size_min: number | null
      group_size_max: number | null
      difficulty_level: ResourceDifficultyLevel | null
      print_required: boolean
      cutting_required: boolean
      extra_materials_required: boolean
      resource_type: ResourceType
      visibility: ResourceVisibility
      status: ResourceStatus
      created_by: string | null
      approved_by: string | null
      rejection_reason: string | null
      created_at: string
      updated_at: string
      published_at: string | null
    }
    Insert: Partial<Tables['resources']['Row']> & Pick<Tables['resources']['Row'], 'title' | 'resource_type'>
    Update: Partial<Tables['resources']['Row']>
  }
  grade_levels: {
    Row: {
      id: string
      name: string
      grade_number: number
      description: string | null
    }
    Insert: Partial<Tables['grade_levels']['Row']> & Pick<Tables['grade_levels']['Row'], 'name' | 'grade_number'>
    Update: Partial<Tables['grade_levels']['Row']>
  }
  resource_grade_levels: {
    Row: {
      resource_id: string
      grade_level_id: string
    }
    Insert: Tables['resource_grade_levels']['Row']
    Update: Partial<Tables['resource_grade_levels']['Row']>
  }
  subjects: {
    Row: {
      id: string
      name: string
      description: string | null
    }
    Insert: Partial<Tables['subjects']['Row']> & Pick<Tables['subjects']['Row'], 'name'>
    Update: Partial<Tables['subjects']['Row']>
  }
  resource_subjects: {
    Row: {
      resource_id: string
      subject_id: string
    }
    Insert: Tables['resource_subjects']['Row']
    Update: Partial<Tables['resource_subjects']['Row']>
  }
  printable_materials: {
    Row: {
      id: string
      resource_id: string
      title: string
      description: string | null
      file_url: string
      file_type: string | null
      pages_count: number | null
      color_required: boolean
      double_sided_recommended: boolean
      paper_size: string
      uploaded_by: string | null
      created_at: string
    }
    Insert: Partial<Tables['printable_materials']['Row']> & Pick<Tables['printable_materials']['Row'], 'resource_id' | 'title' | 'file_url'>
    Update: Partial<Tables['printable_materials']['Row']>
  }
  required_materials: {
    Row: {
      id: string
      resource_id: string
      name: string
      quantity: number | null
      is_optional: boolean
      provided_in_template: boolean
      note: string | null
    }
    Insert: Partial<Tables['required_materials']['Row']> & Pick<Tables['required_materials']['Row'], 'resource_id' | 'name'>
    Update: Partial<Tables['required_materials']['Row']>
  }
  blog_posts: {
    Row: {
      id: string
      title: string
      slug: string | null
      excerpt: string | null
      content: string | null
      cover_image_url: string | null
      status: 'draft' | 'pending' | 'published' | 'rejected' | 'archived'
      author_id: string | null
      approved_by: string | null
      rejection_reason: string | null
      created_at: string
      updated_at: string
      published_at: string | null
    }
    Insert: Partial<Tables['blog_posts']['Row']> & Pick<Tables['blog_posts']['Row'], 'title'>
    Update: Partial<Tables['blog_posts']['Row']>
  }
  blog_post_subjects: {
    Row: {
      blog_post_id: string
      subject_id: string
    }
    Insert: { blog_post_id: string; subject_id: string }
    Update: Partial<{ blog_post_id: string; subject_id: string }>
  }
  submissions: {
    Row: {
      id: string
      title: string
      description: string | null
      submission_type: 'blog_post' | 'activity_idea' | 'teaching_material' | 'printable_template'
      file_url: string | null
      external_link: string | null
      submitted_by: string | null
      status: 'pending' | 'approved' | 'rejected' | 'changes_requested'
      reviewed_by: string | null
      rejection_reason: string | null
      created_at: string
      updated_at: string
    }
    Insert: Partial<Tables['submissions']['Row']> & Pick<Tables['submissions']['Row'], 'title' | 'submission_type'>
    Update: Partial<Tables['submissions']['Row']>
  }
}

export type ResourceListItem = Tables['resources']['Row'] & {
  grade_levels: { id: string; name: string; grade_number: number }[]
  subjects: { id: string; name: string }[]
  required_materials: { name: string; quantity: number | null }[]
}

export type ResourceDetail = Tables['resources']['Row'] & {
  grade_levels: { id: string; name: string; grade_number: number }[]
  subjects: { id: string; name: string }[]
  required_materials: {
    id: string
    name: string
    quantity: number | null
    is_optional: boolean
    provided_in_template: boolean
    note: string | null
  }[]
  printable_materials: {
    id: string
    title: string
    description: string | null
    file_url: string
    file_type: string | null
    pages_count: number | null
    color_required: boolean
    double_sided_recommended: boolean
    paper_size: string
    created_at: string
  }[]
}
