import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import CircleIcon from '@mui/icons-material/Circle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { red, amber, lightGreen, indigo } from '@mui/material/colors';
import { common } from '@mui/material/colors';
import { black,
         squareColor,
         tpsIn } from '../util';

function Cell(props) {
  if (props.value === red[500] || props.value === lightGreen[500] || props.value === black) {
    return (
      <Button onClick={props.onClick}>
        { props.value === black && <CircleIcon style={{ color: props.value }} /> }
        { props.value === red[500] && <CancelIcon style={{ color: props.value }} /> }
        { props.value === lightGreen[500] && <CheckCircleIcon style={{ color: props.value }} /> }
      </Button>
    );
  } else {
    return "";
  }
}

function TimeGrid ({ columns,
                     objs,
                     tables,
                     highlights,
                     subformulas,
                     setMonitorState }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState('');
  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    // const col = parseInt(event.currentTarget.dataset.field);
    // const row = event.currentTarget.parentElement.dataset.id;
    // if (col >= columns.preds.length && squares[row][col] !== "" && squares[row][col] !== black) {
    //   if (value !== subformulas[col - columns.preds.length]) setValue(subformulas[col - co.length]);
    //   setAnchorEl(event.currentTarget);
    // }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const predsWidth = columns.preds.reduce ((acc, pred) =>
    Math.max(acc, (10*(pred.length))), 50
  );

  const predsGridColumns = columns.preds.slice(0).map((p, i) =>
    ({
      field: i.toString(),
      headerName: p,
      width: predsWidth,
      sortable: false,
      renderHeader: () => p,
      // renderCell: (params) => <Cell value={squares[params.row.tp][i]} />,
      // renderCell: (params) => <Cell value={""} />,
      headerAlign: 'center',
      align: 'center',
      disableClickEventBubbling: true
    }));

  const tsWidth = objs.dbs.reduce ((acc, { ts, tp }) =>
    Math.max(acc, (10*(ts.toString().length))), 50
  );

  const tptsGridColumns = [
    {
      field: 'tp',
      headerName: <b>TP</b>,
      width: 70,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      disableClickEventBubbling: true
    },
    { field: 'ts',
      headerName: <b>TS</b>,
      width: tsWidth,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      disableClickEventBubbling: true
    }
  ];

  const subfsWidth = columns.subfs.reduce((acc, subf) =>
    Math.max(acc, (9*(subf.length))), 60
  );

  const subfsGridColumns = columns.subfs.slice(0).map((f, i) =>
    ({
      field: (i+columns.preds.length).toString(),
      headerName: f,
      width: subfsWidth,
      sortable: false,
      renderHeader: () => f,
      // renderCell: (params) => { return <Cell value={""}
      //                                        onClick={() => handleClick(params.row.ts, params.row.tp, params.colDef.field)}
      //                                  />; },
      headerAlign: 'center',
      align: 'center',
      disableClickEventBubbling: true
    }));

  const rows = objs.dbs.map(({ ts, tp }) =>
    ({
      id: tp,
      tp: tp,
      ts: ts
    }));

  // const handleClick = (ts, tp, col) => {
  //   const colIndex = parseInt(col);

  //   let cloneSquares = [...squares];
  //   let clonePathsMap = new Map(highlights.pathsMap);
  //   let cell;

  //   for (let i = 0; i < explObjs.length; ++i) {
  //     let c = explObjs[i].table.find(c => c.tp === tp && c.col === colIndex);
  //     if (c !== undefined) cell = c;
  //   }

  //   if (cell !== undefined && squares[cell.tp][cell.col] !== black && cell.cells.length !== 0) {
  //     Update highlighted cells (i.e. the ones who appear after a click)
  //     let highlightedCells = [];
  //     let children = [];

  //     Update cells (show hidden verdicts after a click)
  //     for (let i = 0; i < cell.cells.length; ++i) {
  //       cloneSquares[cell.cells[i].tp][cell.cells[i].col] = squareColor(cell.cells[i].bool);
  //       highlightedCells.push({ tp: cell.cells[i].tp, col: cell.cells[i].col });
  //       children.push({ tp: cell.cells[i].tp, col: cell.cells[i].col, isHighlighted: false });
  //     }

  //     Update interval highlighting
  //     let lastTS = dbsObjs[dbsObjs.length - 1].ts;
  //     let selRows = (cell.interval !== undefined) ? tpsIn(ts, tp, cell.interval, cell.period, lastTS, dbsObjs) : [];

  //     Update (potentially multiple) open paths to be highlighted
  //     for (const [k, obj] of pathsMap) {
  //       if (obj.isHighlighted) clonePathsMap.set(k, {...obj, isHighlighted: false });
  //     }

  //     for (let i = 0; i < children.length; ++i) {
  //       clonePathsMap.set(children[i].tp.toString() + children[i].col.toString(),
  //                         { parent: tp.toString() + colIndex.toString(), isHighlighted: false,
  //                           tp: children[i].tp, col: children[i].col });
  //     }

  //     let cur = clonePathsMap.get(tp.toString() + colIndex.toString());
  //     if (cur === undefined) clonePathsMap.set(tp.toString() + colIndex.toString(),
  //                                              { parent: null, isHighlighted: true, tp: tp, col: colIndex });
  //     else clonePathsMap.set(tp.toString() + colIndex.toString(), {...cur, isHighlighted: true });

  //     if (cur !== undefined) {
  //       while (cur.parent !== null) {
  //         cur = clonePathsMap.get(cur.parent);
  //         clonePathsMap.set(cur, {...cur, isHighlighted: true });
  //       }
  //     }

  //     let action = { type: "updateTable",
  //                    squares: cloneSquares,
  //                    selectedRows: selRows,
  //                    highlightedCells: highlightedCells,
  //                    pathsMap: clonePathsMap,
  //                  };
  //     setMonitorState(action);
  //   }
  // };

  return (
    <Box height="60vh"
         sx={{
           '& .cell--Highlighted': {
             backgroundColor: amber[300],
           },
           '& .cell--PathHighlighted': {
             backgroundColor: indigo[100],
           },
           '& .row--Highlighted': {
             bgcolor: amber[50],
             '&:hover': {
               bgcolor: amber[50],
             },
           },
           '& .row--Plain': {
             bgcolor: common.white,
             '&:hover': {
               bgcolor: common.gray,
             },
           },
         }}>
      <DataGrid
        rows={rows}
        columns={predsGridColumns.concat(tptsGridColumns.concat(subfsGridColumns))}
        getRowClassName={(params) => {
          if (highlights.selectedRows.includes(params.row.tp)) return 'row--Highlighted';
          else return 'row--Plain';
        }}
        getCellClassName={(params) => {
          if (highlights.highlightedCells.length !== 0) {
            for (let i = 0; i < highlights.highlightedCells.length; ++i) {
              if (highlights.highlightedCells[i].tp === params.row.tp
                  && highlights.highlightedCells[i].col === parseInt(params.colDef.field))
                return 'cell--Highlighted';
            }
          }
          for (const [k, obj] of highlights.pathsMap) {
            if (obj.isHighlighted && obj.tp === params.row.tp && obj.col === parseInt(params.colDef.field))
              return 'cell--PathHighlighted';
          }
        }}
        componentsProps={{
          cell: {
            onMouseEnter: handlePopoverOpen,
            onMouseLeave: handlePopoverClose,
          },
        }}
        pageSize={100}
        rowsPerPageOptions={[100]}
        density="compact"
        disableColumnMenu
        disableSelectionOnClick
      />
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{value}</Typography>
      </Popover>
    </Box>
  );
}

export default TimeGrid;
