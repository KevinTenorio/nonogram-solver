import { useState, useEffect, useCallback } from "react";
import "./App.css";
import easy1 from "./easy1.json";
import easy2 from "./easy2.json";
import medium1 from "./medium1.json";
import medium2 from "./medium2.json";
import hard1 from "./hard1.json";
import hard2 from "./hard2.json";
import specialist1 from "./specialist1.json";
import specialist2 from "./specialist2.json";
import specialist3 from "./specialist3.json";
import bug from "./bug.json";
import solveCellWithCheck from "./functions/solveCellWithCheck";
import initializeSolveData from "./functions/initializeSolveData";
import blockLineEdges from "./functions/blockLineEdges";
import fillFromEdges from "./functions/fillFromEdges";
import blockBasedOnKnowns from "./functions/blockBasedOnKnowns";
import blockIsolatedEmpties from "./functions/blockIsolatedEmpties";
import mainSolveLoop from "./functions/mainSolveLoop";
import checkAndFinalizeLine from "./functions/checkAndFinalizeLine";
import handleSolvedBlocks from "./functions/handleSolvedBlocks";
import blockSmallEmptySpaces from "./functions/blockSmallEmptySpaces";
import handleUnmergeableBlocks from "./functions/handleUnmergeableBlocks";
import completeLineFromEdges from "./functions/completeLineFromEdges";
import expandUnmergeableBlocks from "./functions/expandUnmergeableBlocks";
import finalizeSolvedBlocks from "./functions/finalizeSolvedBlocks";
import mergeBlocks from "./functions/mergeBlocks";
import blockImpossibleCells from "./functions/blockImpossibleCells";
import solveUnbrokenSpaces from "./functions/solveUnbrokenSpaces";
import updateGridMap from "./functions/updateGridMap";

