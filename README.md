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
## Endpoints

1. **Get Country by Code**
   - **Endpoint:** `GET /countries/:code`
   - **Description:** Retrieves detailed information about a country by its code.
   - **Parameters:**
     - `code` (string): The 3-letter country code.

2. **Get Countries by Query**
   - **Endpoint:** `GET /countries`
   - **Description:** Retrieves a list of countries based on query parameters.
   - **Parameters:**
     - `region` (string): Filter by region.
     - `minPopulation` (number): Minimum population filter.
     - `maxPopulation` (number): Maximum population filter.
     - `page` (number): Page number for pagination.
     - `limit` (number): Number of countries per page.

3. **Save Countries**
   - **Endpoint:** `POST /countries`
   - **Description:** Saves multiple country records to the database.
   - **Request Body:** An array of country objects.

4. **Get Regions with Population**
   - **Endpoint:** `GET /regions`
   - **Description:** Retrieves regions with aggregated population data.
   - **Parameters:**
     - `regions` (array of strings): List of region names to filter.

5. **Get Languages with Details**
   - **Endpoint:** `GET /languages`
   - **Description:** Retrieves languages spoken across countries with speaker counts.

6. **Get Total Countries**
   - **Endpoint:** `GET /countries/total`
   - **Description:** Retrieves the total number of countries in the database.

7. **Get Largest Country by Area**
   - **Endpoint:** `GET /countries/largest`
   - **Description:** Retrieves the country with the largest area.

8. **Get Smallest Country by Population**
   - **Endpoint:** `GET /countries/smallest`
   - **Description:** Retrieves the country with the smallest population.

9. **Get Most Widely Spoken Language**
   - **Endpoint:** `GET /languages/widely-spoken`
   - **Description:** Retrieves the most widely spoken language by total speakers.

   Entities
   Country
   ID: Primary key, auto-generated.
   cca3: 3-letter country code.
   nameCommon: Common name of the country.
   nameOfficial: Official name of the country.
   nativeName: Native names in different languages.
   cca2: 2-letter country code.
   ccn3: Numeric country code.
   independent: Boolean indicating if the country is independent.
   status: Status of the country.
   unMember: Boolean indicating UN membership.
   currencies: Currencies used by the country.
   idd: International dialing codes.
   capital: Capital city names.
   altSpellings: Alternative spellings of the country name.
   region: Region the country belongs to.
   languages: Languages spoken in the country.
   translations: Translations of the country name.
   latlng: Latitude and longitude.
   landlocked: Boolean indicating if the country is landlocked.
   area: Area of the country.
   demonyms: Demonyms for the country.
   flag: Flag URL.
   maps: Maps URLs.
   population: Population of the country.
   car: Car information (e.g., signs, side).
   timezones: Time zones.
   continents: Continents the country is located in.
   flags: Flag images URLs (PNG, SVG).
   coatOfArms: Coat of arms details.
   startOfWeek: Start of the week (e.g., Sunday, Monday).
   capitalInfo: Capital city information.
   Challenges and Highlights
   Caching Strategy: Implementing efficient caching with Redis to handle large datasets and improve performance.
   Pagination and Query Optimization: Ensuring efficient data retrieval and pagination for large datasets.
   Analytics and Aggregations: Aggregating data for insightful analytics, such as most spoken languages and largest countries by area.
   Areas for Improvement
   Enhanced Caching: Implement more sophisticated caching strategies, such as cache invalidation and refreshing.
   Extended Analytics: Add more detailed analytics and reporting features.
   User Authentication: Implement user authentication and authorization for API access.
   Documentation and Testing: Expand the documentation and improve test coverage for edge cases.
   License
   This project is licensed under the MIT License - see the LICENSE file for details.

Contributing
Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.

Contact
For any questions or feedback, please contact andrewglory32@gmail.com.
