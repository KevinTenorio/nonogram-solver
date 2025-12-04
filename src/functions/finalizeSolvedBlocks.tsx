const finalizeSolvedBlocks = (
  solvedLineMap: (boolean | null)[],
  tempInfo: {
    count: number;
    startIndex: number;
    endIndex: number;
    isBlocked: boolean;
    officialIndex?: number;
    targetCount?: number;
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
  for (const block of tempInfo) {
    if (
      block.officialIndex !== undefined &&
      block.count === block.targetCount
    ) {
      // Marks blocks as solved
      const blockEndIndex = block.endIndex;
      const blockStartIndex = block.startIndex;
      block.isBlocked = true;
      // Blocks neighbours
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
    }
  }
};

export default finalizeSolvedBlocks;
