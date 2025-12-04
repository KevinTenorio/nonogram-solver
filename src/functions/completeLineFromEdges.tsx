const completeLineFromEdges = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: {
    info: number | null;
    isSolved: boolean;
    startIndex?: number;
    endIndex?: number;
  }[],
  gridSize: number,
  setIsSolving: React.Dispatch<React.SetStateAction<boolean>>,
  selectedIndex: number,
  selectedDirection: "row" | "column",
  gridMap: (boolean | null)[][],
  solveCellWithCheck: (
    solvedLineMap: (boolean | null)[],
    index: number,
    value: boolean,
    setIsSolving: React.Dispatch<React.SetStateAction<boolean>>,
    selectedIndex: number,
    selectedDirection: "row" | "column",
    gridMap: (boolean | null)[][]
  ) => void
) => {
  let currentBlockSize = 0;
  let infoToSolve = infoForIndex.find((n) => !n.isSolved);
  while (infoToSolve !== undefined) {
    // From the left edge
    currentBlockSize = 0;
    infoToSolve = infoForIndex.find((n) => !n.isSolved);
    if (infoToSolve === undefined) {
      break;
    }
    const startingIndex =
      (infoForIndex[infoForIndex.indexOf(infoToSolve) - 1]?.endIndex ?? -1) + 1;
    for (let i = startingIndex; i < gridSize; i++) {
      if (currentBlockSize >= infoToSolve.info!) {
        solveCellWithCheck(
          solvedLineMap,
          i,
          false,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
        infoToSolve.isSolved = true;
        infoToSolve.startIndex = i - currentBlockSize;
        infoToSolve.endIndex = i - 1;
        currentBlockSize = 0;
        break;
      }
      if (solvedLineMap[i] === null && currentBlockSize === 0) {
        infoToSolve = undefined;
        break;
      } else if (solvedLineMap[i] === true) {
        currentBlockSize++;
      } else if (solvedLineMap[i] === false) {
        currentBlockSize = 0;
      } else if (
        solvedLineMap[i] === null &&
        currentBlockSize < infoToSolve.info!
      ) {
        solveCellWithCheck(
          solvedLineMap,
          i,
          true,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
        currentBlockSize++;
      }
    }
    // From the right edge
    currentBlockSize = 0;
    infoToSolve =
      infoForIndex.map((n) => n.isSolved).lastIndexOf(false) !== -1
        ? infoForIndex[infoForIndex.map((n) => n.isSolved).lastIndexOf(false)]
        : undefined;
    if (infoToSolve === undefined) {
      break;
    }
    const endingIndex =
      (infoForIndex[infoForIndex.indexOf(infoToSolve) + 1]?.startIndex ??
        gridSize) - 1;
    for (let i = endingIndex; i >= 0; i--) {
      if (currentBlockSize >= infoToSolve.info!) {
        solveCellWithCheck(
          solvedLineMap,
          i,
          false,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
        infoToSolve.isSolved = true;
        infoToSolve.startIndex = i + 1;
        infoToSolve.endIndex = i + currentBlockSize;
        currentBlockSize = 0;
        break;
      }
      if (solvedLineMap[i] === null && currentBlockSize === 0) {
        infoToSolve = undefined;
        break;
      } else if (solvedLineMap[i] === true) {
        currentBlockSize++;
      } else if (solvedLineMap[i] === false) {
        currentBlockSize = 0;
      } else if (
        solvedLineMap[i] === null &&
        currentBlockSize < infoToSolve.info!
      ) {
        solveCellWithCheck(
          solvedLineMap,
          i,
          true,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
        currentBlockSize++;
      }
    }
  }
};

export default completeLineFromEdges;
