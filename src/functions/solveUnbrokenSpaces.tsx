import calcEmptySpaces from "./calcEmptySpaces";

const solveUnbrokenSpaces = (
  solvedLineMap: (boolean | null)[],
  infoForIndex: { info: number | null; isSolved: boolean }[],
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
  const emptySpaces = calcEmptySpaces(solvedLineMap, gridSize);
  if (
    infoForIndex.filter((n) => !n.isSolved).length === emptySpaces.length &&
    !infoForIndex
      .filter((n) => !n.isSolved)
      ?.map((n) => n.info!)
      .some((value, index) => value !== emptySpaces.map((n) => n.size)[index])
  ) {
    for (const space of emptySpaces) {
      for (let i = space.startIndex; i <= space.endIndex; i++) {
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
  }
};

export default solveUnbrokenSpaces;
