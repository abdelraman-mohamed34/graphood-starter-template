# Graphood Starter Template

A flexible, production-ready Next.js multi-tenant starter template designed for seamless integration with **Graphood API v1**. 

This template provides a robust foundation for developers to quickly build and deploy multi-tenant applications connected to the Graphood platform with built-in server-side tenant resolution and React Query setup.

---

## 🚀 Features

* **Multi-Tenant Architecture:** Automatically detects and resolves tenants on the server side via subdomains or development sandboxes.
* **Next.js (App Router):** Built with the latest Next.js features, Server Components, and layouts.
* **API Integration Ready:** Pre-configured with secure API headers and authenticated calls to Graphood API v1.
* **State & Data Management:** Integrated with React Query providers out of the box.
* **Developer Friendly:** Clean project structure, TypeScript support, and strict type safety.

---

## 🛠️ Quick Start

Follow these steps to get your project up and running locally:

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/abdelraman-mohamed34/graphood-starter-template.git
cd graphood-starter-template
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory by copying the configuration variables. You can use the sandbox defaults for local testing:

\`\`\`env
GRAPHOOD_SERVER_BASE_URL=https://graphood-5x58.vercel.app
GRAPHOOD_SERVER_API_KEY=sk_test_sandbox
\`\`\`

### 4. Run the development server
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

\`\`\`text
├── src/
│   ├── app/                  # Next.js App Router (Layouts, pages, styles)
│   └── shared/               # Shared components, providers, and API services
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── package.json              # Project dependencies & scripts
└── README.md                 # Project documentation
\`\`\`

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
