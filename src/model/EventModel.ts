class EventModel {
    id: number;
    courseId: number;    
    places: number;
    maxPlaces: number;
    startDate: string;
    endDate: string;
    
    constructor (id: number, courseId: number, places: number, maxPlaces: number, startDate: string, endDate: string) {
        this.id = id;
        this.courseId = courseId;        
        this.places = places;
        this.maxPlaces = maxPlaces;
        this.startDate = startDate;
        this.endDate = endDate;            
    }
}

export default EventModel;
