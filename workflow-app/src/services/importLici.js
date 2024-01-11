import { useApiRequestGet } from '../services/api'

const ImportLicitacao = () => {
    const { data } = useApiRequestGet(`/processos-licitatorios`);
    localStorage.setItem('licitatorioData', JSON.stringify(data)); 
    return { data };
}

export default ImportLicitacao;