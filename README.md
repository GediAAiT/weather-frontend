# Weather Frontend

Angular single-page app for the weather experience. It shows live weather, country profiles, and language switching on top of a Spring Boot API.

## Features

- Search and select countries
- View live weather details and forecasts
- Switch UI language
- See highlighted country profiles
- Responsive, animated weather dashboard

## Requirements

- Node.js 20+
- Yarn 4+
- The backend API running at `http://localhost:8081/api`

## Getting started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start the app:

   ```bash
   yarn start
   ```

3. Open the app in your browser at the URL shown by Angular CLI.

## Build

```bash
yarn build
```

## API

The frontend expects these backend endpoints:

- `GET /countries`
- `GET /languages`
- weather and country overview endpoints used by `ApiService`

Swagger UI is available at:

```text
http://localhost:8081/api/v1/swagger-ui/index.html
```

## Project structure

- `src/app/` — app shell, services, and UI components
- `src/assets/i18n/` — translation files
- `src/environments/` — environment config

