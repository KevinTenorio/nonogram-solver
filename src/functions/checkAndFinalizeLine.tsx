const checkAndFinalizeLine = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: { info: number | null }[],
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
  let infoSatisfied = true;
  let count = 0;
  const tempInfo: {
    count: number;
    startIndex: number;
    endIndex: number;
    isBlocked: boolean;
    canMerge?: boolean;
    canMergeWithNext?: boolean;
    canMergeWithPrev?: boolean;
    officialIndex?: number;
    targetCount?: number;
    startLimitIndex?: number;
    endLimitIndex?: number;
  }[] = [];
  for (let i = 0; i < gridSize; i++) {
    if (solvedLineMap[i] === true) {
      count++;
    } else {
      if (count > 0) {
        tempInfo.push({
          count,
          startIndex: i - count,
          endIndex: i - 1,
          isBlocked: false,
        });
        count = 0;
      }
    }
  }
  if (count > 0) {
    tempInfo.push({
      count,
      startIndex: gridSize - count,
      endIndex: gridSize - 1,
      isBlocked: false,
    });
  }
  if (tempInfo.length !== infoForIndex.length) {
    infoSatisfied = false;
  } else {
    for (let i = 0; i < tempInfo.length; i++) {
      if (tempInfo[i]?.count !== infoForIndex[i].info!) {
        infoSatisfied = false;
        break;
      }
    }
  }
  if (infoSatisfied) {
    for (let i = 0; i < gridSize; i++) {
      if (solvedLineMap[i] === null) {
        solveCellWithCheck(
          solvedLineMap,
          i,
          false,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
      }
    }
  }
  return tempInfo;
};

export default checkAndFinalizeLine;
