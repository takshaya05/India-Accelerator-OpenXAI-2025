# AI Country Dashboard 🌍

An interactive educational dashboard that helps users learn about countries using AI, quizzes, and 3D visualizations.

## 🚀 Project Overview
The AI Country Dashboard is a web-based platform providing:
- **3D Globe Simulator**: Explore countries with clickable features showing real-time data (population, GDP, climate, etc.).
- **Learning Hub**: Country-specific modules including Geography, History & Culture, Economy, and Current Affairs.
- **AI Chat Tutor**: Conversational AI powered by Ollama model to answer country-related questions.
- **Quiz & Games**: Interactive quizzes and flag-matching games for engaging learning.

The project aims to make learning about countries fun, interactive, and data-driven.

## 🛠 Features

### Landing Page
- Header & Logo
- Navigation Bar: Home, About, Dashboard, Contact Us
- Welcome Section with project info
- Flashcard navigation to the interactive dashboard
- Footer with contact info, social media links, copyright

### Interactive Dashboard
- **3D Globe Stimulator**: Clickable countries, highlights, real-time data, zoom & rotate
- **Learning Hub**: Country flashcards → detailed modules on Geography, History, Economy, Current Affairs
- **AI Chat Tutor**: Conversational AI with chat history
- **Quiz & Games**: User-selected country quizzes & interactive flag matching

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```
