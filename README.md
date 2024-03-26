# LearnCornerApp
Full stack web app with a Spring Webflux reactive backend and a React frontend. This setup enables the backend to handle asynchronous stream processing, offering improved scalability and performance for web applications. The app implements the basic functionality of a learning platform, such as allowing authors to publish courses, face to face and online, allowing users to enroll to courses and to post reviews for the courses they have taken part in.

User roles:
The app implements three types of user roles, each with its own set of functionalities.
Users: can view published courses, can enroll to a particular course and can post a review for that course after enrollment. They are able to update their user profile.
Authors: can view published courses, can create and publish new courses. They are able to update their user profile.
Admin: can delete published courses, reviews and course enrollments.

Database:
The app uses a PostgreSQL database for storing, retrieving and modifying data. The database uses R2DBC connectivity which is founded on the Reactive Streams specification, providing a fully-reactive non-blocking API.

Security Configuration:
The SecurityConfiguration class configures Spring Security for a reactive web application. It disables CSRF protection, configures CORS for specific origins and HTTP methods, and sets up authorization rules for different API paths. It uses OAuth2 with JWT and Okta integration for authentication, customizing the JWT decoder and JWT authentication converter to extract user details and authorities from the token. Inside the rest controllers the app implements method security, based on user details and authorities included in the JWT token.
