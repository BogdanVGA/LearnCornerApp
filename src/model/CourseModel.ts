class CourseModel {
    id: number;
    title: string;
    author?: string;
    description?: string;
    category?: string;
    courseType?: string;
    image?: string;

    constructor (id: number, title: string, author: string, description: string, 
        category: string, courseType: string, image: string) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.description = description;
            this.category = category;
            this.courseType = courseType;
            this.image = image;
    }
}

export default CourseModel;
