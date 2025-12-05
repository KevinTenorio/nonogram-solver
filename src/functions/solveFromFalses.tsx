function solveFromFalses(
  solvedLineMap: (boolean | null)[],
  infoForIndex: { info: number | null; isSolved: boolean }[],
  tempInfo: {
    count: number;
    startIndex: number;
    endIndex: number;
    canMerge?: boolean;
    canMergeWithNext?: boolean;
    canMergeWithPrev?: boolean;
    officialIndex?: number;
    targetCount?: number;
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
) {
  for (const block of tempInfo) {
    if (block.officialIndex !== undefined) {
      if (solvedLineMap[block.startIndex - 1] === false) {
        for (
          let i = block.endIndex + 1;
          i <= block.endIndex + block.targetCount! - block.count;
          i++
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
          block.count++;
          block.endIndex = i;
        }
        infoForIndex[block.officialIndex].isSolved = true;
        solveCellWithCheck(
          solvedLineMap,
          block.endIndex + 1,
          false,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
      } else if (solvedLineMap[block.endIndex + 1] === false) {
        for (
          let i = block.startIndex - 1;
          i >= block.startIndex - (block.targetCount! - block.count);
          i--
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
          block.count++;
          block.startIndex = i;
        }
        infoForIndex[block.officialIndex].isSolved = true;
        solveCellWithCheck(
          solvedLineMap,
          block.startIndex - 1,
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

export default solveFromFalses;
