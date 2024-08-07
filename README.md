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

 
## Challenges and Highlights

### Caching Strategy and Performance Optimization

**Challenges:**
- **Large Datasets:** Managing large datasets efficiently requires careful consideration of cache size and eviction policies.
- **Cache Invalidation:** Implementing a strategy for invalidating stale cache entries to ensure data accuracy.
- **Data Retrieval Efficiency:** Ensuring efficient retrieval and pagination for large datasets to avoid performance bottlenecks.
- **Handling Concurrent Requests:** Ensuring the API performs well under high load and scales effectively.

**Highlights:**
- **Redis Integration:** Implemented Redis to cache API responses, significantly reducing response times and load on the primary database.
- **Pagination Implementation:** Integrated pagination to manage large volumes of data and improve performance and user experience.
- **Efficient Calculations:** Used efficient algorithms and data structures for aggregation, providing useful insights like the most spoken languages and the largest countries by area.

**Implementation Details:**
- **Caching Strategies:** Configured Redis caching with appropriate expiration times and eviction policies to balance performance and data freshness.
- **Concurrency Management:** Used async processing and optimized database access patterns to handle high levels of concurrent requests efficiently.

### Analytics, Aggregations, and Data Management

**Challenges:**
- **Data Aggregation:** Aggregating data for insightful analytics without impacting API performance.
- **Efficient Data Storage:** Storing and managing fetched data to support API endpoints efficiently.

**Highlights:**
- **Insightful Analytics:** Implemented aggregation logic to provide valuable statistics.
- **Efficient Data Management:** Stored and managed data in a structured format for API endpoints, with optimized indexing and data retrieval techniques.

**Implementation Details:**
- **Advanced Reporting Features:** Developed analytics features for detailed reporting and insights.

### Security and User Authentication

**Challenges:**
- **API Security:** Protecting the API from unauthorized access and potential security threats.
- **User Authentication:** Implementing secure authentication and authorization mechanisms.

**Highlights:**
- **Security Measures:** Applied input validation, sanitization, and rate limiting to protect against common web vulnerabilities.
- **HTTPS Enforcement:** Ensured the API is accessible only via HTTPS.

**Implementation Details:**
- **Authentication and Authorization:** Implemented JWT or OAuth2 for secure access control.
- **Rate Limiting:** Applied rate limiting to manage request volume and prevent abuse.

### Documentation and Testing

**Challenges:**
- **Comprehensive Coverage:** Ensuring that all edge cases are covered and the documentation is complete and up-to-date.

**Highlights:**
- **Expanded Documentation:** Improved API documentation to include detailed endpoint descriptions and examples.
- **Enhanced Testing:** Increased test coverage to include various edge cases and scenarios.

**Implementation Details:**
- **Unit Testing:** Used Jest for unit tests, including mocking for isolated testing.
- **Documentation Improvements:** Ensured documentation is comprehensive and current.

## What I’m Proud Of

- **Optimized Performance:** The caching and query optimization strategies significantly improved API response times.
- **Robust Security:** Comprehensive security measures protect the API from common vulnerabilities.
- **Efficient Data Management:** Effective strategies for handling large datasets and concurrent requests.

## Potential Improvements

- **Advanced Analytics:** Develop more sophisticated analytics features for deeper insights.
- **Enhanced Caching Mechanisms:** Improve caching strategies for better performance and data accuracy.
- **Extended Authentication:** Implement a more secure and flexible authentication system.
- **Expanded Documentation and Testing:** Continue to improve documentation and test coverage.



Contributing
Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.

Contact
For any questions or feedback, please contact andrewglory32@gmail.com.
