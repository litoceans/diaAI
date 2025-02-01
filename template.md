# AI & Manual Diagram Creator - SaaS Product Website

## Overview
Create a SaaS product website for generating responsive, dynamic, and visually appealing diagrams with two modes:

1. **AI Mode**: Automatically generate diagrams using AI by providing prompts.
2. **Manual Mode**: Manually add frames and edit diagrams using a mermaid-like editor on the left side, with a real-time diagram preview on the right side.

The tool will also enable users to combine multiple frames into a GIF to showcase workflows, project overviews, screens, features, and functionality.

---

## Features

### AI Mode
- **Input Prompt**: Users can provide a natural language description to generate diagrams.
- **AI-Powered Suggestions**: The system suggests layouts and designs based on context.
- **Customization**: Allow editing AI-generated diagrams for further refinements.

### Manual Mode
- **Mermaid-Like Editor**:
  - Left-side editor for creating and editing diagrams with a custom syntax.
  - Add multiple frames for different sections of the diagram.
- **Real-Time Preview**:
  - Right-side preview showing live updates of the diagram.
  - Display individual frames or a consolidated view.

### GIF Generation
- Combine multiple frames into a single GIF.
- Customize transition speed and duration between frames.
- Export diagrams as GIF, SVG, or PNG.

### Responsive Design
- Fully responsive UI/UX for both desktop and mobile.
- Optimized for performance and accessibility.

### Libraries and Tools
- **TailwindCSS**: For styling.
- **ShadCN UI Components**: To enhance user interface elements.
- **Framer Motion**: For animations and transitions.
- **Lucid Icons**: For clean and modern iconography.

---

## User Interface

### Main Layout
- **Header**:
  - Logo.
  - Navigation: "AI Mode," "Manual Mode," "About," "Contact."
- **Footer**:
  - Links to documentation, support, and social media.

### Signup Page
1. **Signup Form**:
   - Input fields for username, email, password, and confirm password.
   - Option to sign up with social media accounts.
   - Submit button with validation.
2. **Login Link**:
   - Redirect to login page if the user already has an account.

### Homepage
1. **Hero Section**:
   - Introduction to the product with a call-to-action button.
2. **Features Section**:
   - Highlight the key features of the platform.
3. **Testimonials**:
   - Display user feedback.
4. **Get Started Section**:
   - Button to navigate to the signup page.

### Dashboard
1. **User Overview**:
   - Welcome message and user profile summary.
2. **Remaining Credits**:
   - Display remaining credits for diagram creation.
3. **Quick Access**:
   - Links to "AI Mode," "Manual Mode," and "Export GIFs."
4. **Recent Projects**:
   - List of recently created diagrams.

### Profile Page
1. **User Information**:
   - Editable fields for username, email, and password.
2. **Subscription Details**:
   - Display current subscription plan and renewal options.
3. **Credit History**:
   - Track credits usage and purchases.

### Diagram Creator Page
#### AI Mode
1. **Input Section**:
   - Text input box for natural language prompts.
   - Generate button.
2. **Preview Section**:
   - Display generated diagrams.
   - Edit options for adjustments.

#### Manual Mode
1. **Editor**:
   - Left-side editor for inputting custom syntax.
   - Syntax examples and hints provided inline.
2. **Preview**:
   - Right-side real-time preview.
3. **Frame Management**:
   - Add, edit, and delete frames.
   - Frame navigation tabs.

### GIF Export Page
1. Select multiple frames.
2. Configure GIF settings (speed, transition effects).
3. Export button for downloading GIFs.

---

## Example Workflow
### AI Mode
1. Navigate to the "AI Mode" tab.
2. Enter a prompt: e.g., "Create a project overview diagram with three stages: planning, execution, and delivery."
3. AI generates the diagram with editable nodes and connections.
4. Refine as needed and export.

### Manual Mode
1. Navigate to the "Manual Mode" tab.
2. Use the left editor to write syntax for a diagram:
   ```mermaid
   graph TD;
   A[Start] --> B[Process];
   B --> C[End];
   ```
3. View the real-time preview on the right.
4. Add multiple frames for different sections of the workflow.
5. Combine all frames into a GIF.
6. Export the GIF or diagrams.

---

## Technical Stack
- **Frontend**: Next.js, TailwindCSS, ShadCN components.
- **Backend**: Node.js with AI integrations (e.g., OpenAI API for AI Mode).
- **Diagram Rendering**: Mermaid.js or custom renderer.
- **Animations**: Framer Motion.
- **Icons**: Lucid Icons.
- **GIF Creation**: Libraries like gif.js or similar.

---

## Additional Notes
- Ensure SEO optimization for the website.
- Include user guides and FAQs for both modes.
- Implement analytics to track usage patterns and feedback.

---

