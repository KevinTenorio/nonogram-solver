const fillFromEdges = (
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
  if (
    firstTrueIndex !== -1 &&
    firstTrueIndex - firstUnblockedIndex < infoForIndex[0].info!
  ) {
    for (
      let i = firstTrueIndex;
      i < firstUnblockedIndex + infoForIndex[0].info!;
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
    }
  }
  if (
    lastTrueIndex !== -1 &&
    lastUnblockedIndex - lastTrueIndex <
      infoForIndex[infoForIndex.length - 1].info!
  ) {
    for (
      let i = lastTrueIndex;
      i > lastUnblockedIndex - infoForIndex[infoForIndex.length - 1].info!;
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
    }
  }
};

export default fillFromEdges;
