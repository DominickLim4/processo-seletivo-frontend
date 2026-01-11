import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalWrapper from '../ModalWrapper';

describe('Componente <ModalWrapper />', () => {

    test('não deve mostrar o conteúdo quando visivel={false}', () => {
        render(
            <ModalWrapper visivel={false} titulo="Teste" aoFechar={() => {}}>
                <div data-testid="conteudo-filho">Conteúdo Secreto</div>
            </ModalWrapper>
        );

        // queryByTestId retorna null se não achar (diferente de getBy que dá erro)
        const conteudo = screen.queryByTestId('conteudo-filho');
        expect(conteudo).not.toBeInTheDocument();
    });

    test('deve mostrar o conteúdo e o título quando visivel={true}', () => {
        render(
            <ModalWrapper visivel={true} titulo="Título do Modal" aoFechar={() => {}}>
                <div>Conteúdo Visível</div>
            </ModalWrapper>
        );

        // O Modal do AntD renderiza no body, mas o testing-library consegue achar via baseElement
        expect(screen.getByText('Título do Modal')).toBeInTheDocument();
        expect(screen.getByText('Conteúdo Visível')).toBeInTheDocument();
    });

    test('deve chamar aoFechar quando clicar no cancelar/fechar', () => {
        const mockAoFechar = jest.fn();

        render(
            <ModalWrapper visivel={true} titulo="Teste" aoFechar={mockAoFechar}>
                <p>Oie</p>
            </ModalWrapper>
        );

        // Busca o botão de fechar (o X no canto superior ou o Cancelar se houvesse)
        // O AntD coloca um aria-label="Close" no botão X
        const botaoFechar = screen.getByRole('button', { name: /close/i });
        
        fireEvent.click(botaoFechar);

        expect(mockAoFechar).toHaveBeenCalledTimes(1);
    });
});