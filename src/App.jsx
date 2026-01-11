import { useState, useEffect } from 'react';
import api from './api';
import { Layout, Typography, message, Spin, Button, Space } from 'antd';
import { RocketOutlined, FileExcelOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';

// Importando componentes
import FormVaga from './components/FormVaga';
import ListaVagas from './components/ListaVagas';
import ModalEditar from './components/ModalEditar';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {

    // --- ESTADOS ---

    const [vagas, setVagas] = useState([]); // Lista principal de dados
    const [loading, setLoading] = useState(false);
    
    // Estados do Modal de Edição
    const [modalVisivel, setModalVisivel] = useState(false);
    const [vagaEmEdicao, setVagaEmEdicao] = useState(null);
    
    // Estado para travar os botões de donwload durante o processamento
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
            message.error('Erro ao buscar vagas do servidor.');
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

    // --- Abre o Modal, guarda os dados da vaga
    function prepararEdicao(vaga) {
        setVagaEmEdicao(vaga); 
        setModalVisivel(true); 
    }

    // --- UPDATE 
    // Chamada pelo ModalEditar
    async function atualizarVaga(id, dadosAtualizados) {
        try {
            await api.put(`vagas/${id}/`, dadosAtualizados);
            message.success('Vaga atualizada com sucesso!');

            // limpeza
            setModalVisivel(false); 
            setVagaEmEdicao(null);  
            carregarVagas();        
        } catch (error) {
            console.error(error);
            message.error('Erro ao atualizar vaga.');
        }
    }

    // --- DOWNLOAD ASSÍNCRONO
    const solicitarDownload = async (formato) => {
        try {
            setExportando(true); // trava o botão pra evitar clique duplo
            message.loading(`Gerando ${formato.toUpperCase()}...`, 1);

            // inicia a tarefa no Celery
            const { data } = await api.post('vagas/exportar_relatorio/', { formato });
            const taskId = data.task_id;

            // começa a monitorar
            verificarStatus(taskId);

        } catch (error) {
            console.error(error);
            message.error("Erro ao iniciar exportação");
            setExportando(false);
        }
    };

    // Função recursiva pra ver se já acabou
    const verificarStatus = async (taskId) => {
        try {
            const { data } = await api.get(`vagas/status_tarefa/${taskId}/`);

            if (data.status === 'CONCLUIDO' && data.url) {
                // SUCESSO
                message.success("Arquivo pronto! Baixando...");
                setExportando(false);
                
                // forçar o download em nova aba
                const downloadUrl = `http://127.0.0.1:8000${data.url}`;
                window.open(downloadUrl, '_blank'); 

            } else {
                // tenta de novo em 2s (recursão)
                setTimeout(() => verificarStatus(taskId), 2000);
            }
        } catch (error) {
            console.error("Erro no polling:", error);
            message.error("Erro ao verificar arquivo");
            setExportando(false);
        }
    };

    // Renderização
    return (
        <Layout className="layout" style={{ minHeight: '100vh' }}>
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
                
                {/* botões de exportação */}
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
                    
                    {/* componente de cadastro */}
                    <FormVaga aoCadastrar={cadastrarVaga} />

                    {/* lista com loading */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 50 }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <ListaVagas 
                            lista={vagas} 
                            aoDeletar={removerVaga}
                            aoEditar={prepararEdicao} 
                        />
                    )}
                </div>
            </Content>
            
            <Footer style={{ textAlign: 'center' }}>
                Sistema de Vagas 2026 - Spassu Processo Seletivo
            </Footer>

            {/* modal de edição */}
            <ModalEditar 
                isVisible={modalVisivel}
                vagaAtual={vagaEmEdicao}
                aoCancelar={() => setModalVisivel(false)}
                aoSalvar={atualizarVaga}
            />
        </Layout>
    );
}

export default App;