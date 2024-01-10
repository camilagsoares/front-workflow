import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import AddCircle from '@mui/icons-material/AddCircleOutline';
import FilterAlt from '@mui/icons-material/FilterAltOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Lista from './components/lista';
import ModalForm from './components/modal_form';
import { useState, useContext } from 'react';
import DrawerView from './components/drawer_view';
import ModalAtualizarEtapasProjeto from './components/modal_atualizarEtapasProjeto';
import ModalAdicionarProcessoLicitatorio from './components/modal_adicionar_processo_licitatorio';
import ModalEditarProjeto from './components/modal_editar_projeto';
import InputAdornment from '@mui/material/InputAdornment';
import { AuthContext } from "../../contexts/auth.context"
import ModalConcluirProjeto from "./components/modal_concluir_projeto"
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { useApiRequestGet } from '../../services/api';
import ModalPrioridadeProjeto from "./components/modal_prioridade_projeto/index"
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import "./styles.css"
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { MenuItem } from '@mui/material';


const requiredField = 'Campo obrigatorio';

const schema = yup
  .object({
    tipoProjetoId: yup.number().required(requiredField),
  })
  .required();

const SolicitacoesPage = () => {

  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {

      tipoProjetoId: '',

    },
  });

  const { errors } = formState;

  const [modalFormAberto, abrirFecharModalForm] = useState(false);
  const [modalFormAtualizarEtapa, abrirFecharModalFormAtualizarEtapa] = useState(false);
  const [modalFormConcluir, abrirFecharModalConcluir] = useState(false);
  const [modalFormPrioridade, abrirFecharModalPrioridade] = useState(false);

  const [modalFormAdicionarProcessoLicitatorio, abrirFecharModalFormAdicionarProcessoLicitatorio] = useState(false);
  const [drawerViewAberto, abrirFecharDrawerView] = useState(false);
  const [projetosSelecionadoVisualizar, setProjetosSelecionadoVisualizar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editarProjetoAberto, abrirFecharEditarProjeto] = useState(false);
  const [concluirProjetoAberto, abrirFecharConcluirProjeto] = useState(false)
  const [proridadeProjetoAberto, abrirFecharPrioridadeProjeto] = useState(false)

  const handleFecharModalForm = () => abrirFecharModalForm(false);
  const handleAbrirModalForm = () => abrirFecharModalForm(true);

  const handleAbrirDrawerView = (idProjeto) => {
    abrirFecharDrawerView(true);
    setProjetosSelecionadoVisualizar(idProjeto);
  };
  const handleFecharDrawerView = () => abrirFecharDrawerView(false);

  const handleFecharEditarProjeto = () => abrirFecharEditarProjeto(false);

  const handleFecharConcluirProjeto = () => abrirFecharConcluirProjeto(false);

  const handleFecharPrioridadeProjeto = () => abrirFecharModalPrioridade(false);

  const handleFecharModalConcluirProjeto = () => abrirFecharModalConcluir(false);

  const handleFecharModalAtualizarEtapaProjeto = () => abrirFecharModalFormAtualizarEtapa(false);

  const handleAbrirModalAtualizarEtapaProjeto = (idProjeto) => {
    setProjetosSelecionadoVisualizar(idProjeto);
    abrirFecharModalFormAtualizarEtapa(true);
  };

  const handleFecharAdcPLic = () => abrirFecharModalFormAdicionarProcessoLicitatorio(false);
  const handleAbrirAdcPLic = () => abrirFecharModalFormAdicionarProcessoLicitatorio(true);

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleAbrirEditarProjeto = (idProjeto) => {
    abrirFecharEditarProjeto(true);
    setProjetosSelecionadoVisualizar(idProjeto);
  };

  //
  const handleAbrirModalConcluirProjeto = (idProjeto) => {
    setProjetosSelecionadoVisualizar(idProjeto);
    abrirFecharModalConcluir(true);
  };

  const handleAbrirModalPrioridadeProjeto = (idProjeto) => {
    setProjetosSelecionadoVisualizar(idProjeto);
    abrirFecharModalPrioridade(true);
  };


  const [clickedProjectIds, setClickedProjectIds] = useState([]);
  const [selectedProjectIdSonner, setSelectedProjectIdSonner] = useState([])



  const handleIncluirClick = (projetoId, idSonner) => {
    if (clickedProjectIds.includes(projetoId)) {
      setClickedProjectIds((prevClickedProjectIds) =>
        prevClickedProjectIds.filter((id) => id !== projetoId)
      );
      setSelectedProjectIdSonner((prevSelectedProjectIdSonnars) =>
        prevSelectedProjectIdSonnars.filter((id) => id !== idSonner)
      );
    } else {
      setClickedProjectIds((prevClickedProjectIds) => [
        ...prevClickedProjectIds,
        projetoId,
      ]);
      setSelectedProjectIdSonner((prevSelectedProjectIdSonnars) => [
        ...prevSelectedProjectIdSonnars,
        idSonner,
      ]);
    }
  };


  // TESTE ocultar botão alterar
  const [mostrarBotaoAlterar, setMostrarBotaoAlterar] = useState(true);
  const [statusId, setStatusId] = useState('');
  //
  const { session, token } = useContext(AuthContext);

  const [projetosConcluidos, setProjetosConcluidos] = useState([]);


  //
  const [conclusionText, setConclusionText] = useState("");


  //
  const [filterByUrgent, setFilterByUrgent] = useState(false); // Initialize with 'all' to show all projects

  const [filterByAta, setFilterByAta] = useState('all');

  const handleFilterByAtaChange = (event) => {
    const newValue = event.target.value;

    // Check if the selected option is "Urgente" and set filterByAta accordingly
    if (newValue === "urgent") {
      setFilterByAta("urgent");
    } else {
      setFilterByAta(newValue);
    }
  };


  //
  const [conclusionDate, setConclusionDate] = useState(null);

  //filtro por dpto
  const [filterByDepartamento, setFilterByDepartamento] = useState('all');
  const { data: listaDptos } = useApiRequestGet('/departamentos');


  const handleFilterByDepartamentoChange = (event) => {
    const newValue = event.target.value;
    setFilterByDepartamento(newValue);
  };


  //filtrar por secretaria

  const [filterBySecretaria, setFilterBySecretaria] = useState('');
  const [secretariaCounts, setSecretariaCounts] = useState({});

  const { data, loading } = useApiRequestGet('/projetos');
  const [secretarias, setSecretarias] = useState([]);
  const handleFilterBySecretariaChange = (event) => {
    const newValue = event.target.value;
    setFilterBySecretaria(newValue);
  };



  useEffect(() => {

    // const resultAtivo = !loading && data?.filter((resposta) => resposta.situacao === 'ATIVO' && resposta.prioridadeProjeto === true)

    // const resultInativo = !loading && data?.filter((resposta) => resposta.situacao === 'INATIVO')

    // const resultDepartamento =  data?.filter((resposta) => resposta.usuario[0]?.departamento?.nome);

    // const resultSecretaria =  data?.map((resposta) => resposta.usuario?.departamento?.secretaria?.sigla);



  })



  useEffect(() => {
    if (data) {
      const secretariaCounts = {};
      data.forEach((projeto) => {
        const secretariaNome = projeto?.etapa[0]?.departamento?.secretaria?.nome || '';
        if (!secretariaCounts[secretariaNome]) {
          secretariaCounts[secretariaNome] = 1;
        }
      });
      setSecretariaCounts(secretariaCounts);
    }
  }, [data]);

  const { data: listaTiposProjeto, loading: loadingTiposProjeto
  } = useApiRequestGet('/tipos-projeto');




  // teste filtro tipo projeto
  const [selectedTipoProjeto, setSelectedTipoProjeto] = useState('');
  const [secretariaOptions, setSecretariaOptions] = useState([]);

  const [uniqueSecretarias, setUniqueSecretarias] = useState([]);
  const [selectedSecretaria, setSelectedSecretaria] = useState("");

  useEffect(() => {
    if (listaDptos && listaDptos.length) {
      const uniqueSecretarias = [];
      listaDptos.forEach((departamento) => {
        const secretariaNome = departamento.secretaria.nome;
        if (!uniqueSecretarias.includes(secretariaNome)) {
          uniqueSecretarias.push(secretariaNome);
        }
      });
      setUniqueSecretarias(uniqueSecretarias);
    }
  }, [listaDptos]);

  useEffect(() => {
    setFilterBySecretaria(selectedSecretaria);
  }, [selectedSecretaria]);

  const [expanded, setExpanded] = useState(false);

  const toggleFilters = () => {
    setExpanded(!expanded);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));





  const [etapasProjeto, setEtapasProjeto] = useState([]);

  const atualizarEtapasProjeto = (novaEtapa) => {
    setEtapasProjeto((etapasAntigas) => [...etapasAntigas, novaEtapa]);
  };

  useEffect(() => {
    atualizarEtapasProjeto()
  }, [])



  // teste novaEtapa simultaneo
  const [drawerViewUpdate, setDrawerViewUpdate] = useState(0);

  const handleDrawerViewUpdate = () => {
    setDrawerViewUpdate((prev) => prev + 1);
  };



  const listaTiposProjetoComTodos = [{ id: '', descricao: 'Todos' }, ...(listaTiposProjeto || [])];


  // ---------------------------------FILTRO DPTO - SECRETARIA ----------------------------
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    if (!loading) {
      const uniqueOptionsSet = new Set();

      // Filter out duplicates and create unique options
      data?.forEach((resposta) => {
        const optionLabel = `${resposta.usuario?.departamento?.nome} - ${resposta.usuario?.departamento?.secretaria?.sigla}`;
        uniqueOptionsSet.add(optionLabel);
      });

      // Convert Set back to an array
      const filteredOptions = Array.from(uniqueOptionsSet).map((label) => ({
        value: label,
        label,
      }));

      setFilterOptions(filteredOptions);
    }
  }, [data, loading]);

  const handleFilterChange = (selectedOption) => {
    setSelectedFilter(selectedOption);
  };

  const StyledFiltros = () => {
    let isUsuarioNormal = session.permissao.id !== 1;

    return {
      marginBottom: isUsuarioNormal ? '140px' : '-90px'
    }
  }

  const styles = StyledFiltros();

  //
  const [selectedYear, setSelectedYear] = useState(2024);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  //
  const [selectedSecretariaFilter, setSelectedSecretariaFilter] = useState(null);

  const handleSecretariaFilterChange = (selectedOption) => {
    setSelectedSecretariaFilter(selectedOption);
  };

  useEffect(() => {
    if (!loading) {
      const uniqueOptionsSet = new Set();

      data?.forEach((resposta) => {
        const optionLabel = `${resposta.usuario?.departamento?.secretaria?.nome} - ${resposta.usuario?.departamento?.secretaria?.sigla}`;
        uniqueOptionsSet.add(optionLabel);
      });

      const filteredOptions = Array.from(uniqueOptionsSet).map((label) => ({
        value: label,
        label,
      }));

      setFilterOptions(filteredOptions);
    }
  }, [data, loading]);

  //
  const isCriarLicButtonVisible = session && (session.permissao.id === 1 || session.permissao.id === 2);


  return (
    <Box>


      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component='h2' variant='h5' fontWeight={700} color='text.primary'>
          Solicitações
        </Typography>

        <Grid container justifyContent="flex-end" alignItems="center" sx={{ marginLeft: '15px', marginTop: '-px' }}>
          <div className="box">
            <div className="item">
              <span className="bolinhaCinza"></span>
              Andamento
            </div>
            <div className="item">
              <span className="bolinhaVerde"></span>
              Concluído
            </div>
            <div className="item">
              <span className="bolinhaLaranja"></span>
              Urgente
            </div>
          </div>
        </Grid>


      </div>
      <Divider />


      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' paddingY={2}>
        <Box >
          <Button
            startIcon={<AddCircle />}
            variant='outlined'
            color='primary'
            onClick={handleAbrirModalForm}
            sx={{ width: '200px', height: '41px', marginRight: '10px' }}
          >
            Criar solicitação
          </Button>
          
          {isCriarLicButtonVisible && (
            <Button
              startIcon={<AddCircle />}
              variant='outlined'
              color='primary'
              onClick={handleAbrirAdcPLic}
              sx={{ width: '180px', height: '42px' }}
            >
              Criar Licitação
            </Button>
          )}

          <TextField
            size="small"
            variant="outlined"
            color="primary"
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterAlt color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Pesquisar"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#1976D2',
                },
                '&:hover fieldset': {
                  borderColor: '#1976D2',
                },
                '& input': {
                  color: 'gray',
                  textTransform: 'none',
                  fontWeight: '100',
                },
                '& input::placeholder': {
                  color: '#1976D2',
                  textTransform: 'uppercase',
                  fontWeight: '400',
                },
              },
              width: '200px',
              marginLeft: isCriarLicButtonVisible ? '10px' : '2px',
            }}
          />

        </Box>


      </Box>

      <div style={{ marginTop: '20px' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
          <Grid item xs={6} sm={1} sx={{ width: '100px', height: '50px' }}>
            <FormControl size="small" variant="outlined" color="primary" sx={{ width: '100%', height: '100%' }}>
              <InputLabel htmlFor="filter-ata">Filtro status</InputLabel>
              <Select
                native
                value={filterByAta}
                onChange={handleFilterByAtaChange}
                label="Filtrar por Ata"
                inputProps={{
                  id: "filter-ata"
                }}
              >
                <option value="all">Todos</option>
                <option value="concluded">Concluído</option>
                <option value="urgent">Urgente</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2} sx={{ width: '100px', height: '50px' }}>
            <Controller
              name='tipoProjetoId'
              control={control}
              render={({ field }) => {
                const { onChange, name, onBlur, value, ref } = field;

                return (
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={listaTiposProjetoComTodos}
                    getOptionLabel={(tipoprojeto) => tipoprojeto.descricao}
                    value={
                      value !== undefined
                        ? listaTiposProjeto &&
                        listaTiposProjeto.find((item) => item.id === value)
                        : null
                    }
                    // onChange={(event, newValue) => {
                    //   const selectedValue = newValue ? newValue.id : '';
                    //   setSelectedTipoProjeto(selectedValue);
                    //   onChange(selectedValue);
                    // }}
                    onChange={(event, newValue) => {
                      const selectedValue = newValue ? newValue.id : '';
                      setSelectedTipoProjeto(selectedValue);
                      onChange(selectedValue);
                    }}
                    onBlur={onBlur}
                    isOptionEqualToValue={(option, value) => option.id === value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Tipo Solicitação'
                        variant='outlined'
                        name={name}
                        error={!!errors.tipoProjetoId}
                        helperText={errors.tipoProjetoId?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: loadingTiposProjeto && (
                            <InputAdornment position='start'>
                              <CircularProgress color='info' size={28} sx={{ marginRight: 2 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ width: '100%', height: '100%' }}
                      />
                    )}
                  />
                );
              }}
            />
          </Grid>
          {session && (session.permissao.id === 1 || session.id === 39) && (
            <>
              <Grid item xs={6} sm={2} sx={{ width: '100px', height: '50px' }}>
                <Autocomplete
                  fullWidth
                  options={listaDptos || []}
                  getOptionLabel={(departamento) => `${departamento.secretaria.sigla} - ${departamento.nome}`}
                  value={
                    listaDptos &&
                    listaDptos.find((item) => item.nome === filterByDepartamento)
                  }
                  onChange={(event, newValue) => {
                    const selectedValue = newValue ? newValue.nome : 'all';
                    setFilterByDepartamento(selectedValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filtrar por Departamento Criado em"
                      variant="outlined"
                      size="small"
                      color="primary"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        ...params.InputProps,
                        id: 'filter-departamento',
                      }}
                      sx={{ width: '100%', height: '100%' }}
                    />
                  )}
                />
              </Grid>

            </>
          )}


          {session && (session.permissao.id === 1 || session.id === 39) && (
            <>
              <Grid item xs={6} sm={2} sx={{ width: '100px', height: '50px' }}>
                <Autocomplete
                  fullWidth
                  options={['', ...uniqueSecretarias]}
                  value={selectedSecretaria}
                  onChange={(event, newValue) => {
                    setSelectedSecretaria(newValue);
                  }}
                  getOptionLabel={(option) => option === '' ? 'Todos' : option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filtrar por Secretaria parado em"
                      variant="outlined"
                      size="small"
                      color="primary"
                      InputProps={{
                        ...params.InputProps,
                        id: 'filter-secretaria',
                      }}
                      sx={{ width: '100%', height: '100%' }}
                    />
                  )}
                />
              </Grid>

            </>
          )}

          {session && (session.permissao.id === 1 || session.id === 39) && (
            <>
              <Grid item xs={2} sx={{ width: '120px', height: '40px' }}>
                <Autocomplete
                  options={filterOptions}
                  getOptionLabel={(option) => option.label}
                  style={{ width: '100%', height: '100%' }}
                  value={selectedFilter}
                  onChange={(e, selectedOption) => handleFilterChange(selectedOption)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Criado por Departamento"
                      variant="outlined"
                      size="small"
                      color="primary"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: '100%', height: '100%' }}
                    />
                  )}
                />
              </Grid>
            </>
          )}

          <Grid item xs={6} sm={1} sx={{ width: '100px', height: '50px' }}>
            <FormControl size="small" variant="outlined" color="primary" sx={{ width: '100%', height: '100%' }}>
              <InputLabel htmlFor="filter-ata">Filtro por Ano</InputLabel>
              <Select
                labelId="select-year-label"
                id="select-year"
                value={selectedYear}
                label="Filtrar por ano"
                onChange={(e) => handleYearChange(Number(e.target.value))}
              >
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
              </Select>
            </FormControl>
          </Grid>


          {session && (session.permissao.id === 1 || session.id === 39) && (
            <>
              <Grid item xs={6} sm={2} sx={{ width: '100px', height: '50px' }}>


                <Autocomplete
                  options={filterOptions}
                  getOptionLabel={(option) => option.label}
                  style={{ width: '100%', height: '100%' }}
                  value={selectedSecretariaFilter}
                  onChange={(e, selectedOption) => handleSecretariaFilterChange(selectedOption)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Criado por Secretaria"
                      variant="outlined"
                      size="small"
                      color="primary"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: '100%', height: '100%' }}
                    />
                  )}
                />
              </Grid>
            </>
          )}

        </Grid>

      </div>



      {/* <br /><br />
      <br />
 */}


      {/* <label>Filtrar por ano:</label>
      <select value={selectedYear} onChange={(e) => handleYearChange(Number(e.target.value))}>
        <option value={2024}>2024</option>
        <option value={2023}>2023</option>
      </select> */}

      <Lista
        searchTerm={searchTerm}
        handleAbrirDrawerView={handleAbrirDrawerView}
        handleAbrirEditarProjeto={handleAbrirEditarProjeto}
        handleIncluirClick={handleIncluirClick}
        clickedProjectIds={clickedProjectIds}
        projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
        filterByAta={filterByAta}
        filterByDepartamento={filterByDepartamento}
        filterBySecretaria={filterBySecretaria}
        handleAbrirModalPrioridadeProjeto={handleAbrirModalPrioridadeProjeto}
        filterByUrgent={filterByUrgent}
        selectedTipoProjeto={selectedTipoProjeto}
        // FILTRO DPTO-SECRETARIA
        selectedYear={selectedYear}
        selectedFilter={selectedFilter}
        selectedSecretariaFilter={selectedSecretariaFilter}

      />

      {modalFormAberto && <ModalForm handleFecharModalForm={handleFecharModalForm}
      //  handleFecharModalAtualizarEtapaProjeto={handleFecharModalAtualizarEtapaProjeto}
      />}

      {modalFormAtualizarEtapa && (
        <ModalAtualizarEtapasProjeto
          handleFecharModalForm={handleFecharModalForm}
          handleFecharModalAtualizarEtapaProjeto={handleFecharModalAtualizarEtapaProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          //teste
          // etapasProjeto={etapasProjeto}
          // setEtapasProjeto={setEtapasProjeto}
          // atualizarEtapasProjeto={atualizarEtapasProjeto}
          onNovaEtapaCriada={atualizarEtapasProjeto}
          handleDrawerViewUpdate={handleDrawerViewUpdate}
        />
      )}

      {modalFormAdicionarProcessoLicitatorio && (
        <ModalAdicionarProcessoLicitatorio
          clickedProjectIds={clickedProjectIds}
          handleFecharAdcPLic={handleFecharAdcPLic}
          handleIncluirClick={handleIncluirClick}
          handleFecharModalForm={handleFecharModalForm}

          //teste
          selectedProjectIdSonner={selectedProjectIdSonner}
        />
      )}

      {drawerViewAberto && (
        <DrawerView
          handleFecharDrawerView={handleFecharDrawerView}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}
          handleAbrirModalConcluirProjeto={handleAbrirModalConcluirProjeto}

          //
          setConclusionDate={setConclusionDate}
          //teste
          // etapas={etapas}
          // etapasProjeto={etapasProjeto}
          etapasProjeto={etapasProjeto}
          drawerViewUpdate={drawerViewUpdate}

        />
      )}

      {editarProjetoAberto && (
        <ModalEditarProjeto
          handleFecharEditarProjeto={handleFecharEditarProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}
          handleAbrirModalConcluirProjeto={handleAbrirModalConcluirProjeto}
        />
      )}

      {modalFormConcluir && (
        <ModalConcluirProjeto
          handleFecharConcluirProjeto={handleFecharConcluirProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}
          handleAbrirModalConcluirProjeto={handleAbrirModalConcluirProjeto}
          handleFecharModalConcluirProjeto={handleFecharModalConcluirProjeto}

          //teste para deixar borda verde
          setConclusionDate={setConclusionDate}
        // setConcludedProjects={setConcludedProjects}
        />
      )}

      {/* LÓGICA MODAL PRIORIDADE PROJETO */}
      {modalFormPrioridade && (
        <ModalPrioridadeProjeto
          handleFecharPrioridadeProjeto={handleFecharPrioridadeProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          handleAbrirModalPrioridadeProjeto={handleAbrirModalPrioridadeProjeto}
        />
      )}
    </Box>
  );
};

SolicitacoesPage.propTypes = {
  changeTheme: PropTypes.func.isRequired,
};

export default SolicitacoesPage;
// ModalAtualizarEtapasProjeto


// quando o status for retorno mas aparece para o usuario,para quem abriu a solicitacao,nunca para o compras