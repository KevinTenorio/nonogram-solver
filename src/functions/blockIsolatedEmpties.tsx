const blockIsolatedEmpties = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: { info: number | null }[],
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
  const firstEmptyIndex = solvedLineMap.indexOf(null);
  const lastEmptyIndex = solvedLineMap.lastIndexOf(null);
  if (
    firstTrueIndex !== -1 &&
    firstTrueIndex - firstEmptyIndex === infoForIndex[0].info!
  ) {
    solveCellWithCheck(
      solvedLineMap,
      firstEmptyIndex,
      false,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap
    );
  }
  if (
    lastTrueIndex !== -1 &&
    lastEmptyIndex - lastTrueIndex ===
      infoForIndex[infoForIndex.length - 1].info!
  ) {
    solveCellWithCheck(
      solvedLineMap,
      lastEmptyIndex,
      false,
      setIsSolving,
      selectedIndex,
      selectedDirection,
      gridMap
    );
  }
};

export default blockIsolatedEmpties;
