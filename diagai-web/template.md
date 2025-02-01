# MyDiagram Project Structure and Requirements

## Project Overview

We are developing a SaaS product: a text-to-GIF and text-to-image diagram generator. Each user has a daily limit of 10 credits, where text-to-GIF consumes 3 credits, and text-to-image consumes 1 credit. The application must feature skeleton loading for all screens, exceptional UI/UX with animations, responsiveness for all screen sizes, and breadcrumbs for navigation.

---

## Development Stacks

### Frontend
- **Framework:** Next.js
- **UI Libraries:** Material-UI (MUI), MUI Icons, Tailwind CSS
- **Diagram Rendering:** Mermaid.js
- **Code Editor:** @monaco-editor/react
- **GIF Generation:** gif.js, html2canvas
- **Animations:** Framer Motion
- **Icons:** Lucid Icons
- **Authentication:** Firebase

### Backend
- **Framework:** FastAPI
- **Data Validation:** Pydantic
- **Database:** MongoDB
- **Authentication:** Firebase, JWT
- **Encryption/Decryption:** Legacy encryption for sensitive fields

---

## Features

### Authentication
- **JWT Authentication:** Secure user authentication using JWT.
- **Firebase Integration:** Signup and login with Firebase.

### Encryption
- **Legacy Encryption/Decryption:** Sensitive fields such as user details are encrypted before storing in the database.

### Skeleton Loading
- All screens include skeleton loaders for a better user experience during data fetches.

### Error Handling
- **Frontend:** Comprehensive error boundaries using `useContext`.
- **Backend:** REST API error handling with proper status codes and detailed error messages.

---

## Screens

### User Screens

#### Landing Page
- **Features:**
  - Illustrations, icons, and animations explaining the product.
  - "Get Started" button leading to signup/login.
- **UI/UX:**
  - Use Framer Motion for animations.
  - Skeleton loader while fetching dynamic content.

#### Sidebar
- **Features:**
  - Visible only after user login.
  - Displays links to Dashboard, Projects, Pricing, Profile, Billing, Logout.
  - Shows remaining credits.

#### Signup/Login
- **Features:**
  - Google Firebase-based signup/login.
  - Animations and illustrations for an engaging experience.

#### Dashboard
- **Features:**
  - Displays credit usage via animated charts.
  - Overview of total generated images and GIFs.

#### Projects
- **Features:**
  - List of projects with name, creation date, and total generated content.
  - "Add New Project" button opens a modal to input project name.
  - Placeholder with icon and message if no projects exist.

#### Project Details
- **Features:**
  - Displays project name and all generated diagrams.
  - "Generate Diagram" button opens a modal to select type (GIF/Image).
  - Textbox input for prompts with a file attachment button.

#### Image Editor
- **Features:**
  - Displays generated diagram output.
  - Options to regenerate and add AI suggestions.
  - GIF editing: Arrange frames as in a video editor and generate GIFs.
  - "Download" and "Share" buttons.

#### Pricing
- **Features:**
  - Displays free and paid plans.
  - Highlights features like watermark removal and priority support for paid users.

#### Profile
- **Features:**
  - Displays user details.
  - Editable fields for updating profile.

---

### Admin Screens

#### Admin Login
- **Features:**
  - Username and password authentication.
  - Skeleton loader during authentication.

#### Admin Dashboard
- **Features:**
  - Displays user statistics, usage metrics, and generation counts.

#### View Projects
- **Features:**
  - List of projects with generation results.

#### View All Profiles
- **Features:**
  - User details with options to update credits, account status, and plan type.

---

## API Endpoints

### User Authentication
- **POST /signup:** Firebase-based user signup.
- **POST /login:** JWT-based login verification.

### User Management
- **GET /profile:** Fetch user profile details.
- **PATCH /profile:** Update profile information.

### Projects
- **GET /projects:** List all user projects.
- **POST /projects:** Create a new project.
- **GET /projects/{project_id}:** Retrieve details of a specific project.

### Diagrams
- **POST /generate-diagram:** Generate a new diagram (image/GIF).
- **GET /diagrams/{diagram_id}:** Retrieve specific diagram details.

### Admin Management
- **POST /admin/login:** Admin authentication.
- **GET /admin/users:** List all registered users.
- **PATCH /admin/users/{user_id}:** Update user details (credits, plan).

---

## Database Models

### User Model
```python
class User(BaseModel):
    id: str
    email: str
    credits: int
    plan: str
    account_status: str
    encrypted_field: str
```

### Project Model
```python
class Project(BaseModel):
    id: str
    user_id: str
    name: str
    created_at: datetime
    diagrams: List[str]
```

---

## Requirements

### Frontend
```plaintext
@monaco-editor/react
mermaid.js
gif.js
html2canvas
framer-motion
material-ui
@mui/icons-material
tailwindcss
firebase
```

### Backend
```plaintext
fastapi
pydantic
uvicorn
motor
firebase-admin
python-jose
celery
python-multipart
aioredis
loguru
pytest
cryptography
```

---

## Additional Notes

- Responsive design across all devices.
- Comprehensive API documentation.
- Optimized backend for scalability.
- User-friendly error messages with clear actions.

