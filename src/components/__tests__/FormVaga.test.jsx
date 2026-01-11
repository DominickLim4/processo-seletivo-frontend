import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormVaga from '../FormVaga';

// Mock
const mockSetFieldsValue = jest.fn();
const mockResetFields = jest.fn();

jest.mock('antd', () => {
  const MockForm = ({ children, onFinish }) => {
    return (
      <form
        data-testid="form-mock"
        onSubmit={(e) => {
          e.preventDefault();
          // Simula o envio com dados fictícios apenas para testar o fluxo
          onFinish && onFinish({ 
            titulo: 'Valor Mock', 
            descricao: 'Desc Mock', 
            salario: '1000' 
          });
        }}
      >
        {children}
      </form>
    );
  };

  // Mock dos subcomponentes do Form
  MockForm.Item = ({ children, label }) => (
    <div data-testid="form-item">
      <label>{label}</label>
      {children}
    </div>
  );
  
  // Mock do Hook useForm
  MockForm.useForm = () => [{
    setFieldsValue: mockSetFieldsValue,
    resetFields: mockResetFields,
  }];

  const MockInput = (props) => <input data-testid="input-text" aria-label={props.placeholder} {...props} />;
  MockInput.TextArea = (props) => <textarea data-testid="input-textarea" aria-label={props.placeholder} {...props} />;

  return {
    Form: MockForm,
    Input: MockInput,
    Button: ({ children, onClick, htmlType }) => (
      <button type={htmlType || 'button'} onClick={onClick}>
        {children}
      </button>
    ),
  };
});

// Mock dos ícones para não dar erro de import
jest.mock('@ant-design/icons', () => ({
  PlusOutlined: () => <span>+</span>,
  SaveOutlined: () => <span>💾</span>,
}));

describe('Componente <FormVaga /> (Mockado)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o formulário no modo Criação (campos vazios)', () => {
    render(<FormVaga dadosIniciais={null} aoSubmeter={() => {}} />);

    // Verifica se o resetFields foi chamado para garantir limpeza
    expect(mockResetFields).toHaveBeenCalled();

    // Verifica se os inputs estão na tela (pelo Label que mockamos)
    expect(screen.getByText(/Título da Vaga/i)).toBeInTheDocument();
    expect(screen.getByText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByText(/Salário/i)).toBeInTheDocument();

    // Verifica o texto do botão
    expect(screen.getByRole('button', { name: /Cadastrar Vaga/i })).toBeInTheDocument();
  });

  test('deve renderizar o formulário no modo Edição (preenche dados)', () => {
    const dadosMock = {
      titulo: 'Dev React',
      descricao: 'Vaga urgente',
      salario: 5000
    };

    render(<FormVaga dadosIniciais={dadosMock} aoSubmeter={() => {}} />);

    // Verifica se chamou a função do AntD para preencher os campos
    expect(mockSetFieldsValue).toHaveBeenCalledWith(dadosMock);

    // Verifica se o botão mudou o texto
    expect(screen.getByRole('button', { name: /Salvar Alterações/i })).toBeInTheDocument();
  });

  test('deve chamar aoSubmeter quando o botão for clicado', () => {
    const mockAoSubmeter = jest.fn();
    render(<FormVaga dadosIniciais={null} aoSubmeter={mockAoSubmeter} />);

    // Encontra o botão e clica
    const botao = screen.getByRole('button', { name: /Cadastrar Vaga/i });
    fireEvent.click(botao);

    // Como mockamos o Form para disparar o onFinish imediatamente ao submit:
    expect(mockAoSubmeter).toHaveBeenCalledTimes(1);
  });
});