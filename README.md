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

### Caching Strategy

**Challenges:**
- **Large Datasets:** Managing large datasets efficiently requires careful consideration of cache size and eviction policies.
- **Cache Invalidation:** Implementing a strategy for invalidating stale cache entries to ensure data accuracy.
  
**Highlights:**
- **Redis Integration:** Implemented Redis to cache API responses, significantly reducing response times and load on the primary database.
- **Cache Miss Handling:** Utilized Redis to store frequently accessed data and fallback to the primary database or external APIs as needed.

### Pagination and Query Optimization

**Challenges:**
- **Data Retrieval Efficiency:** Ensuring efficient retrieval and pagination for large datasets to avoid performance bottlenecks.
  
**Highlights:**
- **Pagination Implementation:** Integrated pagination to manage large volumes of data and improve performance and user experience.
- **Query Optimization:** Utilized database indexing and optimized queries to enhance data retrieval times.

### Analytics and Aggregations

**Challenges:**
- **Data Aggregation:** Aggregating data for insightful analytics without impacting API performance.
  
**Highlights:**
- **Insightful Analytics:** Implemented aggregation logic to provide useful statistics, such as the most spoken languages and the largest countries by area.
- **Efficient Calculations:** Used efficient algorithms and data structures to perform analytics without significant performance overhead.

## Areas for Improvement

### Enhanced Caching

**Challenges:**
- **Cache Refreshing:** Ensuring that the cache is updated with fresh data when underlying data changes.
  
**Potential Improvements:**
- **Sophisticated Caching Strategies:** Implement more advanced caching techniques such as cache invalidation, cache expiration, and cache warming to keep data current and improve performance.

### Extended Analytics

**Challenges:**
- **Detailed Reporting:** Providing comprehensive analytics and reporting features can be complex and resource-intensive.
  
**Potential Improvements:**
- **Advanced Reporting Features:** Add more detailed analytics and reporting capabilities, including trend analysis and data visualizations.

### User Authentication

**Challenges:**
- **API Security:** Protecting the API from unauthorized access and potential security threats.
  
**Potential Improvements:**
- **Implement Authentication and Authorization:** Use JWT or OAuth2 for secure access control to the API endpoints, ensuring only authorized users can access certain resources.

### Documentation and Testing

**Challenges:**
- **Comprehensive Coverage:** Ensuring that all edge cases are covered and the documentation is complete and up-to-date.
  
**Potential Improvements:**
- **Expanded Documentation:** Improve API documentation to include all endpoints, parameters, request/response examples, and error handling.
- **Enhanced Testing:** Increase test coverage to include more edge cases and scenarios to ensure robustness.

## How We Addressed Key Points

### Unit Tests for API Endpoints

**Implementation:**
- **Testing Framework:** Used Jest for unit testing, writing tests for each API endpoint to verify functionality and ensure correct responses.
- **Mocking:** Employed mocking techniques to simulate various scenarios and dependencies, isolating tests from external services.

### Protection Against Web Vulnerabilities

**Implementation:**
- **Security Measures:** Implemented common security practices such as input validation, sanitization, and rate limiting to protect against threats like SQL injection, cross-site scripting (XSS), and cross-site request forgery (CSRF).
- **HTTPS:** Ensured that the API is accessible only via HTTPS to encrypt data in transit.

### Caching Strategies

**Implementation:**
- **Redis Caching:** Cached API responses in Redis to improve performance and reduce load on the database.
- **Cache Expiration:** Configured appropriate cache expiration times and eviction policies to balance performance and data freshness.

### Handling Concurrent Requests

**Implementation:**
- **Concurrency Management:** Used async processing and optimized database access patterns to handle high levels of concurrent requests efficiently.
- **Load Testing:** Conducted load testing to ensure the API can scale and handle peak loads effectively.

### Data Management

**Implementation:**
- **Efficient Storage:** Stored and managed fetched data in a structured format to support API endpoints efficiently.
- **Database Optimization:** Implemented indexing and optimized data storage techniques to ensure fast access and retrieval.

### Rate Limiting

**Implementation:**
- **Rate Limiting Strategy:** Applied rate limiting to control the number of requests a client can make within a specified timeframe, preventing abuse and ensuring fair usage.
- **Libraries and Middleware:** Used libraries and middleware to enforce rate limits and handle exceeding requests gracefully.

## Challenges

- **Balancing Performance and Accuracy:** Striking a balance between cache performance and data accuracy.
- **Scaling and Load Management:** Ensuring the API performs well under high load and scales effectively.

## Highlights

- **Efficient Caching:** Successfully implemented Redis caching to enhance performance.
- **Comprehensive Analytics:** Developed useful analytics features that provide valuable insights.

## What I’m Proud Of

- **Optimized Performance:** The caching and query optimization strategies significantly improved API response times and overall performance.
- **Robust Security:** Implemented comprehensive security measures to protect the API from common vulnerabilities.

## Potential Improvements

- **Advanced Analytics and Reporting:** Develop more sophisticated analytics features.
- **Enhanced Caching Mechanisms:** Improve caching strategies for better performance and data accuracy.
- **User Authentication:** Implement a more secure and flexible authentication system.


Contributing
Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.

Contact
For any questions or feedback, please contact andrewglory32@gmail.com.
