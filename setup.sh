#!/bin/bash

# Script to finalize the portfolio Next.js setup

cd /Users/htrang/Downloads/portfolio-nextjs

# Create globals.css with proper content
cat > app/globals.css << 'ENDOFFILE'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --flutter-blue: #54C5F8;
  --flutter-blue-dark: #027DFD;
  --flutter-navy: #042B59;
  --bg-primary: #0A0E27;
  --bg-secondary: #13182E;
  --bg-card: #1A1F3A;
  --text-primary: #E8E9ED;
  --text-secondary: #9CA3AF;
  --border: #2A2F4A;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.7;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 30px); }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

@keyframes stars {
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 200%; }
}

.animate-stars {
  background-image: 
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, white, transparent),
    radial-gradient(2px 2px at 90% 60%, white, transparent),
    radial-gradient(1px 1px at 33% 80%, white, transparent),
    radial-gradient(1px 1px at 15% 90%, white, transparent);
  background-size: 200% 200%;
  background-position: 0% 0%;
  animation: stars 60s linear infinite;
}

.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--flutter-blue);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--flutter-blue-dark);
}
ENDOFFILE

echo "✅ globals.css created successfully!"
echo "🚀 Setup complete! Run 'npm run dev' to start the development server."
