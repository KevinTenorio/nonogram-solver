const handleUnmergeableBlocks = (
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
    canMerge?: boolean;
    canMergeWithNext?: boolean;
    canMergeWithPrev?: boolean;
  }[],
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
  if (tempInfo.length > 0) {
    let mergeable = 0;
    for (let i = 1; i < tempInfo.length; i++) {
      let canMerge = true;
      const mergedBlockSize =
        tempInfo[i - 1].count +
        tempInfo[i].count +
        tempInfo[i].startIndex -
        tempInfo[i - 1].endIndex -
        1;
      if (mergedBlockSize > Math.max(...infoForIndex.map((n) => n.info!))) {
        canMerge = false;
      }
      for (let j = tempInfo[i - 1].endIndex; j < tempInfo[i].startIndex; j++) {
        if (solvedLineMap[j] === false) {
          canMerge = false;
          break;
        }
      }
      if (!canMerge) {
        tempInfo[i - 1].canMerge = false;
        tempInfo[i].canMerge = false;
        tempInfo[i - 1].canMergeWithNext = false;
        tempInfo[i].canMergeWithPrev = false;
      } else {
        mergeable++;
      }
    }
    if (tempInfo.length === infoForIndex.length && mergeable === 0) {
      for (let i = 0; i < tempInfo.length; i++) {
        if (
          tempInfo[i].canMerge === false &&
          infoForIndex[i].info === tempInfo[i].count
        ) {
          infoForIndex[i].isSolved = true;
          infoForIndex[i].startIndex = tempInfo[i].startIndex;
          infoForIndex[i].endIndex = tempInfo[i].endIndex;
          tempInfo[i].isBlocked = true;
          solveCellWithCheck(
            solvedLineMap,
            tempInfo[i].startIndex - 1,
            false,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
          solveCellWithCheck(
            solvedLineMap,
            tempInfo[i].endIndex + 1,
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
};

export default handleUnmergeableBlocks;
