// HR & Payroll Module
export interface Employee {
  id: string;
  organization_id: string;
  property_id?: string;
  full_name: string;
  email: string;
  phone: string;
  department: "frontdesk" | "housekeeping" | "maintenance" | "f&b" | "management" | "security";
  designation: string;
  employment_type: "full_time" | "part_time" | "seasonal" | "contract";
  base_salary: number;
  is_active: boolean;
}
