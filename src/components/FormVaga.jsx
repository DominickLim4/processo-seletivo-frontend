import { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';

/**
 * Componente de Formulário Unificado
 * @param {Object} props
 * @param {Object} props.dadosIniciais - Se vier preenchido é Edição. null, é Criação
 * @param {Function} props.aoSubmeter - Função que recebe os dados do form (onFinish)
 * @param {String} props.textoBotao - Texto do botão de ação
 */

function FormVaga({ dadosIniciais, aoSubmeter, textoBotao }) {
    const [form] = Form.useForm(); // Hook

    // Monitora mudanças nos dadosIniciais
    // Se mudou preenche o form
    // Se veio null reseta o form
    useEffect(() => {
        if (dadosIniciais) {
            form.setFieldsValue(dadosIniciais);  // Preenche
        } else {
            form.resetFields(); // Limpa
        }
    }, [dadosIniciais, form]);

    const handleFinish = (values) => {
        // Tratamento de Dados
        const dadosFormatados = {
            ...values,
            salario: parseFloat(values.salario)
        };
        
        aoSubmeter(dadosFormatados);
        
        // Limpa o form após salvar
        if (!dadosIniciais) {
            form.resetFields();
        }
    };

    return (
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleFinish}
            initialValues={dadosIniciais}
        >

            <Form.Item 
                name="titulo" 
                label="Título da Vaga" 
                rules={[{ required: true, message: 'Por favor, insira o título!' }]}
            >
                <Input placeholder="Ex: Dev Python Jr" />
            </Form.Item>
            
            <Form.Item 
                name="descricao" 
                label="Descrição" 
                rules={[{ required: true, message: 'Insira uma descrição!' }]}
            >
                <Input.TextArea rows={4} placeholder="Detalhes da vaga..." />
            </Form.Item>

            <Form.Item 
                name="salario" 
                label="Salário (R$)" 
                rules={[{ required: true, message: 'Insira o salário!' }]}
            >
                <Input 
                    type="number" 
                    prefix="R$" 
                    placeholder="0.00" 
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={dadosIniciais ? <SaveOutlined /> : <PlusOutlined />} 
                    block
                >
                    {textoBotao || (dadosIniciais ? 'Salvar Alterações' : 'Cadastrar Vaga')}
                </Button>
            </Form.Item>
        </Form>
    );
}

export default FormVaga;