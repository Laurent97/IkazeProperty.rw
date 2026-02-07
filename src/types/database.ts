export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'admin' | 'agent' | 'user'
          avatar_url: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'agent' | 'user'
          avatar_url?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'agent' | 'user'
          avatar_url?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          currency: 'RWF' | 'USD' | 'EUR'
          price_type: 'fixed' | 'negotiable' | 'auction'
          category: 'houses' | 'cars' | 'land' | 'other'
          transaction_type: 'rent' | 'buy' | 'sale'
          status: 'available' | 'sold' | 'rented' | 'pending'
          location: Json
          seller_id: string
          commission_rate: number
          commission_agreed: boolean
          featured: boolean
            promoted: boolean
            views: number
            likes: number
            visit_fee_enabled: boolean
            visit_fee_amount: number
            visit_fee_payment_methods: Json
            created_at: string
            updated_at: string
            expires_at: string | null
          }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          currency?: 'RWF' | 'USD' | 'EUR'
          price_type?: 'fixed' | 'negotiable' | 'auction'
          category: 'houses' | 'cars' | 'land' | 'other'
          transaction_type: 'rent' | 'buy' | 'sale'
          status?: 'available' | 'sold' | 'rented' | 'pending'
          location: Json
          seller_id: string
          commission_rate?: number
          commission_agreed?: boolean
          featured?: boolean
            promoted?: boolean
            views?: number
            likes?: number
            visit_fee_enabled?: boolean
            visit_fee_amount?: number
            visit_fee_payment_methods?: Json
            created_at?: string
            updated_at?: string
            expires_at?: string | null
          }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          currency?: 'RWF' | 'USD' | 'EUR'
          price_type?: 'fixed' | 'negotiable' | 'auction'
          category?: 'houses' | 'cars' | 'land' | 'other'
          transaction_type?: 'rent' | 'buy' | 'sale'
          status?: 'available' | 'sold' | 'rented' | 'pending'
          location?: Json
          seller_id?: string
          commission_rate?: number
          commission_agreed?: boolean
          featured?: boolean
            promoted?: boolean
            views?: number
            likes?: number
            visit_fee_enabled?: boolean
            visit_fee_amount?: number
            visit_fee_payment_methods?: Json
            created_at?: string
            updated_at?: string
            expires_at?: string | null
          }
        }
        visit_requests: {
          Row: {
            id: string
            listing_id: string
            buyer_id: string
            seller_id: string
            visit_fee_amount: number
            platform_fee: number
            seller_payout: number
            payment_transaction_id: string | null
            payment_reference: string | null
            status: 'pending_payment' | 'paid' | 'released' | 'cancelled'
            payout_status: string
            released_by: string | null
            released_at: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            listing_id: string
            buyer_id: string
            seller_id: string
            visit_fee_amount?: number
            platform_fee?: number
            seller_payout?: number
            payment_transaction_id?: string | null
            payment_reference?: string | null
            status?: 'pending_payment' | 'paid' | 'released' | 'cancelled'
            payout_status?: string
            released_by?: string | null
            released_at?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            listing_id?: string
            buyer_id?: string
            seller_id?: string
            visit_fee_amount?: number
            platform_fee?: number
            seller_payout?: number
            payment_transaction_id?: string | null
            payment_reference?: string | null
            status?: 'pending_payment' | 'paid' | 'released' | 'cancelled'
            payout_status?: string
            released_by?: string | null
            released_at?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        site_settings: {
          Row: {
            id: string
            admin_phone: string
            support_email: string
            office_address: string
            created_at: string
            updated_at: string
            updated_by: string | null
          }
          Insert: {
            id?: string
            admin_phone: string
            support_email: string
            office_address: string
            created_at?: string
            updated_at?: string
            updated_by?: string | null
          }
          Update: {
            id?: string
            admin_phone?: string
            support_email?: string
            office_address?: string
            created_at?: string
            updated_at?: string
            updated_by?: string | null
          }
        }
      house_details: {
        Row: {
          id: string
          listing_id: string
          property_type: string
          bedrooms: number
          bathrooms: number
          total_area: number
          year_built: number | null
          condition: string
          furnished: string
          parking: string
          features: Json | null
          utilities_included: Json | null
          rent_duration: string | null
          security_deposit: number | null
          advance_payment: number | null
          minimum_lease_period: string | null
          available_from: string | null
        }
        Insert: {
          id?: string
          listing_id: string
          property_type: string
          bedrooms: number
          bathrooms: number
          total_area: number
          year_built?: number | null
          condition: string
          furnished: string
          parking: string
          features?: Json | null
          utilities_included?: Json | null
          rent_duration?: string | null
          security_deposit?: number | null
          advance_payment?: number | null
          minimum_lease_period?: string | null
          available_from?: string | null
        }
        Update: {
          id?: string
          listing_id?: string
          property_type?: string
          bedrooms?: number
          bathrooms?: number
          total_area?: number
          year_built?: number | null
          condition?: string
          furnished?: string
          parking?: string
          features?: Json | null
          utilities_included?: Json | null
          rent_duration?: string | null
          security_deposit?: number | null
          advance_payment?: number | null
          minimum_lease_period?: string | null
          available_from?: string | null
        }
      }
      car_details: {
        Row: {
          id: string
          listing_id: string
          vehicle_type: string
          make: string
          model: string
          year_manufacture: number
          condition: string
          fuel_type: string
          transmission: string
          engine_capacity: number
          mileage: number
          color: string
          doors: number
          seats: number
          features: Json | null
          ownership_papers: boolean
          insurance_status: string | null
          road_worthiness: boolean
          last_service_date: string | null
          rental_daily_rate: number | null
          rental_weekly_rate: number | null
          rental_monthly_rate: number | null
          security_deposit: number | null
          minimum_rental_period: string | null
          delivery_option: boolean
          driver_included: boolean
        }
        Insert: {
          id?: string
          listing_id: string
          vehicle_type: string
          make: string
          model: string
          year_manufacture: number
          condition: string
          fuel_type: string
          transmission: string
          engine_capacity: number
          mileage: number
          color: string
          doors: number
          seats: number
          features?: Json | null
          ownership_papers?: boolean
          insurance_status?: string | null
          road_worthiness?: boolean
          last_service_date?: string | null
          rental_daily_rate?: number | null
          rental_weekly_rate?: number | null
          rental_monthly_rate?: number | null
          security_deposit?: number | null
          minimum_rental_period?: string | null
          delivery_option?: boolean
          driver_included?: boolean
        }
        Update: {
          id?: string
          listing_id?: string
          vehicle_type?: string
          make?: string
          model?: string
          year_manufacture?: number
          condition?: string
          fuel_type?: string
          transmission?: string
          engine_capacity?: number
          mileage?: number
          color?: string
          doors?: number
          seats?: number
          features?: Json | null
          ownership_papers?: boolean
          insurance_status?: string | null
          road_worthiness?: boolean
          last_service_date?: string | null
          rental_daily_rate?: number | null
          rental_weekly_rate?: number | null
          rental_monthly_rate?: number | null
          security_deposit?: number | null
          minimum_rental_period?: string | null
          delivery_option?: boolean
          driver_included?: boolean
        }
      }
      land_details: {
        Row: {
          id: string
          listing_id: string
          plot_type: string
          plot_size: number
          size_unit: string
          shape: string
          topography: string
          soil_type: string | null
          road_access: string
          fenced: boolean
          utilities_available: Json | null
          land_title_type: string
          title_deed_number: string | null
          surveyed: boolean
          zoning_approval: boolean
          development_permits: boolean
          tax_clearance: boolean
          nearest_main_road_distance: number | null
          nearest_town_distance: number | null
          nearby_amenities: Json | null
        }
        Insert: {
          id?: string
          listing_id: string
          plot_type: string
          plot_size: number
          size_unit?: string
          shape: string
          topography: string
          soil_type?: string | null
          road_access: string
          fenced?: boolean
          utilities_available?: Json | null
          land_title_type: string
          title_deed_number?: string | null
          surveyed?: boolean
          zoning_approval?: boolean
          development_permits?: boolean
          tax_clearance?: boolean
          nearest_main_road_distance?: number | null
          nearest_town_distance?: number | null
          nearby_amenities?: Json | null
        }
        Update: {
          id?: string
          listing_id?: string
          plot_type?: string
          plot_size?: number
          size_unit?: string
          shape?: string
          topography?: string
          soil_type?: string | null
          road_access?: string
          fenced?: boolean
          utilities_available?: Json | null
          land_title_type?: string
          title_deed_number?: string | null
          surveyed?: boolean
          zoning_approval?: boolean
          development_permits?: boolean
          tax_clearance?: boolean
          nearest_main_road_distance?: number | null
          nearest_town_distance?: number | null
          nearby_amenities?: Json | null
        }
      }
      other_item_details: {
        Row: {
          id: string
          listing_id: string
          subcategory: string
          brand: string | null
          model: string | null
          condition: string
          warranty_available: boolean
          warranty_period: string | null
          reason_for_selling: string | null
          original_purchase_date: string | null
          age_of_item: string | null
        }
        Insert: {
          id?: string
          listing_id: string
          subcategory: string
          brand?: string | null
          model?: string | null
          condition: string
          warranty_available?: boolean
          warranty_period?: string | null
          reason_for_selling?: string | null
          original_purchase_date?: string | null
          age_of_item?: string | null
        }
        Update: {
          id?: string
          listing_id?: string
          subcategory?: string
          brand?: string | null
          model?: string | null
          condition?: string
          warranty_available?: boolean
          warranty_period?: string | null
          reason_for_selling?: string | null
          original_purchase_date?: string | null
          age_of_item?: string | null
        }
      }
      listing_media: {
        Row: {
          id: string
          listing_id: string
          media_type: 'image' | 'video'
          url: string
          public_id: string
          order_index: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          media_type: 'image' | 'video'
          url: string
          public_id: string
          order_index: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          media_type?: 'image' | 'video'
          url?: string
          public_id?: string
          order_index?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          seller_id: string
          message: string
          status: 'pending' | 'approved' | 'rejected' | 'connected'
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          seller_id: string
          message: string
          status?: 'pending' | 'approved' | 'rejected' | 'connected'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          buyer_id?: string
          seller_id?: string
          message?: string
          status?: 'pending' | 'approved' | 'rejected' | 'connected'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          seller_id: string
          amount: number
          commission_amount: number
          commission_rate: number
          status: 'pending' | 'completed' | 'cancelled' | 'disputed'
          payment_method: string | null
          transaction_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          seller_id: string
          amount: number
          commission_amount: number
          commission_rate: number
          status?: 'pending' | 'completed' | 'cancelled' | 'disputed'
          payment_method?: string | null
          transaction_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          buyer_id?: string
          seller_id?: string
          amount?: number
          commission_amount?: number
          commission_rate?: number
          status?: 'pending' | 'completed' | 'cancelled' | 'disputed'
          payment_method?: string | null
          transaction_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          transaction_id: string | null
          inquiry_id: string | null
          sender_id: string
          receiver_id: string
          content: string
          admin_mediated: boolean
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          transaction_id?: string | null
          inquiry_id?: string | null
          sender_id: string
          receiver_id: string
          content: string
          admin_mediated?: boolean
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string | null
          inquiry_id?: string | null
          sender_id?: string
          receiver_id?: string
          content?: string
          admin_mediated?: boolean
          read?: boolean
          created_at?: string
        }
      }
      promoted_listings: {
        Row: {
          id: string
          listing_id: string
          promotion_type: 'featured' | 'urgent' | 'video' | 'social' | 'email' | 'higher_images' | '360_tour'
          start_date: string
          end_date: string
          price: number
          paid: boolean
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          promotion_type: 'featured' | 'urgent' | 'video' | 'social' | 'email' | 'higher_images' | '360_tour'
          start_date: string
          end_date: string
          price: number
          paid?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          promotion_type?: 'featured' | 'urgent' | 'video' | 'social' | 'email' | 'higher_images' | '360_tour'
          start_date?: string
          end_date?: string
          price?: number
          paid?: boolean
          created_at?: string
        }
      }
      saved_searches: {
        Row: {
          id: string
          user_id: string
          name: string
          filters: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          filters: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          filters?: Json
          created_at?: string
        }
      }
      favorite_listings: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          reviewed_user_id: string
          transaction_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewed_user_id: string
          transaction_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          reviewed_user_id?: string
          transaction_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'agent' | 'user'
      listing_category: 'houses' | 'cars' | 'land' | 'other'
      transaction_type: 'rent' | 'buy' | 'sale'
      listing_status: 'available' | 'sold' | 'rented' | 'pending'
      price_type: 'fixed' | 'negotiable' | 'auction'
      currency_type: 'RWF' | 'USD' | 'EUR'
      inquiry_status: 'pending' | 'approved' | 'rejected' | 'connected'
      transaction_status: 'pending' | 'completed' | 'cancelled' | 'disputed'
      media_type: 'image' | 'video'
      promotion_type: 'featured' | 'urgent' | 'video' | 'social' | 'email' | 'higher_images' | '360_tour'
    }
  }
}
