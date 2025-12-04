const blockLineEdges = (
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
  let somethingChangedBlocks = true;
  let firstUnblockedIndex = Math.min(
    solvedLineMap.indexOf(null) !== -1
      ? solvedLineMap.indexOf(null)
      : gridSize + 1,
    solvedLineMap.indexOf(true)
  );
  let lastUnblockedIndex = Math.max(
    solvedLineMap.lastIndexOf(null),
    solvedLineMap.lastIndexOf(true)
  );
  while (somethingChangedBlocks) {
    somethingChangedBlocks = false;
    const firstBlockedIndex =
      solvedLineMap.slice(firstUnblockedIndex).indexOf(false) +
      firstUnblockedIndex;
    const lastBlockedIndex = solvedLineMap
      .slice(0, lastUnblockedIndex)
      .lastIndexOf(false);

    if (firstBlockedIndex !== -1 && firstBlockedIndex < infoForIndex[0].info!) {
      for (let i = 0; i <= firstBlockedIndex; i++) {
        if (solvedLineMap[i] === false) continue;
        solveCellWithCheck(
          solvedLineMap,
          i,
          false,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
        somethingChangedBlocks = true;
      }
    }
    if (
      lastBlockedIndex !== -1 &&
      gridSize - lastBlockedIndex - 1 <
        infoForIndex[infoForIndex.length - 1].info!
    ) {
      for (let i = lastBlockedIndex; i < gridSize; i++) {
        if (solvedLineMap[i] === false) continue;
        solveCellWithCheck(
          solvedLineMap,
          i,
          false,
          setIsSolving,
          selectedIndex,
          selectedDirection,
          gridMap
        );
        somethingChangedBlocks = true;
      }
    }
    firstUnblockedIndex = Math.min(
      solvedLineMap.indexOf(null) !== -1
        ? solvedLineMap.indexOf(null)
        : gridSize + 1,
      solvedLineMap.indexOf(true)
    );
    lastUnblockedIndex = Math.max(
      solvedLineMap.lastIndexOf(null),
      solvedLineMap.lastIndexOf(true)
    );
  }
  return { firstUnblockedIndex, lastUnblockedIndex };
};
export default blockLineEdges;
