class ReviewModel {
    id: number;
    username: string;
    courseId: number;
    date: string;
    reviewText?: string;
    rating: number;

    constructor(id: number, username: string, courseId: number, date: string, 
        reviewText: string, rating: number) {
            
            this.id = id;
            this.username = username;
            this.courseId = courseId;
            this.date = date;
            this.reviewText = reviewText;
            this.rating = rating;
    }
}

export default ReviewModel;