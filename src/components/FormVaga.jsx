import { useState } from 'react'
import { Card, Input, Button, InputNumber, Form} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// Recebe 'aoCadastrar' do App.jsx
// Avisa o pai quando algo mudar
// Componente Stateless
function FormVaga({ aoCadastrar }) {

    // Hooks de Estado - Transforma em Variáveis Reativas
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [salario, setSalario] = useState('')

    const handleSubmit = () => {
        if (!titulo || !descricao || !salario) return;

        // Entrega o pacote
        aoCadastrar({
            titulo,
            descricao,
            salario: parseFloat(salario)
        })

        // Reseta o Forms
        setTitulo('')
        setDescricao('')
        setSalario('')
    }

    return (
        <Card title="Cadastrar Nova Vaga" variant='borderless' style={{ marginBottom: 20 }}>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Título da Vaga" required>
                    <Input 
                        placeholder="Ex: Dev Python Jr" 
                        value={titulo} 
                        onChange={e => setTitulo(e.target.value)} 
                    />
                </Form.Item>
                
                <Form.Item label="Descrição" required>
                    <Input.TextArea 
                        rows={3}
                        placeholder="Detalhes da vaga..." 
                        value={descricao} 
                        onChange={e => setDescricao(e.target.value)} 
                    />
                </Form.Item>

                <Form.Item label="Salário (R$)" required>
                    <Input 
                        type="number"
                        prefix="R$"
                        placeholder="0.00" 
                        value={salario} 
                        onChange={e => setSalario(e.target.value)} 
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                    Cadastrar Vaga
                </Button>
            </Form>
        </Card>
    );
}

export default FormVaga