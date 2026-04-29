export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: 'customer' | 'employee' | 'co_admin' | 'admin';
          company_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'customer' | 'employee' | 'co_admin' | 'admin';
          company_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'customer' | 'employee' | 'co_admin' | 'admin';
          company_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_permissions: {
        Row: {
          user_id: string;
          can_manage_products: boolean;
          can_manage_tickets: boolean;
          can_promote_to_co_admin: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_user_id: string | null;
          target_user_id: string | null;
          action: string;
          metadata: Json | null;
          created_at: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          created_by: string;
          assigned_to: string | null;
          status: 'open' | 'in_progress' | 'resolved';
          subject: string;
          message: string;
          response: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: 'panels' | 'inverters' | 'batteries' | 'accessories';
          sub_category: string | null;
          brand: string | null;
          application: string[] | null;
          price: number;
          stock_quantity: number;
          specifications: Json | null;
          technical_specs: Json | null;
          images: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status:
            | 'pending'
            | 'confirmed'
            | 'processing'
            | 'shipped'
            | 'delivered'
            | 'cancelled';
          total_amount: number;
          shipping_address: Json;
          payment_method: string | null;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
