import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import api from './api';

// --- MOCK DA API ---
vi.mock('./api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

describe('Componente App', () => {
    
    // TESTE 1: Renderização estática
    it('deve renderizar o título da página corretamente', () => {
        // simula que API retorna lista vazia
        // mockResolvedValue = simula uma promise resolvida
        api.get.mockResolvedValue({ data: [] });

        render(<App />);
        
        // procura um h1-h6 com nome sistema de vagas ou spassu vagas
        const titulo = screen.getByRole('heading', { name: /Sistema de Vagas|Spassu Vagas/i });
        
        expect(titulo).toBeInTheDocument();
    });

    // TESTE 2: Renderização Assíncrona ( dados da API )
    it('deve carregar e mostrar as vagas da API', async () => {
        const vagasFalsas = [
            { id: 1, titulo: "Vaga Teste Vitest", descricao: "Desc", salario: 5000 }
        ];
        // Ensina o mock a retornar os dados quando chamado
        api.get.mockResolvedValue({ data: vagasFalsas });

        render(<App />);

        // asset assincrono já que o useEffect demora alguns ms para rodar e atualizar o estado
        // waitFor: tenta rodar ate passar ou dar timeout
        await waitFor(() => {
            const itemLista = screen.getByText("Vaga Teste Vitest");
            expect(itemLista).toBeInTheDocument();
        });
    });
});