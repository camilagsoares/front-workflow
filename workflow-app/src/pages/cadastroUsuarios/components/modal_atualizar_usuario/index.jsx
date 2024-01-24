import PropTypes from 'prop-types';
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
import { useApiRequestSubmit } from '../../../../services/api';
import React, { useContext, useState,useEffect } from 'react';
import { AuthContext } from '../../../../contexts/auth.context';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import { useApiRequestGet, axiosApi } from '../../../../services/api';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { toast } from 'react-toastify';


const ModalFormAtualizarUsuario = (props) => {
  const { projetosSelecionadoVisualizar } = props;
  const { handleAbrirModalAtualizarEtapaProjeto } = props;
  const { handleFecharModalForm } = props;

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [responsavelSecretaria, setResponsavelSecretaria] = useState(false)



  // const { errors } = formState;
  const { session } = useContext(AuthContext);
  // const { handleAbrirDrawerView } = props;
  const { data: listaDptos, loading: loadingTiposProjeto } = useApiRequestGet('/departamentos');
  const { data: listaPermissao, loading: loadingPermissao } = useApiRequestGet('/auth/permissoes');
  const [loading, setLoading] = useState(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { data, loading: loadingUsuarioSelecionado } = useApiRequestGet(`/auth/usuarios/${projetosSelecionadoVisualizar}`);
// console.log(data)
  useEffect(() => {
    if (!loadingUsuarioSelecionado && data) {
      setNome(data.nome);
      setEmail(data.email);
      setSenha(data.senha);
      setTelefone(data.telefone);    
      setResponsavelSecretaria(data.responsavelSecretaria);

    }
  }, [loadingUsuarioSelecionado, data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      nome: nome,
      email: email,
      senha: senha,
      telefone: telefone,
      responsavelSecretaria: responsavelSecretaria,
    };

    axiosApi
      .put(`auth/usuarios/${projetosSelecionadoVisualizar}`, data)
      .then(() => {
        toast('Usuario  atualizado com sucesso', {
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
      console.log("data",data)
  };
  return (
    <React.Fragment>
      {/* <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpen(false)} severity='success' sx={{ width: '100%' }}>
          Senha alterada com sucesso!
        </Alert>
      </Snackbar> */}
      <Dialog disableEscapeKeyDown fullWidth open={true} onClose={props.handleFecharDrawerView} maxWidth='md'>
        <DialogTitle>
          <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography component='h5'>Editar usuário</Typography>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='close modal change password'
              onClick={props.handleFecharDrawerView}
            >
              <Close color='action' />
            </IconButton>
          </Stack>
        </DialogTitle>
        {/* <Box component='form' noValidate onSubmit={handleSubmit(handleCriarSecretaria)}>
          <DialogContent dividers sx={{ paddingTop: 1 }}>
            <Grid container columnSpacing={2} rowSpacing={2} marginTop={0.5}>
              <Grid item xs={12} sm={12} md={9}>
                <TextField
                  {...register('nome')}
                  defaultValue={formData.nome}
                  required
                  fullWidth
                  autoFocus
                  label='Nome'
                  type='text'
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3}>
                <TextField
                  {...register('email')}
                  defaultValue={formData.email}
                  fullWidth
                  required
                  label='Email'
                  type='text'
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  {...register('senha')}
                  defaultValue={formData.senha}
                  fullWidth
                  required
                  label='Senha'
                  type='password'
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  {...register('telefone')}
                  defaultValue={formData.telefone}
                  fullWidth
                  required
                  label='Telefone'
                  type='text'
                  error={!!errors.telefone}
                  helperText={errors.telefone?.message}
                />
              </Grid>
           
              <Grid sx={{ marginLeft: '20px' }}>
                <FormControlLabel
                  control={
                    <Controller
                      name='responsavelSecretaria'
                      control={control}
                      render={({ field }) => <Checkbox {...field} color='primary' />}
                    />
                  }
                  label='Secretaria'
                />
              </Grid>
            </Grid>

            {showSuccessMessage && (
              <Box mt={2} display='flex' justifyContent='center' alignItems='center'>
                <Alert severity='success'>
                  <AlertTitle>Successo</AlertTitle>
                  Usuário criado com sucesso!
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
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
              startIcon={<Save width={24} />}
              variant='outlined'
              color='success'
              sx={{ minWidth: 156, height: '100%' }}
            >
              {!loading ? 'Salvar' : <CircularProgress color='success' size={23} />}
            </Button>
          </DialogActions>
        </Box> */}
        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ paddingTop: 1 }}>
            <Grid container columnSpacing={2} rowSpacing={2} marginTop={0.5}>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                  label='Nome'
                  type='text'
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                  label='Email'
                  type='text'
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                  label='Senha'
                  type='text'
                />
              </Grid>


              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                  label='Telefone'
                  type='text'
                />
              </Grid>


              {/* <Grid item xs={12} sm={12} md={12}>
                <TextField
                  value={responsavelSecretaria}
                  onChange={(e) => setResponsavelSecretaria(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                  label='Responsavel Secretaria'
                  type='number'
                />
              </Grid> */}

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
    </React.Fragment>
  );
};

ModalFormAtualizarUsuario.propTypes = {
  // handleFecharModalForm: PropTypes.func.isRequired,
  handleFecharDrawerView: PropTypes.func.isRequired,
  projetosSelecionadoVisualizar: PropTypes.number,
  // handleAbrirModalAtualizarEtapaProjeto: PropTypes.func.isRequired,
};

ModalFormAtualizarUsuario.defaultProps = {
  projetosSelecionadoVisualizar: null,
};

export default ModalFormAtualizarUsuario;
