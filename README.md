# 🏆 Pokémon Hall of Fame Tracker

<p center="align">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
</p>

Uma aplicação Full-Stack desenvolvida para treinadores Pokémon registrarem seus times campeões da **League / Hall of Fame** através de múltiplos jogos e HackRoms. O sistema conta com uma arquitetura distribuída com API Node.js, microsserviço de análise estratégica em Python e interface moderna em React.

---

## 📐 Arquitetura do Sistema

```text
               ┌──────────────────────────────┐
               │    Frontend (React / Vite)   │
               └──────────────┬───────────────┘
                              │ HTTP (Porta 5173)
                              ▼
               ┌──────────────────────────────┐
               │   API Backend (Node + TS)    │
               └──────┬────────────────┬──────┘
                      │                │
  Prisma ORM (SQLite) │                │ HTTP (Porta 8000)
                      ▼                ▼
       ┌────────────────────┐   ┌──────────────────────────────┐
       │   dev.db (SQLite)  │   │ Analyzer Service (FastAPI)   │
       └────────────────────┘   └──────────────────────────────┘