function App() {
  const [gridSize, setGridSize] = useState(0);
  const [rowInfo, setRowInfo] = useState<(number | null)[][]>([]);
  const [columnInfo, setColumnInfo] = useState<(number | null)[][]>([]);
  const [gridMap, setGridMap] = useState<(boolean | null)[][]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedDirection, setSelectedDirection] = useState<"row" | "column">(
    "row"
  );
  const [selectedBlockState, setSelectedBlockState] = useState<boolean | null>(
    true
  );
  const [delay, setDelay] = useState<number>(0);
  const [isSolving, setIsSolving] = useState(false);

  const solve = useCallback(async () => {
    const { infoForIndex, solvedLineMap } = initializeSolveData(
      selectedDirection,
      rowInfo,
      columnInfo,
      selectedIndex,
      gridSize,
      gridMap
    );

    // Checks if already solved
    if (!solvedLineMap.includes(null)) {
      return;
    }

    let { firstUnblockedIndex, lastUnblockedIndex } = blockLineEdges(
      solvedLineMap,
      infoForIndex,
      gridSize,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    fillFromEdges(
      solvedLineMap,
      infoForIndex,
      firstUnblockedIndex,
      lastUnblockedIndex,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    blockBasedOnKnowns(
      solvedLineMap,
      infoForIndex,
      firstUnblockedIndex,
      lastUnblockedIndex,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    blockIsolatedEmpties(
      solvedLineMap,
      infoForIndex,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    firstUnblockedIndex = Math.min(
      solvedLineMap.indexOf(null) !== -1
        ? solvedLineMap.indexOf(null)
        : gridSize + 1,
      solvedLineMap.indexOf(true)
    );
    lastUnblockedIndex = Math.max(
      solvedLineMap.lastIndexOf(null),
      solvedLineMap.lastIndexOf(true)
    );

    mainSolveLoop(
      solvedLineMap,
      infoForIndex,
      gridSize,
      firstUnblockedIndex,
      lastUnblockedIndex,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    const tempInfo = checkAndFinalizeLine(
      solvedLineMap,
      infoForIndex,
      gridSize,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    handleSolvedBlocks(
      solvedLineMap,
      infoForIndex,
      tempInfo,
      gridSize,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    blockSmallEmptySpaces(
      solvedLineMap,
      infoForIndex,
      gridSize,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    handleUnmergeableBlocks(
      solvedLineMap,
      infoForIndex,
      tempInfo,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    completeLineFromEdges(
      solvedLineMap,
      infoForIndex,
      gridSize,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    expandUnmergeableBlocks(
      solvedLineMap,
      infoForIndex,
      tempInfo,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    finalizeSolvedBlocks(
      solvedLineMap,
      tempInfo,
      gridSize,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    mergeBlocks(
      solvedLineMap,
      infoForIndex,
      tempInfo,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    blockImpossibleCells(
      solvedLineMap,
      infoForIndex,
      tempInfo,
      gridSize,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    solveUnbrokenSpaces(
      solvedLineMap,
      infoForIndex,
      gridSize,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap,
      solveCellWithCheck
    );

    const newGridMap = updateGridMap(
      gridMap,
      solvedLineMap,
      selectedDirection,
      selectedIndex,
      gridSize
    );

    setGridMap(newGridMap);
  }, [
    gridMap,
    gridSize,
    rowInfo,
    columnInfo,
    selectedIndex,
    selectedDirection,
  ]);

  useEffect(() => {
    if (!isSolving) {
      return;
    }

    const solveGrid = () => {
      const isGridSolved = !gridMap.flat().includes(null);
      if (isGridSolved) {
        setIsSolving(false);
        return;
      }

      setTimeout(async () => {
        await solve();
        const nextIndex = (selectedIndex + 1) % gridSize;
        setSelectedIndex((prevIndex) => {
          return (prevIndex + 1) % gridSize;
        });

        if (nextIndex === 0) {
          setSelectedDirection((prevDirection) =>
            prevDirection === "row" ? "column" : "row"
          );
        }
      }, delay);
    };

    solveGrid();
  }, [
    isSolving,
    gridMap,
    solve,
    delay,
    gridSize,
    selectedIndex,
    selectedDirection,
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      NONOGRAM SOLVER
      <input
        type="number"
        value={gridSize > 0 ? gridSize : ""}
        onChange={(e) => {
          const size = Number(e.target.value);
          setGridSize(size);
          setRowInfo(new Array(size).fill([]));
          setColumnInfo(new Array(size).fill([]));
          setGridMap(
            Array.from({ length: size }, () => new Array(size).fill(null))
          );
        }}
        placeholder="Enter row size"
      />
      <input
        type="number"
        value={delay > 0 ? delay : ""}
        onChange={(e) => {
          const delayValue = Number(e.target.value);
          setDelay(delayValue);
        }}
        placeholder="Enter delay time (ms)"
      />
      <button
        onClick={() =>
          setSelectedDirection(selectedDirection === "row" ? "column" : "row")
        }
      >
        Flip Direction
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        }}
      >
        <button
          onClick={() => {
            const example = { ...easy1 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Easy 1
        </button>
        <button
          onClick={() => {
            const example = { ...easy2 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Easy 2
        </button>
        <button
          onClick={() => {
            const example = { ...medium1 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Medium 1
        </button>
        <button
          onClick={() => {
            const example = { ...medium2 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Medium 2
        </button>
        <button
          onClick={() => {
            const example = { ...hard1 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Hard 1
        </button>
        <button
          onClick={() => {
            const example = { ...hard2 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Hard 2
        </button>
        <button
          onClick={() => {
            const example = { ...specialist1 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Specialist 1
        </button>
        <button
          onClick={() => {
            const example = { ...specialist2 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Specialist 2
        </button>
        <button
          onClick={() => {
            const example = { ...specialist3 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Specialist 3
        </button>
        <button
          onClick={() => {
            const example = { ...bug };
            setSelectedDirection(example.selectedDirection as "row" | "column");
            setSelectedIndex(example.selectedIndex);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Bug
        </button>
      </div>
      <button
        onClick={() => {
          console.log({ rowInfo, columnInfo, gridMap });
        }}
      >
        Log Current Grid
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "end",
          marginBottom: "-16px",
        }}
      >
        {gridMap.map((_, columnIndex) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginRight: (columnIndex + 1) % 5 === 0 ? "4px" : "0px",
              width: "26px",
              height: "100%",
              alignItems: "center",
            }}
            key={`column-info-${columnIndex}`}
          >
            <button
              onClick={() => {
                setSelectedIndex(columnIndex);
                setSelectedDirection("column");
              }}
              style={{
                height: "24px",
                width: "24px",
                marginBottom: "8px",
                transform: "rotate(90deg)",
              }}
            >
              {">"}
            </button>
            {columnInfo[columnIndex].map((val, idx) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  alignItems: "center",
                }}
                key={`column-info-${columnIndex}-val-${idx}`}
              >
                <input
                  type="number"
                  value={val ?? ""}
                  onChange={(e) => {
                    const newVal = Number(e.target.value);
                    const newColumnInfo = [...columnInfo];
                    newColumnInfo[columnIndex][idx] = newVal;
                    setColumnInfo(newColumnInfo);
                  }}
                  style={{ width: "16px", height: "18px", fontSize: "12px" }}
                />
                <button
                  onClick={() => {
                    const newColumnInfo = columnInfo[columnIndex].filter(
                      (_, i) => i !== idx
                    );
                    const updatedColumnInfo = [...columnInfo];
                    updatedColumnInfo[columnIndex] = newColumnInfo;
                    setColumnInfo(updatedColumnInfo);
                  }}
                  style={{
                    height: "24px",
                    width: "24px",
                    marginBottom: "8px",
                  }}
                >
                  -
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setColumnInfo((prevState) => {
                  const newColumnInfo = [...prevState];
                  newColumnInfo[columnIndex] = [
                    ...(newColumnInfo[columnIndex] ?? []),
                    null,
                  ];
                  return newColumnInfo;
                })
              }
              style={{
                height: "24px",
                width: "24px",
                marginBottom: "8px",
              }}
            >
              +
            </button>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {gridMap.map((_, rowIndex) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                marginBottom: (rowIndex + 1) % 5 === 0 ? "4px" : "0px",
                height: "26px",
                alignItems: "center",
              }}
              key={`row-info-${rowIndex}`}
            >
              <button
                onClick={() => {
                  setSelectedIndex(rowIndex);
                  setSelectedDirection("row");
                }}
                style={{
                  height: "24px",
                  width: "24px",
                  marginRight: "8px",
                }}
              >
                {">"}
              </button>
              {rowInfo[rowIndex].map((val, idx) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    alignItems: "center",
                  }}
                  key={`row-info-${rowIndex}-val-${idx}`}
                >
                  <input
                    type="number"
                    value={val ?? ""}
                    onChange={(e) => {
                      const newVal = Number(e.target.value);
                      const newRowInfo = [...rowInfo];
                      newRowInfo[rowIndex][idx] = newVal;
                      setRowInfo(newRowInfo);
                    }}
                    style={{ width: "16px", height: "18px", fontSize: "12px" }}
                  />
                  <button
                    onClick={() => {
                      const newRowInfo = rowInfo[rowIndex].filter(
                        (_, i) => i !== idx
                      );
                      const updatedRowInfo = [...rowInfo];
                      updatedRowInfo[rowIndex] = newRowInfo;
                      setRowInfo(updatedRowInfo);
                    }}
                    style={{
                      height: "24px",
                      width: "24px",
                      marginRight: "8px",
                    }}
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setRowInfo((prevState) => {
                    const newRowInfo = [...prevState];
                    newRowInfo[rowIndex] = [
                      ...(newRowInfo[rowIndex] ?? []),
                      null,
                    ];
                    return newRowInfo;
                  })
                }
                style={{
                  height: "24px",
                  width: "24px",
                  marginRight: "8px",
                }}
              >
                +
              </button>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {gridMap.map((row, rowIndex) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: (rowIndex + 1) % 5 === 0 ? "4px" : "0px",
                height: "26px",
              }}
              key={`row-grid-${rowIndex}`}
            >
              {row.map((val, idx) => (
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: val === true ? "black" : "white",
                    border:
                      (selectedDirection === "row" &&
                        rowIndex === selectedIndex) ||
                      (selectedDirection === "column" && idx === selectedIndex)
                        ? "1px solid blue"
                        : "1px solid grey",
                    marginRight: (idx + 1) % 5 === 0 ? "4px" : "0px",
                    color: "grey",
                    cursor: "pointer",
                  }}
                  key={`idx-${idx}-rowIndex-${rowIndex}`}
                  onClick={() =>
                    setGridMap((prevGrid) => {
                      const newGrid = prevGrid.map((r) => [...r]);
                      newGrid[rowIndex][idx] = selectedBlockState;
                      return newGrid;
                    })
                  }
                >
                  {val === false && "X"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "black",
            color: "grey",
            border:
              selectedBlockState === true ? "1px solid blue" : "1px solid grey",
            cursor: "pointer",
          }}
          onClick={() => setSelectedBlockState(true)}
        ></div>
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "white",
            color: "grey",
            border:
              selectedBlockState === null ? "1px solid blue" : "1px solid grey",
            cursor: "pointer",
          }}
          onClick={() => setSelectedBlockState(null)}
        ></div>
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "white",
            color: "grey",
            border:
              selectedBlockState === false
                ? "1px solid blue"
                : "1px solid grey",
            cursor: "pointer",
          }}
          onClick={() => setSelectedBlockState(false)}
        >
          X
        </div>
      </div>
      <button
        onClick={() => {
          setIsSolving(!isSolving);
        }}
      >
        {isSolving ? "Stop" : "Solve All"}
      </button>
      <button
        onClick={() => {
          solve();
        }}
      >
        {"Solve"}
      </button>
    </div>
  );
}

export default App;
