import calcEmptySpaces from "./calcEmptySpaces";

const blockSmallEmptySpaces = (
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
  const smallestUnsolvedBlockSize = Math.min(
    ...infoForIndex.filter((n) => !n.isSolved).map((n) => n.info!)
  );
  const emptySpaces = calcEmptySpaces(solvedLineMap, gridSize);

  for (const space of emptySpaces) {
    if (space.size < smallestUnsolvedBlockSize) {
      for (let i = space.startIndex; i <= space.endIndex; i++) {
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

export default blockSmallEmptySpaces;
