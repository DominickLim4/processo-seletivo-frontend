# 📘 Manual Técnico: Sistema de Vagas (Frontend)

> **Projeto de Avaliação Técnica**

---

## 1. Arquitetura e Decisões Técnicas

O frontend foi construído para ser responsivo, desacoplado e resiliente

### 1.1. Stack Tecnológica
* **Core:** React.js + Vite.
* **UI Library:** Ant Design (v5)
* **HTTP Client:** Axios
* **Testes:** Vitest + React Testing Library + JSDOM

---

## 2. Guia de Instalação e Execução

### Pré-requisitos
1.  **Node.js** (v16 ou superior)
2.  Backend rodando na porta `8000`

### Passo a Passo

1.  **Instalar Dependências:**
    ```bash
    cd nome-da-pasta
    npm install
    ```

2.  **Rodar Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    Acesse em: `http://localhost:5173`

---

## 3. Testes Unitários

Para garantir que a interface não quebrou:

```bash
npm run test