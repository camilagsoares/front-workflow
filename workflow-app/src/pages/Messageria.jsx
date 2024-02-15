import React, { useContext } from "react";
import { axiosApi, useApiRequestGet } from "../services/api";
import { useState } from 'react';
// import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import IconButton from '@mui/material/IconButton';
// import Close from '@mui/icons-material/CloseOutlined';
import Save from '@mui/icons-material/SaveAltOutlined';
// import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// import CircularProgress from '@mui/material/CircularProgress';
// import MenuItem from '@mui/material/MenuItem';
// import InputAdornment from '@mui/material/InputAdornment';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
import { ListItem } from "@mui/material";
import { AuthContext } from "../contexts/auth.context";

export default function Messageria() {
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleButtonClick = (userId) => {
        setSelectedUserId(userId);
    };

    const { data, error, loading } = useApiRequestGet('/auth/usuarios');
    const { dataMensagem } = useApiRequestGet('/mensagem/recebidas')

    const { session, token } = useContext(AuthContext);

    const schema = yup
        .object({
            mensagem: yup.string(),
            remetente_id: yup.number(),
            receptor_id: yup.number()

        })
        .required();

    const { register, handleSubmit, formState, control, reset, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            mensagem: '',
            remetente_id: session.id,
            receptor_id: selectedUserId

        },
    });
    const { errors } = formState;

    const handleMessage = (data) => {
        axiosApi
            .post('/mensagem/enviadas', { ...data })
            .then(() => {
                reset();
            })
            .catch((error) => {
                toast(error.message, {
                    type: 'error',
                });
            });
        console.log("oq to mandando", data)
    };



    return (
        <div>
            
            Messageria

            <Box component='form' noValidate onSubmit={handleSubmit(handleMessage)}>
                <DialogContent dividers sx={{ paddingTop: 1 }}>
                    <Grid container columnSpacing={2} rowSpacing={2} marginTop={0.5}>
                        <Grid item xs={12} sm={10} md={10}>
                            <TextField
                                {...register('mensagem')}
                                required
                                fullWidth
                                autoFocus
                                label='Texto'
                                type='text'
                                error={!!errors.mensagem}
                                helperText={errors.mensagem?.message}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '500px' }}>
                        {!loading &&
                            data &&
                            data.length &&
                            data.map((user) => (
                                <ListItem key={user.id} value={user.id} >
                                    <Button variant="outlined" onClick={() => handleButtonClick(user.id)}>
                                        {user.nome} - ID {user.id}
                                    </Button>
                                </ListItem>
                            ))}
                    </div>


                    <Button
                        type='submit'
                        // disabled={loading || isButtonDisabled}
                        startIcon={<Save width={24} />}
                        variant='outlined'
                        color='success'
                        sx={{ minWidth: 156, height: '100%' }}
                    >
                        Enviar
                        {/* {!loading ? 'Adicio
                        nar' : <CircularProgress color='success' size={23} />} */}
                    </Button>
                </DialogActions>
            </Box>


        </div>
    )
}

