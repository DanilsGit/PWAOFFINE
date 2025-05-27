## Frontend

Make sure to configure the `src/environments/environment.ts` file before running the server. Here's an example configuration:

```env
# Server Configuration
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  backendUrl: 'http://localhost:8000',
  formSubmitUrl: 'https://formsubmit.co/example',
};

```

### Production server

To start a production server with PWA and caching functionalities, run:

```bash
npm run start:prod
```

### Development server

To start a development server, run:

```bash
npm run start:dev
```
