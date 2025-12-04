const calcEmptySpaces = (
  solvedLineMap: (boolean | null)[],
  gridSize: number
) => {
  const emptySpaces: {
    startIndex: number;
    endIndex: number;
    size: number;
  }[] = [];
  let countingEmpty = false;
  let emptyStartIndex = 0;
  for (let i = 0; i < gridSize; i++) {
    if (
      solvedLineMap[i] === null &&
      (i === 0 || solvedLineMap[i - 1] === false)
    ) {
      if (!countingEmpty) {
        countingEmpty = true;
        emptyStartIndex = i;
      }
    } else if (solvedLineMap[i] === false) {
      if (countingEmpty) {
        countingEmpty = false;
        emptySpaces.push({
          startIndex: emptyStartIndex,
          endIndex: i - 1,
          size: i - emptyStartIndex,
        });
      }
    }
  }
  if (countingEmpty) {
    emptySpaces.push({
      startIndex: emptyStartIndex,
      endIndex: gridSize - 1,
      size: gridSize - emptyStartIndex,
    });
  }
  return emptySpaces;
};

export default calcEmptySpaces;
