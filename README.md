# 🚗 Vehicle Rental System API

> A professional, production-ready backend API for managing vehicle rentals with complete authentication, role-based access control, and comprehensive booking management.

**Live URL:** `https://vehicle-l2-a2-server.vercel.app/api/v1/`

---

## ✨ Features

### Core Features
- ✅ **User Authentication & Authorization** - Secure signup/signin with JWT tokens
- ✅ **Role-Based Access Control** - Separate permissions for Admin and Customer roles
- ✅ **Vehicle Management** - Create, read, update, delete vehicles with availability tracking
- ✅ **Booking System** - Complete rental booking with automatic price calculation
- ✅ **Customer Management** - View and manage customer profiles
- ✅ **Smart Constraints** - Prevent deletion of users/vehicles with active bookings

### Advanced Features
- 🔐 **Password Security** - Bcrypt hashing with 10 salt rounds
- 🎯 **Automatic Price Calculation** - Daily rate × number of days
- 🚗 **Vehicle Availability Tracking** - Real-time availability status management
- 📅 **Booking Validation** - Date validation and conflict checking
- 👥 **Role-Based Data Access** - Admins see all data, customers see only their own
- ⚡ **Performance Optimized** - Connection pooling and efficient queries

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **TypeScript** | Type-safe development |
| **Express.js** | Web framework |
| **PostgreSQL** | Relational database |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment configuration |

---

## 📁 Project Structure

```
src/
├── server.ts                          # Server entry point
├── app.ts                             # Express application setup
├── config/
│   ├── db.ts                          # Database connection & schema
│   └── index.ts                       # Environment configuration
├── middleware/
│   ├── auth.ts                        # JWT authentication middleware
│   └── logger.ts                      # Request logging middleware
└── modules/
    ├── auth/                          # Authentication module
    │   ├── auth.service.ts            # Signup/signin logic
    │   ├── auth.controller.ts         # Request handlers
    │   └── auth.routes.ts             # Route definitions
    ├── vehicles/                      # Vehicle management module
    │   ├── vehicle.service.ts         # CRUD operations
    │   ├── vehicle.controller.ts      # Request handlers
    │   └── vehicle.route.ts           # Route definitions
    ├── users/                         # User management module
    │   ├── user.service.ts            # User operations
    │   ├── user.controller.ts         # Request handlers
    │   └── user.route.ts              # Route definitions
    └── bookings/                      # Booking management module
        ├── booking.service.ts         # Booking logic
        ├── booking.controller.ts      # Request handlers
        └── booking.route.ts           # Route definitions
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **PostgreSQL** database
- **npm** or **yarn** package manager

### Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=8080
   CONNECTION_STRING=postgresql://username:password@localhost:5432/vehicle_rental_db
   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Server will be available at: `http://localhost:8080`

---

## 📊 Database Setup

The database schema is automatically created on first run. Here's what gets initialized:

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone VARCHAR(15) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  daily_rent_price DECIMAL(10, 2) NOT NULL,
  availability_status VARCHAR(50) NOT NULL DEFAULT 'available',
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
);
```

---

## 🔐 Authentication & Authorization

### User Roles

**Admin Role:**
- Full system access
- Manage all vehicles
- View and manage all users
- View all bookings
- Mark bookings as returned

**Customer Role:**
- Register and login
- View all available vehicles
- Create bookings
- View own bookings only
- Cancel own bookings (before start date)

### Authentication Flow

1. **User Registration**
   ```bash
   POST /api/v1/auth/signup
   ```
   - Create account with name, email, password, phone, and role
   - Password is hashed using bcryptjs

2. **User Login**
   ```bash
   POST /api/v1/auth/signin
   ```
   - Receive JWT token (valid for 7 days)
   - Use token in all protected endpoints

3. **Protected Requests**
   ```bash
   Authorization: Bearer <your_jwt_token>
   ```

---

## 🌐 API Endpoints

### 13 Total Endpoints

#### Authentication (2)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register new user |
| POST | `/api/v1/auth/signin` | Public | Login & receive token |

#### Vehicles (5)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin | Create new vehicle |
| GET | `/api/v1/vehicles` | Public | List all vehicles |
| GET | `/api/v1/vehicles/:vehicleId` | Public | Get vehicle details |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin | Update vehicle |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin | Delete vehicle |

#### Users (3)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin | List all users |
| PUT | `/api/v1/users/:userId` | Admin/Own | Update profile |
| DELETE | `/api/v1/users/:userId` | Admin | Delete user |

#### Bookings (3)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/bookings` | Auth | Create booking |
| GET | `/api/v1/bookings` | Auth | View bookings |
| PUT | `/api/v1/bookings/:bookingId` | Auth | Update booking |

