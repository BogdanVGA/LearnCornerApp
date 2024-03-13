class UserHistoryModel {
    rowId: number;
    courseTitle: string;
    courseType: string;
    courseImage?: string;
    startDate: string;
    endDate: string;
    status: string;

    constructor(rowId: number, courseTitle: string, courseType: string, courseImage: string, startDate: string, endDate: string, status: string) {
        this.rowId = rowId;
        this.courseTitle = courseTitle;
        this.courseType = courseType;
        this.courseImage = courseImage;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}

export default UserHistoryModel;