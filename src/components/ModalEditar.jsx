import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';

/**
 * Props:
 * - isVisible = Booleano que mostra o estado da janela
 * - vagaAtual = Objeto com os dados da vaga
 * - aoSalvar = Função do pai que recebe id e dadosNovos
 */

function ModalEditar({ isVisible, vagaAtual, aoCancelar, aoSalvar }) {
    // Hook que cria instância do formulário
    const [form] = Form.useForm();

    // sempre que a 'vagaAtual' mudar o form é resetado e preenchido com os novos dados
    useEffect(() => {
        if (vagaAtual) {
            form.setFieldsValue({
                titulo: vagaAtual.titulo,
                descricao: vagaAtual.descricao,
                salario: vagaAtual.salario
            });
        }
    }, [vagaAtual, form]); // Array de dependência

    const handleOk = () => {
        // retorna uma Promise. Só prossegue se estiver valido
        form.validateFields().then(values => {
            // chama a função do Pai enviando ID + dados novos
            aoSalvar(vagaAtual.id, values);
            form.resetFields();
        }).catch(info => {
            console.log('Erro de validação:', info);
        });
    };

    return (
        <Modal
            title="Editar Vaga"
            open={isVisible}
            onOk={handleOk}
            onCancel={aoCancelar}
            okText="Atualizar"
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical">
                <Form.Item name="titulo" label="Título" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="descricao" label="Descrição" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item name="salario" label="Salário" rules={[{ required: true }]}>
                    <Input type="number" prefix="R$" />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ModalEditar;