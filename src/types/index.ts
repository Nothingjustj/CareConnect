export interface DepartmentType {
    id: number;
    name: string;
    description: string;
    created_at: string;
  }
  
  export interface HospitalDepartment {
    id: number;
    hospital_id: string;
    department_type_id: number;
    daily_token_limit: number;
    current_token_count: number;
    status: boolean;
    created_at: string;
    department_type?: DepartmentType; // for joined data
  }
  
  export interface Hospital {
    id: string;
    name: string;
    address: string;
    city: string;
    contact_number: string;
    email: string;
    created_at: string;
  }
  
  export interface Profile {
    id: string;
    name: string;
    role: 'patient' | 'department_admin' | 'hospital_admin' | 'super_admin';
    phone_no: string;
    email: string;
    hospital_id: number | null;
    department_id: number | null;
    created_at: string;
  }