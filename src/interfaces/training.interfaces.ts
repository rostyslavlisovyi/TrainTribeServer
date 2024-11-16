export interface ITraining {
    id?: string;
    external_id: string;
    title: string;
    sport: string;
    date: string;
    time: string;
    distance: string;
    location: object;
    createdAt: Date;
    updatedAt: Date;
}
