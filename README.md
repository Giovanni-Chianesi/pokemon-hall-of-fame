# 🏆 Pokémon Hall of Fame Tracker

> Aplicação Full-Stack em arquitetura de microsserviços para registrar, gerenciar e analisar times campeões do Hall da Fama de Pokémon (Jogos Oficiais e HackRoms).

---

## 🏗️ Arquitetura do Sistema

```text
                  ┌──────────────────────────────┐
                  │    Frontend (React + Vite)   │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │   Backend API (Node + TS)    │
                  └──────┬────────────────┬──────┘
                         │                │
     Prisma ORM (SQLite) │                │ HTTP
                         ▼                ▼
          ┌────────────────────┐   ┌──────────────────────────────┐
          │   dev.db (SQLite)  │   │ Analyzer Service (FastAPI)   │
          └────────────────────┘   └──────────────────────────────┘
🧰 Tecnologias
Back-end: Node.js, TypeScript, Express, Prisma ORM, SQLite

Análise: Python, FastAPI, Uvicorn

Front-end: React, TypeScript, Vite

📌 Pré-requisitos
Node.js v18+

Python v3.10+

Git

⚡ Instalação e Execução
1. Back-end (API Principal)
Bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar e sincronizar o banco de dados
npx --no-install prisma generate
npx --no-install prisma db push

# Iniciar o servidor (Porta 3333)
npm run dev
2. Microsserviço de Análise (Python)
Bash
# Entrar na pasta do microsserviço
cd analyzer-service

# Criar e ativar ambiente virtual (Windows CMD)
python -m venv venv
.\venv\Scripts\activate

# Instalar dependências
pip install fastapi uvicorn requests

# Iniciar o serviço (Porta 8000)
python main.py
3. Front-end (Interface Web)
Bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar a aplicação
npm run dev
