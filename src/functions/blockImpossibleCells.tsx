const blockImpossibleCells = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: { info: number | null }[],
  tempInfo: {
    count: number;
    startIndex: number;
    endIndex: number;
    targetCount?: number;
    officialIndex?: number;
    startLimitIndex?: number;
    endLimitIndex?: number;
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
  if (
    tempInfo.length === infoForIndex.length &&
    tempInfo.every((b) => b.officialIndex !== undefined)
  ) {
    for (const block of tempInfo) {
      const missingCells = block.targetCount! - block.count;
      block.startLimitIndex = block.startIndex - missingCells;
      block.endLimitIndex = block.endIndex + missingCells;
    }
    for (let i = 0; i < gridSize; i++) {
      if (
        tempInfo.every((n) => i < n.startLimitIndex! || i > n.endLimitIndex!)
      ) {
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
};

export default blockImpossibleCells;