---

## 📖 Usage Examples

### 1. Create Admin Account

```bash
POST /api/v1/auth/signup

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "SecurePass123",
  "phone": "01712345678",
  "role": "admin"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "01712345678",
    "role": "admin"
  }
}
```

### 2. Login

```bash
POST /api/v1/auth/signin

{
  "email": "admin@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "phone": "01712345678",
      "role": "admin"
    }
  }
}
```

### 3. Create Vehicle (Admin)

```bash
POST /api/v1/vehicles
Authorization: Bearer <admin_token>

{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

### 4. Create Booking (Customer)

```bash
POST /api/v1/bookings
Authorization: Bearer <customer_token>

{
  "customer_id": 2,
  "vehicle_id": 1,
  "rent_start_date": "2025-12-10",
  "rent_end_date": "2025-12-15"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "customer_id": 2,
    "vehicle_id": 1,
    "rent_start_date": "2025-12-10",
    "rent_end_date": "2025-12-15",
    "total_price": 250,
    "status": "active",
    "vehicle": {
      "vehicle_name": "Toyota Camry 2024",
      "daily_rent_price": 50
    }
  }
}
```

### 5. Cancel Booking (Customer)

```bash
PUT /api/v1/bookings/1
Authorization: Bearer <customer_token>

{
  "status": "cancelled"
}
```

---

## ✅ Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* resource data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed error message"
}
```

### HTTP Status Codes
| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server error |

---

## 🔒 Security Features

✅ **Password Security**
- Bcrypt hashing with 10 salt rounds
- Never stored in plain text
- Minimum 6 characters required

✅ **Authentication**
- JWT tokens with HS256 algorithm
- 7-day expiration
- Bearer token format

✅ **Authorization**
- Role-based access control
- Endpoint-level permission checks
- Customer ownership validation

✅ **Data Protection**
- SQL injection prevention
- Input validation
- Email format validation
- Date validation

✅ **Database Constraints**
- Foreign key relationships
- Unique constraints
- Cascading deletes
- Data type validation

---

## 💼 Business Logic

### Booking Price Calculation
```
total_price = daily_rent_price × number_of_days
number_of_days = (rent_end_date - rent_start_date)
```

### Vehicle Availability
- Vehicle must be "available" to create booking
- Status changes to "booked" when booking created
- Status changes to "available" when booking cancelled/returned

### Booking Restrictions
- End date must be after start date
- Customers can cancel before start date only
- Admin can mark as returned anytime
- Cannot delete user/vehicle with active bookings

---

## 📚 Additional Documentation

For detailed API specifications, see:
- **[API Reference](API_REFERENCE.md)** - Complete endpoint documentation

---

## 🧪 Testing

### Using Postman
1. Import API endpoints into Postman
2. Create environment variables for base URL and token
3. Follow examples in [API Reference](API_REFERENCE.md)

### Using cURL
```bash
# Create user
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@test.com","password":"Pass123","phone":"01912345","role":"customer"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Pass123"}'
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in .env file |
| Database connection error | Verify CONNECTION_STRING and PostgreSQL is running |
| JWT token expired | Login again to get new token |
| Permission denied (403) | Check user role and authorization header format |
| Booking cancellation blocked | Ensure booking date is in future (after today) |

---

## 📝 Notes

- Email addresses are stored in lowercase
- All timestamps are in UTC
- Password minimum length is 6 characters
- JWT tokens expire after 7 days
- Booking dates must be in YYYY-MM-DD format
- Vehicle types: 'car', 'bike', 'van', 'SUV'
- Booking status: 'active', 'cancelled', 'returned'

---

## 📞 Support

For issues or questions:
1. Check [API Reference](API_REFERENCE.md)
2. See troubleshooting section above

---

## 📄 License

This project is for educational purposes.

---

**Version:** 1.0.0
**Status:** Production Ready ✅
**Last Updated:** December 6, 2025