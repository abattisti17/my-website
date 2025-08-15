export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          ig_url: string | null
          reveal_ig: boolean
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          ig_url?: string | null
          reveal_ig?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          ig_url?: string | null
          reveal_ig?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          slug: string
          artist: string
          city: string
          venue: string | null
          date_utc: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          artist: string
          city: string
          venue?: string | null
          date_utc: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          artist?: string
          city?: string
          venue?: string | null
          date_utc?: string
          created_at?: string
        }
      }
      event_members: {
        Row: {
          event_id: string
          user_id: string
          vibe_badges: any[]
          joined_at: string
        }
        Insert: {
          event_id: string
          user_id: string
          vibe_badges?: any[]
          joined_at?: string
        }
        Update: {
          event_id?: string
          user_id?: string
          vibe_badges?: any[]
          joined_at?: string
        }
      }
      pods: {
        Row: {
          id: string
          event_id: string
          name: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string | null
          created_by?: string
          created_at?: string
        }
      }
      pod_members: {
        Row: {
          pod_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          pod_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          pod_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          event_id: string
          user_id: string
          kind: 'text' | 'poll' | 'hype'
          body: any
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          kind: 'text' | 'poll' | 'hype'
          body?: any
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          kind?: 'text' | 'poll' | 'hype'
          body?: any
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          pod_id: string
          user_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          pod_id: string
          user_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          pod_id?: string
          user_id?: string
          text?: string
          created_at?: string
        }
      }
      meet_points: {
        Row: {
          event_id: string
          title: string | null
          description: string | null
          when_local: string | null
          created_by: string | null
          updated_at: string
        }
        Insert: {
          event_id: string
          title?: string | null
          description?: string | null
          when_local?: string | null
          created_by?: string | null
          updated_at?: string
        }
        Update: {
          event_id?: string
          title?: string | null
          description?: string | null
          when_local?: string | null
          created_by?: string | null
          updated_at?: string
        }
      }
      memorabilia: {
        Row: {
          id: string
          event_id: string
          user_id: string
          opener_guess: string | null
          peak_moment: string | null
          song_of_night: string | null
          crowd_energy: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          opener_guess?: string | null
          peak_moment?: string | null
          song_of_night?: string | null
          crowd_energy?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          opener_guess?: string | null
          peak_moment?: string | null
          song_of_night?: string | null
          crowd_energy?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      media: {
        Row: {
          id: string
          owner_id: string
          event_id: string
          pod_id: string | null
          url: string
          kind: 'image' | 'video'
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          event_id: string
          pod_id?: string | null
          url: string
          kind: 'image' | 'video'
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          event_id?: string
          pod_id?: string | null
          url?: string
          kind?: 'image' | 'video'
          created_at?: string
        }
      }
    }
  }
}
