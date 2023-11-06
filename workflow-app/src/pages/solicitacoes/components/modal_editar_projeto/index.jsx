import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/CloseOutlined';
import Save from '@mui/icons-material/SaveAltOutlined';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { axiosApi, useApiRequestGet } from '../../../../services/api';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';



const ModalEditarProjeto = (props) => {
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [idSonner, setIdSonner] = useState('');
  const [descricao, setDescricao] = useState('');
  const [observacao, setObservacao] = useState('');
  const [valor, setValor] = useState(''); //passar para parseInt
  const [tipoProjetoId, setTipoProjetoId] = useState('');//passar para parseInt


  const { handleFecharModalForm } = props;
  const { projetosSelecionadoVisualizar } = props;
  const { data: projetoSelecionado, loading: loadingProjetoSelecionado } = useApiRequestGet(`/projetos/${projetosSelecionadoVisualizar}`);
  console.log("projetoSelecionado", projetoSelecionado)


  useEffect(() => {
    if (!loadingProjetoSelecionado && projetoSelecionado) {
      setTitulo(projetoSelecionado.titulo);
      setIdSonner(projetoSelecionado.idSonner);
      setDescricao(projetoSelecionado.descricao);
      setObservacao(projetoSelecionado.observacao);
      setValor(projetoSelecionado.valor);
      setTipoProjetoId(projetoSelecionado.tipoProjetoId)

    }
  }, [loadingProjetoSelecionado, projetoSelecionado]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      titulo: titulo,
      descricao: descricao,
      observacao: observacao,
      idSonner: parseInt(idSonner, 10),
      valor: parseInt(valor, 10),
      tipoProjetoId: parseInt(tipoProjetoId,10)
    };

    axiosApi
      .put(`/projetos/${projetosSelecionadoVisualizar}`, data)
      .then(() => {
        toast('Projeto atualizado com sucesso', {
          type: 'success',
        });
        setLoading(false);
      })
      .catch((error) => {
        toast(error.message, {
          type: 'error',
        });
        setLoading(false);
      });
    console.log("oq to mandando", data)
  };

  return (
    <Dialog disableEscapeKeyDown fullWidth open={true} onClose={props.handleFecharEditarProjeto} maxWidth='sm'>
      <DialogTitle>
        <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component='h5'>Editar Solicitação</Typography>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='clos modal create project'
            onClick={props.handleFecharEditarProjeto}
          >
            <Close color='action' />
          </IconButton>
        </Stack>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ paddingTop: 1 }}>
          <Grid container columnSpacing={2} rowSpacing={2} marginTop={0.5}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                value={idSonner}
                onChange={(e) => setIdSonner(e.target.value)}
                required
                fullWidth
                autoFocus
                label='Nº Sonner'
                type='number'
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <TextField
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                fullWidth
                required
                label='Título'
                type='text'
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <TextField
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                fullWidth
                required
                label='Observação'
                type='text'
              />
            </Grid>

            
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                fullWidth
                required
                label='Valor'
                type='number'
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <TextField
                value={tipoProjetoId}
                onChange={(e) => setTipoProjetoId(e.target.value)}
                fullWidth
                required
                label='Tipo Projeto'
                type='number'
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <TextField
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                fullWidth
                required
                label='Descrição'
                type='text'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            startIcon={<Close width={24} />}
            variant='outlined'
            color='info'
            onClick={handleFecharModalForm}
            sx={{ minWidth: 156, height: '100%' }}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={loading}
            startIcon={<Save width={24} />}
            variant='outlined'
            color='success'
            sx={{ minWidth: 156, height: '100%' }}
          >
            {!loading ? 'Salvar' : <CircularProgress color='success' size={23} />}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ModalEditarProjeto.propTypes = {
  handleFecharModalForm: PropTypes.func.isRequired,
};

export default ModalEditarProjeto;
