const blockBasedOnKnowns = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: { info: number | null }[],
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
  const firstTrueIndex = solvedLineMap.indexOf(true);
  const lastTrueIndex = solvedLineMap.lastIndexOf(true);
  if (firstTrueIndex !== -1) {
    let currentLeftBlockSize = 0;
    for (
      let i = firstTrueIndex;
      i < infoForIndex[0].info! + firstTrueIndex;
      i++
    ) {
      if (solvedLineMap[i] === true) {
        currentLeftBlockSize++;
      } else {
        break;
      }
    }
    const leftBlockSizeMissing = infoForIndex[0].info! - currentLeftBlockSize;
    if (
      leftBlockSizeMissing < firstTrueIndex - firstUnblockedIndex &&
      (firstTrueIndex - firstUnblockedIndex < infoForIndex[0].info! ||
        infoForIndex.length === 1)
    ) {
      for (
        let i = firstUnblockedIndex;
        i < firstTrueIndex - leftBlockSizeMissing;
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
  }
  if (lastTrueIndex !== -1) {
    let currentRightBlockSize = 0;
    for (
      let i = lastTrueIndex;
      i > lastTrueIndex - infoForIndex[infoForIndex.length - 1].info!;
      i--
    ) {
      if (solvedLineMap[i] === true) {
        currentRightBlockSize++;
      } else {
        break;
      }
    }
    const rightBlockSizeMissing =
      infoForIndex[infoForIndex.length - 1].info! - currentRightBlockSize;
    if (
      rightBlockSizeMissing < lastUnblockedIndex - lastTrueIndex &&
      (lastUnblockedIndex - lastTrueIndex <
        infoForIndex[infoForIndex.length - 1].info! ||
        infoForIndex.length === 1)
    ) {
      for (
        let i = lastUnblockedIndex;
        i > lastTrueIndex + rightBlockSizeMissing;
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

export default blockBasedOnKnowns;
