export class EquipmentModel{
    equipment_id!:number;
    type!:string;
    type_id!:string;
    capacities: { capacity_id: string, capacity: string, is_active: number }[] = [];
}