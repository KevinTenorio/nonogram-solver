const solveCellWithCheck = (
  solvedLineMap: (boolean | null)[],
  index: number,
  state: boolean | null,
  setIsSolving: React.Dispatch<React.SetStateAction<boolean>>,
  selectedIndex: number,
  selectedDirection: "row" | "column",
  gridMap: (boolean | null)[][]
) => {
  if (index < 0 || index >= solvedLineMap.length) {
    console.error({
      solvedLineMap,
      index,
      state,
      selectedIndex,
      selectedDirection,
      gridMap,
    });
    return;
  }
  if (solvedLineMap[index] === null) {
    solvedLineMap[index] = state;
  } else if (solvedLineMap[index] !== state) {
    console.error({
      solvedLineMap,
      index,
      state,
      selectedIndex,
      selectedDirection,
      gridMap,
    });
    setIsSolving(false);
    throw new Error("Conflict in cell state");
  }
};

export default solveCellWithCheck;
