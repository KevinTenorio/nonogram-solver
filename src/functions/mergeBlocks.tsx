const mergeBlocks = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: { info: number | null }[],
  tempInfo: {
    count: number;
    startIndex: number;
    endIndex: number;
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
  if (
    tempInfo.length === infoForIndex.length + 1 &&
    tempInfo.filter((n) => n.canMerge !== false).length === 1
  ) {
    const mergeableBlock = tempInfo.find((n) => n.canMerge !== false)!;
    const mergeableBlockIndex = tempInfo.indexOf(mergeableBlock);
    const neighborBlockToMerge =
      mergeableBlockIndex > 0 &&
      tempInfo[mergeableBlockIndex - 1]?.canMergeWithNext !== false
        ? tempInfo[mergeableBlockIndex - 1]
        : mergeableBlockIndex < tempInfo.length - 1 &&
          tempInfo[mergeableBlockIndex + 1]?.canMergeWithPrev !== false
        ? tempInfo[mergeableBlockIndex + 1]
        : undefined;

    if (neighborBlockToMerge !== undefined) {
      const startingIndex = Math.min(
        mergeableBlock.startIndex,
        neighborBlockToMerge.startIndex
      );
      const endingIndex = Math.max(
        mergeableBlock.endIndex,
        neighborBlockToMerge.endIndex
      );
      mergeableBlock.count = 0;
      for (let i = startingIndex; i <= endingIndex; i++) {
        solveCellWithCheck(
          solvedLineMap,
          i,
          true,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
        mergeableBlock.count++;
      }
      mergeableBlock.startIndex = startingIndex;
      mergeableBlock.endIndex = endingIndex;
      tempInfo.splice(tempInfo.indexOf(neighborBlockToMerge), 1);
    }
  }
};

export default mergeBlocks;
