<div align="center">
  <img src="public/chai.webp" alt="ChaiCourseGPT Logo" width="120" height="120" style="border-radius: 20px;">

  # ChaiCourseGPT

  **Your AI Coding Instructor Powered by Hitesh Choudhary's Teaching Style**

  [![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)](https://openai.com/)
  [![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-DC382D?style=for-the-badge)](https://qdrant.tech/)

  🔗 **[GitHub Repository](https://github.com/Rithb898/ChaiCourseGPT)** | 🚀 **[Live Demo](https://chaicoursegpt.vercel.app)**

  *Namaste! Seedhi si baat hai - Learn coding faster with your AI assistant that speaks your language.*
</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

ChaiCourseGPT is an intelligent AI coding assistant that brings **Hitesh Choudhary's** unique teaching style to your fingertips. Built with cutting-edge AI technology, it provides instant, personalized coding help with a touch of Hinglish charm that makes learning both effective and enjoyable.

### What Makes ChaiCourseGPT Special?

- **🧠 Smart AI Assistant**: Powered by advanced language models with RAG (Retrieval-Augmented Generation)
- **🎓 Hitesh's Teaching Style**: Authentic explanations in the beloved "Seedhi si baat hai" approach
- **⚡ Instant Responses**: Get immediate answers with precise source references and timestamps
- **🔍 Advanced Search**: HyDE (Hypothetical Document Embeddings) for better content retrieval
- **📚 Course Integration**: Direct access to course materials with lesson-specific guidance
- **🌙 Modern UI**: Beautiful, responsive interface with dark theme and smooth animations

---

## ✨ Key Features

### 🤖 Intelligent AI Assistance
- **Context-Aware Responses**: Understands your coding questions and provides relevant explanations
- **Code Debugging Help**: Instant assistance with debugging and error resolution
- **Best Practices**: Learn industry-standard coding practices and patterns
- **Multi-Language Support**: Help with JavaScript, React, Node.js, Python, and more

### 🎯 Advanced Retrieval System
- **Vector Database Integration**: Powered by Qdrant for semantic search
- **HyDE Technology**: Hypothetical Document Embeddings for improved search accuracy
- **Smart Re-ranking**: AI-powered relevance scoring for better results
- **Source Attribution**: Every answer comes with precise course references

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Chat**: Smooth, interactive conversation interface
- **Syntax Highlighting**: Beautiful code display with multiple language support
- **Source Cards**: Visual course references with timestamps and lesson details
- **Copy-to-Clipboard**: Easy code sharing and copying functionality

### 🔧 Developer Features
- **TypeScript**: Full type safety and better development experience
- **Modern React**: Built with React 19 and Next.js 15
- **Component Library**: Radix UI components for accessibility
- **Design System**: Consistent styling with Tailwind CSS
- **Performance Optimized**: Fast loading with Turbopack and optimizations

---

## 🛠 Technology Stack

### Frontend
- **[Next.js 15.5.0](https://nextjs.org/)** - React framework with App Router
- **[React 19.1.0](https://react.dev/)** - UI library with latest features
- **[TypeScript 5.0](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### AI & Backend
- **[OpenAI GPT-4](https://openai.com/)** - Primary language model
- **[Groq](https://groq.com/)** - Fast inference for specific tasks
- **[LangChain](https://langchain.com/)** - AI application framework
- **[Qdrant](https://qdrant.tech/)** - Vector database for embeddings
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - AI integration toolkit

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **pnpm** (recommended) or npm/yarn
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rithb898/ChaiCourseGPT.git
   cd ChaiCourseGPT
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables** (see [Environment Setup](#-environment-setup))

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🔐 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# AI Gateway Configuration
AI_GATEWAY_API_KEY=your_ai_gateway_api_key_here

# Qdrant Vector Database
QDRANT_URL=your_qdrant_instance_url_here

# Optional: Direct API Keys (if not using AI Gateway)
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Required API Keys

1. **AI Gateway API Key**:
   - Sign up at [Vercel AI Gateway](https://vercel.com/ai)
   - Create a new gateway and get your API key

2. **Qdrant Database**:
   - Create a free account at [Qdrant Cloud](https://cloud.qdrant.io/)
   - Set up a new cluster and get the connection URL

3. **Alternative Setup**:
   - Get OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
   - Get Groq API key from [Groq Console](https://console.groq.com/)

### Database Setup

The application expects a Qdrant collection named `chaicode-course` with course content embeddings. You'll need to:

1. Prepare your course content (transcripts, lessons, etc.)
2. Generate embeddings using OpenAI's `text-embedding-3-large` model
3. Upload the embeddings to your Qdrant collection

---

## 💡 Usage

### Basic Chat Interface

1. **Start a Conversation**: Type your coding question in the chat input
2. **Get AI Responses**: Receive detailed explanations in Hitesh's teaching style
3. **View Sources**: Click on source cards to see lesson references
4. **Copy Code**: Use the copy button on code blocks for easy sharing

### Example Queries

```
"How do I create a React component?"
"Explain JavaScript closures with examples"
"What's the difference between let and const?"
"How to handle async operations in Node.js?"
"Debug this React useEffect hook"
```

### Advanced Features

- **Follow-up Questions**: Continue the conversation for deeper understanding
- **Code Debugging**: Paste your code and ask for help
- **Best Practices**: Ask about coding standards and patterns
- **Course Navigation**: Get specific lesson recommendations

---

## 📡 API Documentation

### Chat API Endpoint

**POST** `/api/chat`

Processes user messages and returns AI-generated responses with source references.

#### Request Body
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How do I create a React component?"
    }
  ]
}
```

#### Response Format
```json
{
  "message": "Haan ji! Let me explain how to create a React component...",
  "sources": [
    {
      "id": "source-1",
      "technology": "React",
      "lessonNumber": "5",
      "lessonTopic": "Creating Components",
      "startTime": "02:15:30",
      "endTime": "02:18:45",
      "relevanceScore": 0.95
    }
  ]
}
```

#### Key Features
- **HyDE Integration**: Uses Hypothetical Document Embeddings for better retrieval
- **Smart Re-ranking**: AI-powered relevance scoring
- **Source Consolidation**: Groups related content by lesson
- **Error Handling**: Graceful fallbacks for API failures

### RAG Pipeline

The application uses a sophisticated Retrieval-Augmented Generation pipeline:

1. **Query Processing**: User input is analyzed and rewritten for better search
2. **HyDE Generation**: Creates hypothetical ideal answers for improved retrieval
3. **Vector Search**: Searches Qdrant database using multiple query strategies
4. **Re-ranking**: AI re-ranks results based on relevance and context
5. **Response Generation**: Generates final response using retrieved context

---

## 📁 Project Structure

```
ChaiCourseGPT/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/               # API routes
│   │   └── 📁 chat/          # Chat API endpoint
│   ├── 📁 chat/              # Chat page
│   ├── favicon.ico           # App favicon
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── 📁 components/            # React components
│   ├── 📁 ai-elements/       # AI-specific components
│   ├── 📁 ui/                # UI component library
│   ├── SourceCard.tsx        # Source reference cards
│   └── theme-provider.tsx    # Theme management
├── 📁 constants/             # App constants
│   └── prompts.ts            # AI prompts and templates
├── 📁 lib/                   # Utility libraries
│   ├── design-system.ts      # Design tokens and utilities
│   ├── embeddings.ts         # OpenAI embeddings config
│   ├── utils.ts              # General utilities
│   └── vttLoader.ts          # VTT file processing
├── 📁 public/                # Static assets
│   ├── chai.webp             # Logo and branding
│   ├── hiteshchoudhary.webp  # Profile images
│   └── *.svg                 # Icon assets
├── components.json           # Shadcn/ui configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

### Key Directories

- **`app/`**: Next.js 13+ App Router with file-based routing
- **`components/`**: Reusable React components with TypeScript
- **`lib/`**: Utility functions, configurations, and shared logic
- **`constants/`**: Application constants and AI prompt templates
- **`public/`**: Static assets served directly by Next.js

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork the repository**
   ```bash
   git fork https://github.com/Rithb898/ChaiCourseGPT.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types for new code
   - Update tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   pnpm dev          # Test locally
   pnpm build        # Test production build
   pnpm lint         # Check code quality
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Create a Pull Request**
   - Provide a clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### Contribution Guidelines

- **Code Style**: Follow the existing TypeScript and React patterns
- **Commits**: Use conventional commit messages (feat, fix, docs, etc.)
- **Testing**: Ensure your changes don't break existing functionality
- **Documentation**: Update README and code comments as needed

### Areas for Contribution

- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **New Features**: Add new AI capabilities or UI improvements
- 📚 **Documentation**: Improve guides and API documentation
- 🎨 **UI/UX**: Enhance the user interface and experience
- ⚡ **Performance**: Optimize loading times and responsiveness
- 🧪 **Testing**: Add unit tests and integration tests

---

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy ChaiCourseGPT is using [Vercel](https://vercel.com/):

1. **Connect your repository** to Vercel
2. **Set environment variables** in the Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rithb898/ChaiCourseGPT)

### Manual Deployment

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Start the production server**
   ```bash
   pnpm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

```bash
AI_GATEWAY_API_KEY=your_production_api_key
QDRANT_URL=your_production_qdrant_url
NODE_ENV=production
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Rith Banerjee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

### Author
**Rith Banerjee** - Full Stack Developer & AI Enthusiast

- 🐙 **GitHub**: [@Rithb898](https://github.com/Rithb898)
- 💼 **LinkedIn**: [Rith Banerjee](https://www.linkedin.com/in/rith-banerjee/)
- 🐦 **Twitter**: [@rithcoderr](https://x.com/rithcoderr)
- 📧 **Email**: [Contact via GitHub](https://github.com/Rithb898)

### Acknowledgments

- **Hitesh Choudhary** - For the inspiring teaching style and methodology
- **Chai aur Code** - For the amazing coding community
- **OpenAI** - For providing powerful language models
- **Vercel** - For the excellent deployment platform
- **Qdrant** - For the vector database technology

---

<div align="center">

  ### 🙏 Thank You for Using ChaiCourseGPT!

  *Seedhi si baat hai - Happy coding! 🚀*

  **If this project helped you, please consider giving it a ⭐ on GitHub!**

  ---

  Made with ❤️ by [Rith Banerjee](https://github.com/Rithb898) | Powered by Hitesh Choudhary's Teaching Philosophy

</div>
