import { Modal } from 'antd';

/**
 * Container para envolver outro componente
 */

function ModalWrapper({ titulo, visivel, aoFechar, children }) {
    return (
        <Modal
            title={titulo}
            open={visivel}
            onCancel={aoFechar}
            footer={null} // Controle do submit fica no FormVaga -- Isso é importante para não ter dois botões de confirmar (Antd)
            //destroyOnClose // Garante que o conteúdo seja destruído ao fechar
            destroyOnHidden // Mesma função de cima ^ mas atualizada
        >
            {children}
        </Modal>
    );
}

export default ModalWrapper;