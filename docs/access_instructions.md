# Admin and Merchant Panel Access

## Admin Panel
- **URL**: `/admin`
- **Required Role**: `ADMIN`
- **Initial Setup**: Run `npm run seed` in the `backend` directory to create the default admin account.
- **Default Credentials**:
  - **Email**: `admin@arohhoo.com`
  - **Password**: `securepassword`

## Merchant Panel
- **URL**: `/merchant`
- **Required Role**: `MERCHANT` (Admins can also access it)
- **Access Flow**:
  1. A user registers an account at `/register`.
  2. The user's role must be updated to `MERCHANT`. This can be done by an Admin in the Admin Panel or directly in the database.
  3. Once assigned the `MERCHANT` role, the user can access the dashboard at `/merchant`.
