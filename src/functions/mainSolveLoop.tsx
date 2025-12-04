const mainSolveLoop = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: {
    info: number | null;
    isSolved: boolean;
    startIndex?: number;
    endIndex?: number;
    startLimitIndex?: number;
    endLimitIndex?: number;
  }[],
  gridSize: number,
  firstUnblockedIndex: number,
  lastUnblockedIndex: number,
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
  for (let i = 0; i < infoForIndex.length; i++) {
    const blockSize = infoForIndex[i].info!;
    let blocksFilledToLeft =
      firstUnblockedIndex !== -1 ? firstUnblockedIndex : 0;
    let blocksFilledToRight =
      lastUnblockedIndex !== -1 ? gridSize - 1 - lastUnblockedIndex : 0;
    for (let j = 0; j < i; j++) {
      blocksFilledToLeft +=
        infoForIndex[j] !== null ? infoForIndex[j].info! + 1 : 0;
    }
    for (let j = infoForIndex.length - 1; j > i; j--) {
      blocksFilledToRight +=
        infoForIndex[j] !== null ? infoForIndex[j].info! + 1 : 0;
    }

    for (let j = blocksFilledToLeft; j < blocksFilledToLeft + blockSize!; j++) {
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
    infoForIndex[i].startLimitIndex = blocksFilledToLeft;
    infoForIndex[i].endLimitIndex = gridSize - blocksFilledToRight - 1;
    const leftLeaningEndIndex = blocksFilledToLeft + blockSize!;
    const rightLeaningStartIndex = gridSize - blocksFilledToRight - blockSize!;
    if (rightLeaningStartIndex < leftLeaningEndIndex) {
      for (let k = leftLeaningEndIndex - 1; k >= rightLeaningStartIndex; k--) {
        solveCellWithCheck(
          solvedLineMap,
          k,
          true,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
      }
      if (leftLeaningEndIndex - rightLeaningStartIndex === blockSize!) {
        if (rightLeaningStartIndex - 1 >= 0)
          solveCellWithCheck(
            solvedLineMap,
            rightLeaningStartIndex - 1,
            false,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
        if (leftLeaningEndIndex < gridSize)
          solveCellWithCheck(
            solvedLineMap,
            leftLeaningEndIndex,
            false,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
      }
    }
  }
};

export default mainSolveLoop;
