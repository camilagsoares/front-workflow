import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Skeleton } from '@mui/material';
import { useApiRequestGet,useApiRequestSubmit} from '../../../../services/api';
import React,{useState,useEffect} from 'react';


const Lista = (props) => {

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const TableRowsLoaderSkeleton = ({ rowsNum }) => {
    return [...Array(rowsNum)].map((row, index) => (
      <TableRow key={index}>
        <StyledTableCell component='th' scope='row'>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
      </TableRow>
    ));
  };


  const { data, error, loading } = useApiRequestGet('/auth/permissoes');
  const { searchTerm } = props;
  const handleFecharModalForm = () => abrirFecharModalForm(false);
  const handleAbrirModalForm = () => abrirFecharModalForm(true);

  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter((row) => {
        return (
          row.id.toString().includes(searchTerm) ||
          row.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.descricao.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, searchTerm]);

  return (
    <React.Fragment>
      {/* {error && (
        <Box display='flex' flexDirection='row' gap={4} color='red' fontSize={14}>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </Box>
      )} */}
      <Box marginY={1} paddingY={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align='left' width={312}>Id</StyledTableCell>
                <StyledTableCell align='left' width={312}>
                Nome
                </StyledTableCell>
                <StyledTableCell align='left' width={312}>
                Descrição
                </StyledTableCell>
             

              
               
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRowsLoaderSkeleton rowsNum={5} />
              ) : (
                filteredData?.map((row) => {
                 {
                    return (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component='th' scope='row'>
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell component='th' scope='row'>
                          {row.nome}
                        </StyledTableCell>
                        <StyledTableCell align='left'>{row.descricao}</StyledTableCell>
                      
                      
                      </StyledTableRow>
                    );
                  }
                  return null;
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </React.Fragment>
  );
};

Lista.propTypes = {
  searchTerm: PropTypes.string,
};

Lista.defaultProps = {
  searchTerm: undefined,
};

export default Lista;
