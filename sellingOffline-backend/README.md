## Backend

Make sure to configure the `.env` file before running the server. Here's an example configuration:

```env
# Server Configuration
PORT=8000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/selling_offline
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