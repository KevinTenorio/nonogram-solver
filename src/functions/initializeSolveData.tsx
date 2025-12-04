const initializeSolveData = (
  selectedDirection: "row" | "column",
  rowInfo: (number | null)[][],
  columnInfo: (number | null)[][],
  selectedIndex: number,
  gridSize: number,
  gridMap: (boolean | null)[][]
) => {
  const infoForIndex: {
    info: number | null;
    isSolved: boolean;
    startIndex?: number;
    endIndex?: number;
    startLimitIndex?: number;
    endLimitIndex?: number;
  }[] =
    selectedDirection === "row"
      ? rowInfo[selectedIndex].map((n) => ({ info: n, isSolved: false }))
      : columnInfo[selectedIndex].map((n) => ({ info: n, isSolved: false }));

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

  return { infoForIndex, solvedLineMap };
};

export default initializeSolveData;
