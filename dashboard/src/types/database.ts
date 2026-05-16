export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          nationality: string | null;
          emergency_contact: string | null;
          emergency_phone: string | null;
          blockchain_id: string | null;
          wallet_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      tourists: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          safety_score: number;
          status: string;
          current_state: string | null;
          last_seen: string;
          blockchain_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tourists']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['tourists']['Insert']>;
      };
      incidents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          severity: string;
          alert_type: string;
          latitude: number | null;
          longitude: number | null;
          location: string | null;
          reported_by: string | null;
          status: string;
          tourist_id: string | null;
          blockchain_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['incidents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['incidents']['Insert']>;
      };
      sos_alerts: {
        Row: {
          id: string;
          user_id: string | null;
          tourist_id: string | null;
          latitude: number;
          longitude: number;
          message: string | null;
          status: string;
          blockchain_hash: string | null;
          responded_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sos_alerts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['sos_alerts']['Insert']>;
      };
      geofences: {
        Row: {
          id: string;
          name: string;
          state: string;
          coordinates: Json;
          risk_level: string;
          description: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['geofences']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['geofences']['Insert']>;
      };
    };
  };
}
