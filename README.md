# Country Insights API

## Overview

The Country Insights API is a comprehensive service designed to provide detailed information about countries around the world. This API includes functionalities for querying country data, managing cache, and performing various analytics based on country attributes. The implementation leverages NestJS for building a scalable REST API, TypeORM for database interaction, and Redis for caching.

## Implementation Approach

The project is built using the following technologies:

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeORM**: An ORM for TypeScript and JavaScript that supports various database engines.
- **Redis**: An in-memory data structure store used as a cache to improve performance.

### Key Features

- **Country Data Retrieval**: Endpoints to fetch country details by various criteria.
- **Pagination and Caching**: Efficiently manage large datasets with pagination and caching strategies.
- **Analytics**: Aggregate and analyze data for regions, languages, and country statistics.

## Setup Instructions

### Prerequisites

- Node.js (v18.19.0 or higher)
- npm (v9.5.1 or higher)
- A Redis server (local or remote)
- A database server (MySQL or compatible)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Gloryzco/global-country-insights.git
   ```

2. **Install dependencies:**

```bash
  npm install
```

3. **Configure environment variables:**
   Create a .env file in the root directory and add the following configuration:

```bash
PORT=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
REDIS_HOST=
REDIS_PORT=
```

4. **Run database migrations:**

```bash
npm run migration:run
```

5. **Start the application:**

```bash
npm run start
```

5. **Running Tests:**
   To run tests, use the following command:

```bash
npm run test
```

# API Endpoints Documentation

## Country Endpoints

### Retrieve a List of Countries

- **Endpoint:** `GET /country`
- **Description:** Retrieve a list of countries with pagination and optional filtering by region or population size.
- **Parameters:**
  - `region` (string): Filter by region.
  - `minPopulation` (number): Minimum population filter.
  - `maxPopulation` (number): Maximum population filter.
  - `page` (number): Page number for pagination.
  - `limit` (number): Number of countries per page.
- **Responses:**
  - **200 OK**
    - **Description:** Countries fetched successfully.
    - **Response Type:** `CountryResponseDto`

### Retrieve a List of Regions with Countries

- **Endpoint:** `GET /country/regions`
- **Description:** Retrieve a list of regions and the countries within each region, with additional aggregated data such as the total population of the region.
- **Parameters:**
  - `regions` (array of strings): List of region names to filter.
- **Responses:**
  - **200 OK**
    - **Description:** Regions fetched successfully.
    - **Response Type:** `[RegionResponseDto]`

### Retrieve a List of Languages with Details

- **Endpoint:** `GET /country/languages`
- **Description:** Retrieve a list of languages with details including the countries they are spoken in and the total number of speakers globally.
- **Responses:**
  - **200 OK**
    - **Description:** Language details fetched successfully.
    - **Response Type:** `[LanguageDetail]`

### Retrieve Aggregated Statistics

- **Endpoint:** `GET /country/statistics`
- **Description:** Retrieve aggregated statistics including the total number of countries, largest country by area, smallest country by population, and most widely spoken language.
- **Responses:**
  - **200 OK**
    - **Description:** Statistics fetched successfully.
    - **Response Type:** `StatisticsDto`

### Retrieve Detailed Information for a Specific Country

- **Endpoint:** `GET /country/:code`
- **Description:** Retrieve detailed information for a specific country, including its languages, population, area, and bordering countries.
- **Parameters:**
  - `code` (string): The 3-letter country code.
- **Responses:**
  - **200 OK**
    - **Description:** Country details fetched successfully.
    - **Response Type:** `CountryResponseDto`

## Admin Endpoints

### Initialize Countries

- **Endpoint:** `GET /admin/initialize-countries`
- **Description:** Retrieve all countries from the API, store them persistently in the database, and cache them in Redis for future requests.
- **Responses:**
  - **200 OK**
    - **Description:** Countries initialized successfully.
    - **Response Type:** `[CountryResponseDto]`

## Authentication Endpoints

### Login

- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate to obtain a token for accessing the endpoints.
- **Request Body:**
  - `loginDto`: Credentials for login.
- **Responses:**
  - **200 OK**
    - **Description:** User logged in.
    - **Response Type:** `LoginUserResponseData`

### Logout

- **Endpoint:** `POST /auth/logout`
- **Description:** Log out the user by invalidating their token.
- **Responses:**
  - **200 OK**
    - **Description:** User logged out successfully.

### Refresh Token

- **Endpoint:** `POST /auth/refresh-token`
- **Description:** Refresh the token to obtain a new access token.
- **Request Body:**
  - `refreshToken`: The refresh token.
- **Responses:**
  - **200 OK**
    - **Description:** Token refreshed successfully.
    - **Response Type:** `refreshTokenResponseData`
  - **404 Not Found**
    - **Description:** User record not found.

## User Endpoints

### Register

- **Endpoint:** `POST /user/register`
- **Description:** Register as a user to have access to the endpoints.
- **Request Body:**
  - `createUserDto`: User registration details.
- **Responses:**
  - **201 Created**
    - **Description:** User registered successfully.
    - **Response Type:** `CreatedUserResponseData`
  - **400 Bad Request**
    - **Description:** Bad request.

## Entities

### Country

- **ID:** Primary key, auto-generated.
- **cca3:** 3-letter country code.
- **nameCommon:** Common name of the country.
- **nameOfficial:** Official name of the country.
- **nativeName:** Native names in different languages.
- **cca2:** 2-letter country code.
- **ccn3:** Numeric country code.
- **independent:** Boolean indicating if the country is independent.
- **status:** Status of the country.
- **unMember:** Boolean indicating UN membership.
- **currencies:** Currencies used by the country.
- **idd:** International dialing codes.
- **capital:** Capital city names.
- **altSpellings:** Alternative spellings of the country name.
- **region:** Region the country belongs to.
- **languages:** Languages spoken in the country.
- **translations:** Translations of the country name.
- **latlng:** Latitude and longitude.
- **landlocked:** Boolean indicating if the country is landlocked.
- **area:** Area of the country.
- **demonyms:** Demonyms for the country.
- **flag:** Flag URL.
- **maps:** Maps URLs.
- **population:** Population of the country.
- **car:** Car information (e.g., signs, side).
- **timezones:** Time zones.
- **continents:** Continents the country is located in.
- **flags:** Flag images URLs (PNG, SVG).
- **coatOfArms:** Coat of arms details.
- **startOfWeek:** Start of the week (e.g., Sunday, Monday).
- **capitalInfo:** Capital city information.

## Highlights of Interesting Challenges or Features

- **Caching Strategy and Performance Optimization:**

  - **Redis Integration:** One of the standout features of this project was implementing Redis for caching API responses. This not only enhanced performance but also helped in managing large datasets efficiently. Seeing the dramatic reduction in response times and the decreased load on our primary database was incredibly rewarding.
  - **Pagination Implementation:** I took special care to integrate pagination in our API. Handling large volumes of data with ease has been crucial in providing a smooth user experience. The ability to navigate through pages of data without significant performance hits was a significant achievement.
  - **Concurrency Management:** Addressing the challenge of handling concurrent requests was another highlight. By employing async processing and optimizing our database access patterns, I ensured that the API could handle high levels of traffic gracefully, which was critical for maintaining reliability.

- **Error Handling and Global Exception Management:**

  - **Error Handling:** I implemented a robust error-handling strategy to manage different types of errors gracefully. This involved defining clear error codes and messages, ensuring that users received meaningful feedback. Handling validation errors, database errors, and external service failures with appropriate responses was critical for maintaining a reliable API.
  - **Global Exception Handling:** To ensure consistent error handling across the application, I set up global exception handling. This approach allowed me to catch and manage unexpected errors centrally, providing a unified response format and logging detailed error information for debugging purposes. It was essential for maintaining API stability and enhancing user experience.

- **Analytics, Aggregations, and Data Management:**

  - **Insightful Analytics:** I developed robust aggregation logic to offer valuable insights such as the most spoken languages and the largest countries by area. This feature not only provided actionable data but also added a layer of depth to our API that users truly appreciated.
  - **Efficient Data Management:** Efficiently storing and managing fetched data was a priority. I implemented structured data management strategies that ensured optimal indexing and retrieval, which supported smooth operation and quick access to information.

- **Security and User Authentication:**

  - **Security Measures:** Ensuring the security of our API was paramount. I implemented comprehensive security measures, including input validation, sanitization, and rate limiting. Protecting the API from common web vulnerabilities and ensuring it could only be accessed via HTTPS were essential steps in safeguarding our data and users.
  - **HTTPS Enforcement:** Enforcing HTTPS was a critical decision to ensure secure communication and data protection.

- **Documentation and Testing:**

  - **Expanded Documentation:** I took pride in expanding our API documentation to provide detailed endpoint descriptions and practical examples. Making sure that our API was well-documented was important for both current and future developers working with it.
  - **Unit Testing:** I used Jest for unit testing, focusing on mocking to ensure that each component was tested in isolation. This approach allowed me to confidently verify the functionality of our endpoints and improve overall code quality.

- **Automated CI/CD Pipeline:**
  - **CI/CD Integration:** Implementing a continuous integration and continuous deployment (CI/CD) pipeline was a major highlight. Automating the build, test, and deployment processes ensured that code changes were thoroughly tested and deployed seamlessly. Setting up automated testing and deployment reduced manual errors and accelerated the release cycle, which was crucial for maintaining the quality and reliability of the API.
  - **Automated Testing:** Incorporating automated testing into the CI/CD pipeline allowed for consistent validation of code changes. By integrating unit tests and integration tests, I ensured that new features and bug fixes were validated continuously, providing confidence in the stability of each release.

## Aspects I am Particularly Proud Of 💪😊

- **Optimized Performance:** The performance improvements achieved through caching and query optimization were incredibly satisfying. Witnessing the API's enhanced speed and efficiency was a testament to the hard work put into these optimizations.
- **Robust Security:** Implementing strong security measures and ensuring HTTPS enforcement were crucial. I’m proud of the fact that the API is well-protected against common threats and vulnerabilities.
- **Efficient Data Management:** I effective handled of large datasets and concurrent requests demonstrated our ability to build scalable and reliable systems. It was rewarding to see the smooth operation under high load conditions.

## Potential Improvements and Additional Features to improve the overall API 🤞

- **Advanced Analytics:** If time allowed, I would love to explore more advanced analytics features. Detailed reporting and deeper insights could provide even greater value to our users and enhance the overall functionality of the API.
- **Enhanced Caching Mechanisms:** I envision implementing more sophisticated caching strategies, such as cache invalidation and refreshing. These improvements would further optimize performance and ensure data accuracy.
- **Permissions for admin users:** This will be to allow only admin users only to have access to the admin routes
- **Expanded Documentation and Testing:** I plan to continue enhancing our documentation and increasing test coverage to cover more edge cases and ensure comprehensive functionality. Also, I was unable to perfect the integration testing and it is one of the improvement I would like to look into if time permits me. This ongoing effort would ensure that our API remains reliable and user-friendly.

Contributing
Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.

Contact
For any questions or feedback, please contact andrewglory32@gmail.com.
