export class DeliveryNoteInsertModel {
    type_id!:string | null;
    capacity_id!:string | null;
    company_id!:string | null;
    driver_id!:string | null;
    company_name!: string;
    type!: string ;
    drivery_name!: string;
    vehicle_no!: string;
    loading_site!: string;
    off_loading_site!: string;
    arrival_at_loading_site!: string;
    departure_at_loading_site!: string;
    arrival_at_offloading_site!: string;
    departure_at_offloading_site!: string;
    contact_no!: string;
    goods_details!: string;
    receiver_name!: string;
    receiver_no!: string;
    remarks!: string ;
    signature!: string | null;
    inserted_date!:Date;
    is_active!:string;
  }