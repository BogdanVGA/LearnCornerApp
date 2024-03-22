class EventModel {
    id: number;
    courseId: number;    
    places: number;
    maxPlaces: number;
    startDate: string;
    endDate: string;
    authUser?: string;
    
    constructor (id: number, courseId: number, places: number, maxPlaces: number, startDate: string, endDate: string, authUser: string) {
        this.id = id;
        this.courseId = courseId;        
        this.places = places;
        this.maxPlaces = maxPlaces;
        this.startDate = startDate;
        this.endDate = endDate;
        this.authUser = authUser;
    }
}

export default EventModel;
