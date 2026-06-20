# WE-Connect: Würth Elektronik Student Platform

WE-Connect is a modern, responsive web application designed for students to explore opportunities, attend events, develop skills, and engage with the Würth Elektronik community.

## 🚀 Features

- **Dashboard**: Personalized AI-curated opportunities, events, and mentors based on your profile and interests.
- **Opportunities Board**: Find internships, working student positions, and thesis topics with smart matching scores.
- **Events Hub**: Calendar and list views for hackathons, workshops, and guest lectures.
- **Community Chat**: Discord-style channels with reactions, threaded replies, and an anonymous posting mode.
- **Skills & Quizzes**: Verify your technical skills with timed quizzes and earn professional badges.
- **AI Career Companion**: Scripted AI chat to guide you through career paths and thesis preparation.
- **Admin Dashboard**: Analytics suite for WE staff to track engagement, funnel conversions, and active members.

## 🛠 Tech Stack

- **React 19**
- **Vite**
- **React Router** for seamless navigation
- **Chart.js** for admin analytics
- **Lucide React** for beautiful icons
- **CSS3** with a comprehensive custom variable design system

## 💻 How to Run Locally

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd WurthE
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **View the app**:
   Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173/`).

### Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## 🎨 Design System

The application uses a custom CSS architecture (`src/index.css`) built around Würth Elektronik's brand guidelines:
- **Primary Colors**: Würth Rot (`#CC0000`), Black, White
- **Highlights**: Cyan (`#009EE0`), Grün (`#B9C900`)
- **Typography**: Inter (UI), Outfit (Headings), JetBrains Mono (Technical)
