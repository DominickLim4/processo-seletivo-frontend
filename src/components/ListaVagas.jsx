// src/components/ListaVagas.jsx
import { List, Button, Typography, Tag, Space, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, DollarOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Componente Stateless
// Recebe lista pronta e funções pra avisar quando clicar (aoDeletar. aoEditar)
function ListaVagas({ lista, aoDeletar, aoEditar }) {
    return (
        <List
            header={<div style={{ padding: '0 16px' }}>
                    Vagas Abertas ({lista.length})
                    </div>}
            variant='borderless'
            dataSource={lista}
            style={{ backgroundColor: 'white' }}
            renderItem={(item) => (
                <List.Item
                    style={{ padding: '16px 24px' }}
                    actions={[
                        // Botão de Editar
                        <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            onClick={() => aoEditar(item)}
                        >
                            Editar
                        </Button>,
                        
                        // Botão de Excluir com confirmação
                        <Popconfirm
                            title="Tem certeza que deseja excluir?"
                            onConfirm={() => aoDeletar(item.id)}
                            okText="Sim"
                            cancelText="Não"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />}>
                                Excluir
                            </Button>
                        </Popconfirm>
                    ]}
                >
                    <List.Item.Meta
                        title={<Text strong>{item.titulo}</Text>}
                        description={item.descricao}
                    />
                    <Space>
                        <Tag icon={<DollarOutlined />} color="green">
                            R$ {item.salario}
                        </Tag>
                    </Space>
                </List.Item>
            )}
        />
    );
}

export default ListaVagas;