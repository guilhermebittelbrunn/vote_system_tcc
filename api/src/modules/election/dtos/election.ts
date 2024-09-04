export default class ElectionDTO {
    id?: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
