const handleSolvedBlocks = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: {
    info: number | null;
    isSolved: boolean;
    startIndex?: number;
    endIndex?: number;
  }[],
  tempInfo: {
    count: number;
    startIndex: number;
    endIndex: number;
    isBlocked: boolean;
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
  let somethingChangedBlocks = true;
  const auxInfo = [...tempInfo];
  while (
    somethingChangedBlocks &&
    infoForIndex.filter((n) => !n.isSolved).length > 0 &&
    auxInfo.length > 0
  ) {
    somethingChangedBlocks = false;
    const biggestBlockSize = Math.max(
      ...infoForIndex.filter((n) => !n.isSolved).map((n) => n.info!)
    );
    const biggestSolvedBlockSize = Math.max(...auxInfo.map((b) => b.count));
    if (biggestBlockSize === biggestSolvedBlockSize) {
      const solvedBlockTemp = auxInfo.find((b) => b.count === biggestBlockSize);
      const blockEndIndex = solvedBlockTemp!.endIndex;
      const blockStartIndex = solvedBlockTemp!.startIndex;
      if (blockEndIndex + 1 < gridSize) {
        solveCellWithCheck(
          solvedLineMap,
          blockEndIndex + 1,
          false,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
      }
      if (blockStartIndex - 1 >= 0) {
        solveCellWithCheck(
          solvedLineMap,
          blockStartIndex - 1,
          false,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
      }
      solvedBlockTemp!.isBlocked = true;

      if (
        infoForIndex.filter((n) => n.info === biggestBlockSize && !n.isSolved)
          .length === 1 ||
        infoForIndex.filter((n) => n.info === biggestBlockSize && !n.isSolved)
          .length === auxInfo.filter((b) => b.count === biggestBlockSize).length
      ) {
        const solvedBlockIndex = infoForIndex.findIndex(
          (n) => n.info === biggestBlockSize && !n.isSolved
        );
        infoForIndex[solvedBlockIndex].isSolved = true;
        infoForIndex[solvedBlockIndex].startIndex = solvedBlockTemp!.startIndex;
        infoForIndex[solvedBlockIndex].endIndex = solvedBlockTemp!.endIndex;
      }
      somethingChangedBlocks = true;
      auxInfo.splice(
        auxInfo.findIndex((b) => b.count === biggestBlockSize),
        1
      );
    }
  }

  for (let i = 0; i < infoForIndex.length; i++) {
    if (infoForIndex[i].isSolved) {
      if (i === 0) {
        for (let j = 0; j < infoForIndex[i].startIndex!; j++) {
          if (solvedLineMap[j] === null) {
            solveCellWithCheck(
              solvedLineMap,
              j,
              false,
              setIsSolving,
              selectedIndex,
              selectedDirection,
              gridMap
            );
          }
        }
      } else if (infoForIndex[i - 1].isSolved) {
        for (
          let j = infoForIndex[i - 1].endIndex! + 1;
          j < infoForIndex[i].startIndex!;
          j++
        ) {
          if (solvedLineMap[j] === null) {
            solveCellWithCheck(
              solvedLineMap,
              j,
              false,
              setIsSolving,
              selectedIndex,
              selectedDirection,
              gridMap
            );
          }
        }
      }
      if (i === infoForIndex.length - 1) {
        for (let j = infoForIndex[i].endIndex! + 1; j < gridSize; j++) {
          if (solvedLineMap[j] === null) {
            solveCellWithCheck(
              solvedLineMap,
              j,
              false,
              setIsSolving,
              selectedIndex,
              selectedDirection,
              gridMap
            );
          }
        }
      }
    }
  }
};

export default handleSolvedBlocks;
