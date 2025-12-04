const expandUnmergeableBlocks = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: {
    info: number | null;
    isSolved: boolean;
    startLimitIndex?: number;
    endLimitIndex?: number;
  }[],
  tempInfo: {
    count: number;
    startIndex: number;
    endIndex: number;
    canMerge?: boolean;
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
) => {
  if (tempInfo.length > 0) {
    const firstTempBlock = tempInfo[0];
    const firstInfoBlock = infoForIndex[0];
    let firstEmptyIndex = solvedLineMap.indexOf(null);
    if (firstInfoBlock.info! > firstTempBlock.startIndex - firstEmptyIndex) {
      firstTempBlock.officialIndex = 0;
      firstTempBlock.targetCount = firstInfoBlock.info!;
    }
    const lastTempBlock = tempInfo[tempInfo.length - 1];
    const lastInfoBlock = infoForIndex[infoForIndex.length - 1];
    let lastEmptyIndex = solvedLineMap.lastIndexOf(null);
    if (lastInfoBlock.info! > lastEmptyIndex - lastTempBlock.endIndex) {
      lastTempBlock.officialIndex = infoForIndex.length - 1;
      lastTempBlock.targetCount = lastInfoBlock.info!;
    }
    if (
      firstTempBlock.targetCount !== undefined &&
      tempInfo[1] &&
      tempInfo[1].endIndex - firstTempBlock.startIndex >
        firstTempBlock.targetCount &&
      infoForIndex[1].info! > tempInfo[1].endIndex - firstTempBlock.startIndex
    ) {
      tempInfo[1].canMerge = false;
      firstTempBlock.canMerge = false;
      tempInfo[1].officialIndex = 1;
      tempInfo[1].targetCount = infoForIndex[1].info!;
    }
    if (
      lastTempBlock.targetCount !== undefined &&
      tempInfo[tempInfo.length - 2] &&
      lastTempBlock.endIndex - tempInfo[tempInfo.length - 2].startIndex >
        lastTempBlock.targetCount &&
      infoForIndex[infoForIndex.length - 2].info! >
        lastTempBlock.endIndex - tempInfo[tempInfo.length - 2].startIndex
    ) {
      tempInfo[tempInfo.length - 2].canMerge = false;
      lastTempBlock.canMerge = false;
      tempInfo[tempInfo.length - 2].officialIndex = infoForIndex.length - 2;
      tempInfo[tempInfo.length - 2].targetCount =
        infoForIndex[infoForIndex.length - 2].info!;
    }
    for (const block of tempInfo) {
      if (block.officialIndex !== undefined && block.canMerge === false) {
        if (
          block.count < block.targetCount! &&
          block.endIndex + block.targetCount! - block.count >
            infoForIndex[block.officialIndex].endLimitIndex!
        ) {
          const cellsToFillToLeft =
            block.endIndex +
            block.targetCount! -
            block.count -
            infoForIndex[block.officialIndex].endLimitIndex!;
          for (
            let i = block.startIndex - 1;
            i >= block.startIndex - cellsToFillToLeft;
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
          }
          block.startIndex -= cellsToFillToLeft;
        }
      }
    }
    for (const block of tempInfo) {
      if (block.officialIndex !== undefined && block.canMerge === false) {
        if (
          block.count < block.targetCount! &&
          block.startIndex - block.targetCount! + block.count <
            infoForIndex[block.officialIndex].startLimitIndex!
        ) {
          const cellsToFillToRight =
            infoForIndex[block.officialIndex].startLimitIndex! -
            block.startIndex +
            block.targetCount! -
            block.count;
          for (
            let i = block.endIndex + 1;
            i <= block.endIndex + cellsToFillToRight;
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
          }
          block.endIndex += cellsToFillToRight;
        }
      }
    }
    if (
      tempInfo.length === infoForIndex.length &&
      !tempInfo.some((n) => n.canMerge !== false)
    ) {
      for (let i = 0; i < tempInfo.length; i++) {
        tempInfo[i].officialIndex = i;
        tempInfo[i].targetCount = infoForIndex[i].info!;
      }
    }
    if (
      firstTempBlock.officialIndex === 0 &&
      firstTempBlock.canMerge === false
    ) {
      const missingCells = firstTempBlock.targetCount! - firstTempBlock.count;

      firstEmptyIndex = solvedLineMap.indexOf(null);
      const cellsToBlockToLeft =
        firstTempBlock.startIndex - firstEmptyIndex - missingCells;
      for (
        let i = firstEmptyIndex;
        i < firstEmptyIndex + cellsToBlockToLeft;
        i++
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
    if (
      lastTempBlock.officialIndex === infoForIndex.length - 1 &&
      lastTempBlock.canMerge === false
    ) {
      const missingCells = lastTempBlock.targetCount! - lastTempBlock.count;
      lastEmptyIndex = solvedLineMap.lastIndexOf(null);
      const cellsToBlockToRight =
        lastEmptyIndex - lastTempBlock.endIndex - missingCells;
      for (
        let i = lastEmptyIndex;
        i > lastEmptyIndex - cellsToBlockToRight;
        i--
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
export default expandUnmergeableBlocks;
