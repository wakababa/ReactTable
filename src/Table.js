import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  IconButton,
  LinearProgress,
  Button
} from '@material-ui/core';

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';

const useStyles = makeStyles({
  table: {
    margin: "auto",
    marginTop: 10,
    minWidth: 600,
    maxWidth: 800,
    background: "white"
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
    <th >
      <IconButton disabled={loading} onClick={() => onCloseEdit()} aria-label="close" >
        <CloseIcon />
      </IconButton>
      <IconButton disabled={loading} onClick={() => onSaveEdit(index)} aria-label="check">
        <CheckIcon />
      </IconButton>
    </th>
  )
}

const ToolbarEditDelete = (props) => {
  const { index, loading, onDelete, onEdit } = props
  return (
    <th >
      <IconButton disabled={loading} onClick={() => onDelete(index)} aria-label="delete" >
        <DeleteOutlineOutlinedIcon />
      </IconButton>
      <IconButton disabled={loading} onClick={() => onEdit(index)} aria-label="edit">
        <EditOutlinedIcon />
      </IconButton>
    </th>
  )
}

function ReactTable(props) {
  const classes = useStyles();

  const { rowKeys, tableData, onLoadData } = props

  const [edit, setEdit] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [newRowData, setNewRowData] = useState({})
  const [loading, setLoading] = useState(false)
  const [sortingItem, setSortingItem] = useState(null)
  const [sortType, setSortType] = useState(false)
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
    data[data.length - 1][keys[0]] === "" && setData(data.splice(0, data.length - 1))
  }
  const handleChangeValue = (value, element) => setNewRowData({ ...newRowData, [element]: value })

  const handleSaveEdit = (key) => {
    setLoading(true)
    data[key] = newRowData
    setTimeout(() => {
      setData(data)
      handleCloseEdit()
      setLoading(false)
      setNewRowData({})
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

  const handleSort = (item) => {
    setSortingItem(item)
    setSortType(!sortType)
    !sortType && setData([...data.sort((a, b) => a[item] < b[item] ? -1 : a[item] > b[item] ? 1 : 0)])
    sortType && setData([...data.sort((a, b) => a[item] < b[item] ? 1 : a[item] > b[item] ? -1 : 0)])
  }

  useEffect(() => {
    onLoadData(data)
  }, [loading])


  return (
    <TableContainer className={classes.table} component={Paper} >
      {loading && <LinearProgress />}
      <table aria-label="simple table">
        <TableHead>
          <TableRow>
            {keys?.map((item, key) => (
              <td
                key={key}
                className={classes.tabcell}
                style={{ fontWeight: "bold" }}>
                <Button
                  onClick={() => handleSort(item)}
                  endIcon={
                    <>
                      {sortType && sortingItem === item &&
                        <ArrowUpwardOutlinedIcon />}
                      {!sortType && sortingItem === item &&
                        <ArrowDownwardOutlinedIcon />}
                    </>
                  }>
                  {item}
                </Button>
              </td>))}
            <th>
              <IconButton
                style={{ float: "right" }}
                onClick={() => handleAddRow()}>
                <AddIcon />
              </IconButton></th>
          </TableRow>
        </TableHead>
        <TableBody>

          {data?.map((item, key) => (
            <tr key={key}>
              {
                keys.map((element, id) => (
                  <th
                  style={{textAlign:"left",padding:5}}
                    onDoubleClick={() => handleEdit(key)}
                    className={classes.tabcell} key={id}>
                    {edit && editIndex === key ?
                      <input
                        onChange={(e) => handleChangeValue(e.target.value, element)}
                        defaultValue={data[key][element]} /> :
                      <Typography
                        variant="subtitle1">{data[key][element]}
                      </Typography>}
                  </th>
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
            </tr>
          ))}
        </TableBody>
      </table>
    </TableContainer>
  );
}

export default ReactTable;
