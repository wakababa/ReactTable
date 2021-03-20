import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  IconButton,
  LinearProgress
} from '@material-ui/core';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
  table: {
    margin: "auto",
    marginTop: 10,
    minWidth: 600,
    maxWidth: 800,
    background: "whitesmoke"
  },
  tabcell: {
    height: "50px",
    width: "300px"
  },
  margin: {
    margin: 3
  },

});


const ToolbarCloseCheck = (props) => {
  const { index, loading, onCloseEdit, onSaveEdit } = props
  return (
    <TableCell >
      <IconButton disabled={loading} onClick={() => onCloseEdit()} aria-label="close" >
        <CloseIcon />
      </IconButton>
      <IconButton disabled={loading} onClick={() => onSaveEdit(index)} aria-label="check">
        <CheckIcon />
      </IconButton>
    </TableCell>
  )
}

const ToolbarEditDelete = (props) => {
  const { index, loading, onDelete, onEdit } = props
  return (
    <TableCell >
      <IconButton disabled={loading} onClick={() => onDelete(index)} aria-label="delete" >
        <DeleteOutlineOutlinedIcon />
      </IconButton>
      <IconButton disabled={loading} onClick={() => onEdit(index)} aria-label="edit">
        <EditOutlinedIcon />
      </IconButton>
    </TableCell>
  )
}

function ReactTable(props) {
  const classes = useStyles();

  const { rowKeys, tableData, onLoadData } = props

  const [edit, setEdit] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [newRowData, setNewRowData] = useState({})
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const keys = rowKeys ?? Object?.keys(data[0] ?? {})

  useEffect(() => {
    data && setData(tableData)
  }, [])

  const handleEdit = (key) => {
    setNewRowData(data[key] ?? {})
    setEditIndex(key)
    setEdit(true)
  }

  const handleCloseEdit = () => {
    setEditIndex(null)
    setEdit(false)

  }
  const handleChangeValue = (value, element) => setNewRowData({ ...newRowData, [element]: value })

  const handleSaveEdit = (key) => {
    setLoading(true)
    data[key] = newRowData
    setTimeout(() => {
      setData(data)
      handleCloseEdit()
      setLoading(false)
    }, 300);

  }
  const handleDelete = (key) => {
    setLoading(true)
    setTimeout(() => {
      setData(data.filter((item, id) => id !== key))
      setLoading(false)
    }, 300);

  }
  const handleAddRow = () => {
    setLoading(true)
    let sample = {}
    for (let i = 0; i < keys.length; i++) {
      sample[keys[i]] = ""
    }
    setTimeout(() => {
      setData([...data, sample])
      setLoading(false)
    }, 300);
    handleEdit(data.length)
  }


  useEffect(() => {
    onLoadData(data)
  }, [loading])


  return (
    <TableContainer className={classes.table} component={Paper} >
      {loading && <LinearProgress />}
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {keys?.map((item, key) => (
              <TableCell
                key={key}
                className={classes.tabcell}
                style={{ fontWeight: "bold" }}>{item}</TableCell>))}
            <TableCell>
              <IconButton style={{ float: "right" }} onClick={() => handleAddRow()}>
                <AddIcon />
              </IconButton></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {data?.map((item, key) => (
            <TableRow key={key}>
              {
                keys.map((element, id) => (
                  <TableCell onDoubleClick={() => handleEdit(key)} className={classes.tabcell} key={id}>
                    {edit && editIndex === key ?
                      <TextField
                        onChange={(e) => handleChangeValue(e.target.value, element)}
                        defaultValue={data[key][element]} /> :
                      <Typography
                        variant="subtitle1">{data[key][element]}
                      </Typography>}
                  </TableCell>
                )
                )}
              {/* Toolbar */}
              {
                edit && editIndex === key ?

                  <ToolbarCloseCheck
                    index={key}
                    loading={loading}
                    onCloseEdit={handleCloseEdit}
                    onSaveEdit={handleSaveEdit}
                  />
                  :
                  <ToolbarEditDelete
                    index={key}
                    loading={loading}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ReactTable;
