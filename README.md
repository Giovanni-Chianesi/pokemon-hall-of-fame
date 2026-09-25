# 🏆 Pokémon Hall of Fame

> Uma aplicação full-stack para registrar equipes campeãs de Pokémon/ROM Hacks e gerar análises táticas automáticas.

---

## ⚡ Tecnologias

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite
- **Serviço de Análise:** Python, FastAPI, Uvicorn

---

## ⚙️ Como Rodar

O projeto precisa dos 3 serviços rodando ao mesmo tempo. Clone o repositório e abra **3 terminais**:

### 1. Backend (Node.js)
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
# 🟢 Rodando em http://localhost:3333
2. Análise (Python)Bashcd analyzer-service
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
python main.py
# 🟢 Rodando em http://localhost:8000
3. Frontend (React)Bashcd frontend
npm install
npm run dev
# 🟢 Rodando em http://localhost:5173
📌 Estrutura dos ServiçosPlaintextpokemon-hall-of-fame/
├── backend/           # API REST em Node.js + Prisma (Porta 3333)
├── analyzer-service/  # Microsserviço de Análise em Python (Porta 8000)
└── frontend/          # Interface em React + Vite (Porta 5173)
🔗 Endpoints PrincipaisServiçoMétodoRotaDescriçãoBackendPOST/teamsCadastra um novo time no bancoBackendGET/teamsLista todos os times cadastradosBackendGET/teams/:idRetorna o time + análise tática do PythonPythonPOST/analyze-teamRecebe a equipe e retorna métricas