import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import TextArea from '@mui/material/TextareaAutosize';
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
import { useApiRequestGet, useApiRequestSubmit } from '../../../../services/api';
import React, { useState, useContext } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { AuthContext } from '../../../../contexts/auth.context';
import { axiosApi } from '../../../../services/api';
import { toast } from 'react-toastify';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import "./style.css"



const schema = yup
  .object({
    concluidoEm: yup.date(),
    situacao: yup.string(),
  })
  .required();

const ModalConcluirProjeto = (props) => {
  const { handleFecharModalConcluirProjeto } = props;
  const { handleFecharModalForm } = props;
  const { projetosSelecionadoVisualizar } = props;


  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      concluidoEm: new Date(),
      situacao: 'ATIVO'
    },
  });


  const { token, session } = useContext(AuthContext);

  const { errors } = formState;

  // const [situacao, setSituacao] = useState('ATIVO'); 

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  // const {
  //   data: listaTipoProjeto,
  //   loading: loadingTipoProjeto,
  //   error: errorTipoProjeto,
  // } = useApiRequestGet('/tipos-projeto');


  const { data: projetoSelecionado, loading: loadingProjetoSelecionado } = useApiRequestGet(`/projetos/${projetosSelecionadoVisualizar}`);
  const handleCriarSecretaria = (data) => {
  
    if (session?.id === projetoSelecionado?.usuarioId || session.permissao.id === 1) {
      setLoading(true);
      data.situacao = 'INATIVO';
  
      axiosApi
      .put(`/projetos/${projetosSelecionadoVisualizar}`, data)
      .then(() => {
        // toast('Projeto concluído com sucesso!', {
        //   type: 'success',
        // });
        // window.location.reload();
        // // props.atualizarEtapas([...etapas, novaEtapa]);
        // reset();
        // handleFecharModalConcluirProjeto();
    toast('Projeto concluído com sucesso!', {
      type: 'success',
      autoClose: 1500,
    });
     setTimeout(() => {
        setLoading(false);
        handleFecharModalConcluirProjeto();
        window.location.reload();
      }, 1500); 

      })
      .catch((error) => {
        toast(error.message, {
          type: 'error',
        });
      })
    }
     else {
      // Display an error message or prevent the conclusion of the project
      toast('Você não tem permissão para concluir este projeto. Somente o usuário que criou.', {
        type: 'error',
      });
    }
  };
  // const { token, session } = useContext(AuthContext);


  //
  return (
    <Dialog disableEscapeKeyDown fullWidth open={true} onClose={handleFecharModalConcluirProjeto} maxWidth='sm'>
      <DialogTitle>
        <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component='h5'>Deseja finalizar a solicitação?</Typography>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='clos modal create project'
            onClick={handleFecharModalConcluirProjeto}
          >
            <Close color='action' />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Box component='form' noValidate onSubmit={handleSubmit(handleCriarSecretaria)}>
        <DialogContent dividers>
        <p>
          <span className='textRed'>Atenção:</span> Ao escolher finalizar a solicitação,você está concluindo por definitivo.</p>

       
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            startIcon={<Close width={24} />}
            variant='outlined'
            color='info'
            onClick={handleFecharModalConcluirProjeto}
            sx={{ minWidth: 156, height: '100%' }}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={loading}
            startIcon={<CheckOutlinedIcon width={24} />}
            variant='outlined'
            color='success'
            sx={{ minWidth: 156, height: '100%' }}

          >
            {!loading ? 'Finalizar' : <CircularProgress color='success' size={23} />}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

ModalConcluirProjeto.propTypes = {
  // handleFecharModalConcluirProjeto: PropTypes.func.isRequired,

};

export default ModalConcluirProjeto;
