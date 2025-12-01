import { useState, useEffect, useCallback } from "react";
import "./App.css";

import { rowInfoExample, columnInfoExample, gridMapExample } from "./example3";

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
  const [isSolving, setIsSolving] = useState(false);

  const solve = useCallback(() => {
    const infoForIndex =
      selectedDirection === "row"
        ? rowInfo[selectedIndex]
        : columnInfo[selectedIndex];

    const solvedLineMap: (boolean | null)[] = new Array(gridSize).fill(null);
    if (selectedDirection === "row") {
      for (let i = 0; i < gridSize; i++) {
        solvedLineMap[i] = gridMap[selectedIndex][i];
      }
    }
    if (selectedDirection === "column") {
      for (let i = 0; i < gridSize; i++) {
        solvedLineMap[i] = gridMap[i][selectedIndex];
      }
    }

    // Checks if already solved
    if (!solvedLineMap.includes(null)) {
      return;
    }

    let somethingChangedBlocks = true;
    let firstUnblockedIndex = Math.min(
      solvedLineMap.indexOf(null),
      solvedLineMap.indexOf(true)
    );
    let lastUnblockedIndex = Math.max(
      solvedLineMap.lastIndexOf(null),
      solvedLineMap.lastIndexOf(true)
    );
    while (somethingChangedBlocks) {
      somethingChangedBlocks = false;
      const firstBlockedIndex =
        solvedLineMap.slice(firstUnblockedIndex).indexOf(false) +
        firstUnblockedIndex;
      const lastBlockedIndex = solvedLineMap
        .slice(0, lastUnblockedIndex)
        .lastIndexOf(false);

      if (firstBlockedIndex !== -1 && firstBlockedIndex < infoForIndex[0]!) {
        for (let i = 0; i <= firstBlockedIndex; i++) {
          if (solvedLineMap[i] === false) continue;
          solvedLineMap[i] = false;
          somethingChangedBlocks = true;
        }
      }
      if (
        lastBlockedIndex !== -1 &&
        gridSize - lastBlockedIndex - 1 < infoForIndex[infoForIndex.length - 1]!
      ) {
        for (let i = lastBlockedIndex; i < gridSize; i++) {
          if (solvedLineMap[i] === false) continue;
          solvedLineMap[i] = false;
          somethingChangedBlocks = true;
        }
      }
      firstUnblockedIndex = Math.min(
        solvedLineMap.indexOf(null),
        solvedLineMap.indexOf(true)
      );
      lastUnblockedIndex = Math.max(
        solvedLineMap.lastIndexOf(null),
        solvedLineMap.lastIndexOf(true)
      );
    }

    for (let i = 0; i < infoForIndex.length; i++) {
      const blockSize = infoForIndex[i];
      let blocksFilledToLeft =
        firstUnblockedIndex !== -1 ? firstUnblockedIndex : 0;
      let blocksFilledToRight =
        lastUnblockedIndex !== -1 ? gridSize - 1 - lastUnblockedIndex : 0;
      for (let j = 0; j < i; j++) {
        blocksFilledToLeft +=
          infoForIndex[j] !== null ? infoForIndex[j]! + 1 : 0;
      }
      for (let j = infoForIndex.length - 1; j > i; j--) {
        blocksFilledToRight +=
          infoForIndex[j] !== null ? infoForIndex[j]! + 1 : 0;
      }

      for (
        let j = blocksFilledToLeft;
        j < blocksFilledToLeft + blockSize!;
        j++
      ) {
        if (solvedLineMap[j] === false) {
          blocksFilledToLeft = j + 1;
          j = blocksFilledToLeft - 1;
        }
      }

      for (
        let j = gridSize - 1 - blocksFilledToRight;
        j >= gridSize - blocksFilledToRight - blockSize!;
        j--
      ) {
        if (solvedLineMap[j] === false) {
          blocksFilledToRight = gridSize - j;
          j = gridSize - blocksFilledToRight - 1;
        }
      }

      const leftLeaningEndIndex = blocksFilledToLeft + blockSize!;
      const rightLeaningStartIndex =
        gridSize - blocksFilledToRight - blockSize!;
      if (rightLeaningStartIndex < leftLeaningEndIndex) {
        for (
          let k = leftLeaningEndIndex - 1;
          k >= rightLeaningStartIndex;
          k--
        ) {
          solvedLineMap[k] = true;
        }
        if (leftLeaningEndIndex - rightLeaningStartIndex === blockSize!) {
          if (rightLeaningStartIndex - 1 >= 0)
            solvedLineMap[rightLeaningStartIndex - 1] = false;
          if (leftLeaningEndIndex < gridSize)
            solvedLineMap[leftLeaningEndIndex] = false;
        }
      }
    }

    // Checks if every Info is satisfied
    let infoSatisfied = true;
    let count = 0;
    const tempInfo: number[] = [];
    for (let i = 0; i < gridSize; i++) {
      if (solvedLineMap[i] === true) {
        count++;
      } else {
        if (count > 0) {
          tempInfo.push(count);
          count = 0;
        }
      }
    }
    if (count > 0) {
      tempInfo.push(count);
    }
    if (tempInfo.length !== infoForIndex.length) {
      infoSatisfied = false;
    } else {
      for (let i = 0; i < tempInfo.length; i++) {
        if (tempInfo[i] !== infoForIndex[i]) {
          infoSatisfied = false;
          break;
        }
      }
    }
    if (infoSatisfied) {
      for (let i = 0; i < gridSize; i++) {
        if (solvedLineMap[i] === null) {
          solvedLineMap[i] = false;
        }
      }
    }

    const newGridMap = [...gridMap];
    if (selectedDirection === "row") {
      for (let i = 0; i < gridSize; i++) {
        newGridMap[selectedIndex][i] = solvedLineMap[i];
      }
    }
    if (selectedDirection === "column") {
      for (let i = 0; i < gridSize; i++) {
        newGridMap[i][selectedIndex] = solvedLineMap[i];
      }
    }
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

      solve();
      if (selectedIndex === gridSize - 1) {
        setSelectedDirection((prevDirection) =>
          prevDirection === "row" ? "column" : "row"
        );
      }
      setSelectedIndex((prevIndex) => {
        return (prevIndex + 1) % gridSize;
      });
    };

    const intervalId = setInterval(solveGrid, 150);

    return () => clearInterval(intervalId);
  }, [isSolving, gridSize, gridMap, selectedIndex, selectedDirection, solve]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      NONOGRAM SOLVER
      <input
        type="number"
        value={gridSize > 0 ? gridSize : ""}
        onChange={(e) => {
          const size = parseInt(e.target.value);
          setGridSize(size);
          setRowInfo(new Array(size).fill([]));
          setColumnInfo(new Array(size).fill([]));
          setGridMap(
            Array.from({ length: size }, () => new Array(size).fill(null))
          );
        }}
        placeholder="Enter row size"
      />
      <button
        onClick={() =>
          setSelectedDirection(selectedDirection === "row" ? "column" : "row")
        }
      >
        Flip Direction
      </button>
      <button
        onClick={() => {
          setGridSize(gridMapExample.length);
          setRowInfo(rowInfoExample);
          setColumnInfo(columnInfoExample);
          setGridMap(gridMapExample);
        }}
      >
        Set Example
      </button>
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
            key={columnIndex}
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
                key={idx}
              >
                <input
                  type="number"
                  value={val !== null ? val : ""}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value);
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
                    ...(newColumnInfo[columnIndex] || []),
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
          justifyContent: "center",
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
              key={rowIndex}
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
                  key={idx}
                >
                  <input
                    type="number"
                    value={val !== null ? val : ""}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
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
                      ...(newRowInfo[rowIndex] || []),
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
              key={rowIndex}
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
        {isSolving ? "Stop" : "Solve"}
      </button>
    </div>
  );
}

export default App;
