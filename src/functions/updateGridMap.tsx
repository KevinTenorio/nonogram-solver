const updateGridMap = (
  gridMap: (boolean | null)[][],
  solvedLineMap: (boolean | null)[],
  selectedDirection: "row" | "column",
  selectedIndex: number,
  gridSize: number
) => {
  const newGridMap = [...gridMap];
  if (selectedDirection === "row") {
    for (let i = 0; i < gridSize; i++) {
      newGridMap[selectedIndex][i] = solvedLineMap[i];
    }
  }
  if (selectedDirection === "column") {
    for (let i = 0; i < gridSize; i++) {
      newGridMap[i][selectedIndex] = solvedLineMap[i];
    }
  }
  return newGridMap;
};

export default updateGridMap;
