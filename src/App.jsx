import { useState, useEffect } from 'react';
import api from './api';
import { Layout, Typography, message, Spin, Button, Space } from 'antd';
import { RocketOutlined, FileExcelOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';

// Importando componentes
import FormVaga from './components/FormVaga';
import ListaVagas from './components/ListaVagas';
import ModalWrapper from './components/ModalWrapper';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {

    // --- ESTADOS ---

    const [vagas, setVagas] = useState([]); // Lista principal de dados
    const [loading, setLoading] = useState(false);
    
    // Estados do Modal de Edição
    const [modalVisivel, setModalVisivel] = useState(false);
    const [vagaEmEdicao, setVagaEmEdicao] = useState(null);
    
    // Estado de exportação
    const [exportando, setExportando] = useState(false);

    // CRUD

    // --- READ
    async function carregarVagas() {
        setLoading(true); 
        try {
            const { data } = await api.get('vagas/');
            setVagas(data); // atualiza a lista
        } catch (error) {
            console.error(error);
            message.error('Erro ao buscar vagas.');
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        carregarVagas();
    }, []);


    // --- CREATE
    async function cadastrarVaga(novaVaga) {
        try {
            await api.post('vagas/', novaVaga);
            message.success('Vaga criada com sucesso!');
            carregarVagas();
        } catch (error) {
            console.error(error);
            message.error('Erro ao cadastrar vaga.');
        }
    }


    // --- DELETE
    async function removerVaga(id) {
        try {
            await api.delete(`vagas/${id}/`);
            message.success('Vaga removida!');
            carregarVagas();
        } catch (error) {
            console.error(error);
            message.error('Erro ao excluir.');
        }
    }

    // Prepara e abre o modal
    function abrirEdicao(vaga) {
        setVagaEmEdicao(vaga);
        setModalVisivel(true);
    }

    // --- UPDATE
    async function atualizarVaga(dados) {
        try {
            await api.put(`vagas/${vagaEmEdicao.id}/`, dados);
            message.success('Vaga atualizada!');
            
            fecharModal(); // Usa a função auxiliar para limpar tudo
            carregarVagas();
        } catch (error) {
            console.error(error);
            message.error('Erro ao atualizar.');
        }
    }

    // Função auxiliar para fechar e limpar estado
    function fecharModal() {
        setModalVisivel(false);
        setVagaEmEdicao(null);
    }

    // --- DOWNLOAD ASSÍNCRONO
    const solicitarDownload = async (formato) => {
        try {
            setExportando(true);
            message.loading(`Gerando ${formato.toUpperCase()}...`, 1);

            const { data } = await api.post('vagas/exportar_relatorio/', { formato });
            const taskId = data.task_id;
            verificarStatus(taskId);

        } catch (error) {
            console.error(error);
            message.error("Erro ao iniciar exportação");
            setExportando(false);
        }
    };

    const verificarStatus = async (taskId) => {
        try {
            const { data } = await api.get(`vagas/status_tarefa/${taskId}/`);

            if (data.status === 'CONCLUIDO' && data.url) {
                message.success("Arquivo pronto! Baixando...");
                setExportando(false);
                const downloadUrl = `http://127.0.0.1:8000${data.url}`;
                window.open(downloadUrl, '_blank'); 

            } else {
                setTimeout(() => verificarStatus(taskId), 2000);
            }
        } catch (error) {
            console.error("Erro no polling:", error);
            message.error("Erro ao verificar arquivo");
            setExportando(false);
        }
    };

    return (
        <Layout className="layout" style={{ minHeight: '100vh' }}>
            {/* Header Restaurado */}
            <Header style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                backgroundColor: '#201547',
                padding: '0 24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <RocketOutlined style={{ color: 'white', fontSize: '24px', marginRight: 10 }} />
                    <Title level={3} style={{ color: 'white', margin: 0 }}>
                        Sistema de Vagas
                    </Title>
                </div>
                
                <Space>
                    <Button 
                        type="primary" 
                        icon={exportando ? <LoadingOutlined /> : <FilePdfOutlined />} 
                        onClick={() => solicitarDownload('pdf')}
                        disabled={exportando}
                        danger 
                    >
                        PDF
                    </Button>
                    <Button 
                        type="primary" 
                        icon={exportando ? <LoadingOutlined /> : <FileExcelOutlined />} 
                        onClick={() => solicitarDownload('excel')}
                        disabled={exportando}
                        style={{ backgroundColor: '#217346', borderColor: '#217346' }}
                    >
                        Excel
                    </Button>
                </Space>
            </Header>
            
            <Content style={{ padding: '0 50px', marginTop: 30 }}>
                <div className="site-layout-content" style={{ maxWidth: 900, margin: '0 auto' }}>
                    
                    {/* Formulário de Criação */}
                    <div style={{ background: '#fff', padding: 24, marginBottom: 20, borderRadius: 8 }}>
                        <h3>Cadastrar Nova Vaga</h3>
                        <FormVaga 
                            dadosIniciais={null} 
                            aoSubmeter={cadastrarVaga} 
                            textoBotao="Cadastrar Vaga"
                        />
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
                    ) : (
                        <ListaVagas 
                            lista={vagas} 
                            aoDeletar={removerVaga}
                            aoEditar={abrirEdicao} 
                        />
                    )}
                </div>
            </Content>
            
            {/* Footer */}
            <Footer style={{ textAlign: 'center' }}>
                Sistema de Vagas 2026 - Spassu Processo Seletivo
            </Footer>

            {/* Modal com Formulário de Edição */}
            <ModalWrapper 
                titulo="Editar Vaga"
                visivel={modalVisivel}
                aoFechar={fecharModal} // Função que limpa o estado
            >
                <FormVaga 
                    dadosIniciais={vagaEmEdicao} 
                    aoSubmeter={atualizarVaga}
                    textoBotao="Salvar Alterações"
                />
            </ModalWrapper>

        </Layout>
    );
}

export default App;