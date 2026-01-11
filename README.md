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

## Testes

Este projeto utiliza **Jest** e **React Testing Library** para garantir a qualidade do código.

### Estratégia de Testes

Como esse projeto utiliza **Ant Design 6** e **React 19** em ambientes de teste simulados, foi adotado a estratégia de **Mocking de Componentes de UI**
Isso significa que, nos testes unitários, os componentes visuais do Ant Design (`Form`, `Input`, `Button`) são substituídos por versões simplificadas, garantindo: 
- Testes mais rápidos
- Foco na lógica de negócio e fluxo de dados, não na biblioteca de estilos
- Eliminação de falsos negativos causados por animações ou APIs de navegador ausentes

### Comandos Disponíveis

Rodar todos os testes:
```bash
npm test