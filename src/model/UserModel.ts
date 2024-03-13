class UserModel {

    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    userRole: string;

    constructor(id: number, username: string, email: string, firstName: string, lastName: string, userRole: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userRole = userRole;
    }

}

export default UserModel;