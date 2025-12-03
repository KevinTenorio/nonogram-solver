import { useState, useEffect, useCallback } from "react";
import "./App.css";

import easy1 from "./easy1.json";
import easy2 from "./easy2.json";
import medium1 from "./medium1.json";
import medium2 from "./medium2.json";
import hard1 from "./hard1.json";
import hard2 from "./hard2.json";
import specialist1 from "./specialist1.json";
import specialist2 from "./specialist2.json";
import specialist3 from "./specialist3.json";

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

function App() {
  const [gridSize, setGridSize] = useState(0);
  const [rowInfo, setRowInfo] = useState<(number | null)[][]>([]);
  const [columnInfo, setColumnInfo] = useState<(number | null)[][]>([]);
  const [gridMap, setGridMap] = useState<(boolean | null)[][]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedDirection, setSelectedDirection] = useState<"row" | "column">(
    "row"
  );
  const [selectedBlockState, setSelectedBlockState] = useState<boolean | null>(
    true
  );
  const [delay, setDelay] = useState<number>(25);
  const [isSolving, setIsSolving] = useState(false);

  const solve = useCallback(() => {
    // Initializes info for the selected line
    const infoForIndex: {
      info: number | null;
      isSolved: boolean;
      startIndex?: number;
      endIndex?: number;
    }[] =
      selectedDirection === "row"
        ? rowInfo[selectedIndex].map((n) => ({ info: n, isSolved: false }))
        : columnInfo[selectedIndex].map((n) => ({ info: n, isSolved: false }));

    const solvedLineMap: (boolean | null)[] = new Array(gridSize).fill(null);
    if (selectedDirection === "row") {
      for (let i = 0; i < gridSize; i++) {
        solvedLineMap[i] = gridMap[selectedIndex][i];
      }
    }
    if (selectedDirection === "column") {
      for (let i = 0; i < gridSize; i++) {
        solvedLineMap[i] = gridMap[i][selectedIndex];
      }
    }

    // Checks if already solved
    if (!solvedLineMap.includes(null)) {
      return;
    }
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

      if (
        firstBlockedIndex !== -1 &&
        firstBlockedIndex < infoForIndex[0].info!
      ) {
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

    // Fills from the edges if possible
    let firstTrueIndex = solvedLineMap.indexOf(true);
    let lastTrueIndex = solvedLineMap.lastIndexOf(true);
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

    // Blocks edges if possible
    firstTrueIndex = solvedLineMap.indexOf(true);
    lastTrueIndex = solvedLineMap.lastIndexOf(true);
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

    // Blocks isolated empties at the edges
    firstTrueIndex = solvedLineMap.indexOf(true);
    lastTrueIndex = solvedLineMap.lastIndexOf(true);
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

    // Main solving loop
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
    for (let i = 0; i < infoForIndex.length; i++) {
      const blockSize = infoForIndex[i].info!;
      let blocksFilledToLeft =
        firstUnblockedIndex !== -1 ? firstUnblockedIndex : 0;
      let blocksFilledToRight =
        lastUnblockedIndex !== -1 ? gridSize - 1 - lastUnblockedIndex : 0;
      for (let j = 0; j < i; j++) {
        blocksFilledToLeft +=
          infoForIndex[j] !== null ? infoForIndex[j].info! + 1 : 0;
      }
      for (let j = infoForIndex.length - 1; j > i; j--) {
        blocksFilledToRight +=
          infoForIndex[j] !== null ? infoForIndex[j].info! + 1 : 0;
      }

      for (
        let j = blocksFilledToLeft;
        j < blocksFilledToLeft + blockSize!;
        j++
      ) {
        if (solvedLineMap[j] === false) {
          blocksFilledToLeft = j + 1;
          j = blocksFilledToLeft - 1;
        }
      }

      for (
        let j = gridSize - 1 - blocksFilledToRight;
        j >= gridSize - blocksFilledToRight - blockSize!;
        j--
      ) {
        if (solvedLineMap[j] === false) {
          blocksFilledToRight = gridSize - j;
          j = gridSize - blocksFilledToRight - 1;
        }
      }

      const leftLeaningEndIndex = blocksFilledToLeft + blockSize!;
      const rightLeaningStartIndex =
        gridSize - blocksFilledToRight - blockSize!;
      if (rightLeaningStartIndex < leftLeaningEndIndex) {
        for (
          let k = leftLeaningEndIndex - 1;
          k >= rightLeaningStartIndex;
          k--
        ) {
          solveCellWithCheck(
            solvedLineMap,
            k,
            true,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
        }
        if (leftLeaningEndIndex - rightLeaningStartIndex === blockSize!) {
          if (rightLeaningStartIndex - 1 >= 0)
            solveCellWithCheck(
              solvedLineMap,
              rightLeaningStartIndex - 1,
              false,
              setIsSolving,
              selectedIndex,
              selectedDirection,
              gridMap
            );
          if (leftLeaningEndIndex < gridSize)
            solveCellWithCheck(
              solvedLineMap,
              leftLeaningEndIndex,
              false,
              setIsSolving,
              selectedIndex,
              selectedDirection,
              gridMap
            );
        }
      }
    }

    // Checks if every Info is satisfied
    let infoSatisfied = true;
    let count = 0;
    const tempInfo: {
      count: number;
      startIndex: number;
      endIndex: number;
      isBlocked: boolean;
      canMerge?: boolean;
    }[] = [];
    for (let i = 0; i < gridSize; i++) {
      if (solvedLineMap[i] === true) {
        count++;
      } else {
        if (count > 0) {
          tempInfo.push({
            count,
            startIndex: i - count,
            endIndex: i - 1,
            isBlocked: false,
          });
          count = 0;
        }
      }
    }
    if (count > 0) {
      tempInfo.push({
        count,
        startIndex: gridSize - count,
        endIndex: gridSize - 1,
        isBlocked: false,
      });
    }
    if (tempInfo.length !== infoForIndex.length) {
      infoSatisfied = false;
    } else {
      for (let i = 0; i < tempInfo.length; i++) {
        if (tempInfo[i]?.count !== infoForIndex[i].info!) {
          infoSatisfied = false;
          break;
        } else {
          // Marks blocks as solved
          const blockEndIndex = tempInfo[i].endIndex;
          const blockStartIndex = tempInfo[i].startIndex;
          if (blockEndIndex + 1 < gridSize) {
            solveCellWithCheck(
              solvedLineMap,
              blockEndIndex + 1,
              false,
              setIsSolving,
              selectedIndex,
              selectedDirection,
              gridMap
            );
          }
          if (blockStartIndex - 1 >= 0) {
            solveCellWithCheck(
              solvedLineMap,
              blockStartIndex - 1,
              false,
              setIsSolving,
              selectedIndex,
              selectedDirection,
              gridMap
            );
          }
        }
      }
    }
    if (infoSatisfied) {
      for (let i = 0; i < gridSize; i++) {
        if (solvedLineMap[i] === null) {
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

    // Blocks neighbours of solved blocks
    somethingChangedBlocks = true;
    const auxInfo = [...tempInfo];
    while (
      somethingChangedBlocks &&
      infoForIndex.filter((n) => !n.isSolved).length > 0 &&
      auxInfo.length > 0
    ) {
      somethingChangedBlocks = false;
      const biggestBlockSize = Math.max(
        ...infoForIndex.filter((n) => !n.isSolved).map((n) => n.info!)
      );
      const biggestSolvedBlockSize = Math.max(...auxInfo.map((b) => b.count));
      if (biggestBlockSize === biggestSolvedBlockSize) {
        const solvedBlockTemp = auxInfo.find(
          (b) => b.count === biggestBlockSize
        );
        const blockEndIndex = solvedBlockTemp!.endIndex;
        const blockStartIndex = solvedBlockTemp!.startIndex;
        if (blockEndIndex + 1 < gridSize) {
          solveCellWithCheck(
            solvedLineMap,
            blockEndIndex + 1,
            false,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
        }
        if (blockStartIndex - 1 >= 0) {
          solveCellWithCheck(
            solvedLineMap,
            blockStartIndex - 1,
            false,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
        }
        solvedBlockTemp!.isBlocked = true;

        if (
          infoForIndex.filter((n) => n.info === biggestBlockSize && !n.isSolved)
            .length === 1 ||
          infoForIndex.filter((n) => n.info === biggestBlockSize && !n.isSolved)
            .length ===
            auxInfo.filter((b) => b.count === biggestBlockSize).length
        ) {
          const solvedBlockIndex = infoForIndex.findIndex(
            (n) => n.info === biggestBlockSize && !n.isSolved
          );
          infoForIndex[solvedBlockIndex].isSolved = true;
          infoForIndex[solvedBlockIndex].startIndex =
            solvedBlockTemp!.startIndex;
          infoForIndex[solvedBlockIndex].endIndex = solvedBlockTemp!.endIndex;
        }
        somethingChangedBlocks = true;
        auxInfo.splice(
          auxInfo.findIndex((b) => b.count === biggestBlockSize),
          1
        );
      }
    }

    // Blocks surrounding of solved blocks
    for (let i = 0; i < infoForIndex.length; i++) {
      if (infoForIndex[i].isSolved) {
        if (i === 0) {
          for (let j = 0; j < infoForIndex[i].startIndex!; j++) {
            if (solvedLineMap[j] === null) {
              solveCellWithCheck(
                solvedLineMap,
                j,
                false,
                setIsSolving,
                selectedIndex,
                selectedDirection,
                gridMap
              );
            }
          }
        } else if (infoForIndex[i - 1].isSolved) {
          for (
            let j = infoForIndex[i - 1].endIndex! + 1;
            j < infoForIndex[i].startIndex!;
            j++
          ) {
            if (solvedLineMap[j] === null) {
              solveCellWithCheck(
                solvedLineMap,
                j,
                false,
                setIsSolving,
                selectedIndex,
                selectedDirection,
                gridMap
              );
            }
          }
        }
        if (i === infoForIndex.length - 1) {
          for (let j = infoForIndex[i].endIndex! + 1; j < gridSize; j++) {
            if (solvedLineMap[j] === null) {
              solveCellWithCheck(
                solvedLineMap,
                j,
                false,
                setIsSolving,
                selectedIndex,
                selectedDirection,
                gridMap
              );
            }
          }
        }
      }
    }

    // Blocks empty spaces too small for remaining blocks
    const smallestUnsolvedBlockSize = Math.min(
      ...infoForIndex.filter((n) => !n.isSolved).map((n) => n.info!)
    );
    let emptySpaces = calcEmptySpaces(solvedLineMap, gridSize);

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

    // Solves unmergeble blocks
    if (tempInfo.length > 0 && tempInfo.length === infoForIndex.length) {
      for (let i = 1; i < tempInfo.length; i++) {
        let canMerge = true;
        const mergedBlockSize =
          tempInfo[i - 1].count +
          tempInfo[i].count +
          tempInfo[i].startIndex -
          tempInfo[i - 1].endIndex -
          1;
        if (mergedBlockSize > Math.max(...infoForIndex.map((n) => n.info!))) {
          canMerge = false;
        }
        for (
          let j = tempInfo[i - 1].endIndex;
          j < tempInfo[i].startIndex;
          j++
        ) {
          if (solvedLineMap[j] === false) {
            canMerge = false;
            break;
          }
        }
        if (!canMerge) {
          tempInfo[i - 1].canMerge = false;
          tempInfo[i].canMerge = false;
        }
      }
      for (let i = 0; i < tempInfo.length; i++) {
        if (
          tempInfo[i].canMerge === false &&
          infoForIndex[i].info === tempInfo[i].count
        ) {
          infoForIndex[i].isSolved = true;
          infoForIndex[i].startIndex = tempInfo[i].startIndex;
          infoForIndex[i].endIndex = tempInfo[i].endIndex;
          tempInfo[i].isBlocked = true;
          solveCellWithCheck(
            solvedLineMap,
            tempInfo[i].startIndex - 1,
            false,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
          solveCellWithCheck(
            solvedLineMap,
            tempInfo[i].endIndex + 1,
            false,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
        }
      }
    }

    // Completes the line from the edges
    let currentBlockSize = 0;
    let infoToSolve = infoForIndex.find((n) => !n.isSolved);
    while (infoToSolve !== undefined) {
      // From the left edge
      currentBlockSize = 0;
      infoToSolve = infoForIndex.find((n) => !n.isSolved);
      if (infoToSolve === undefined) {
        break;
      }
      const startingIndex =
        (infoForIndex[infoForIndex.indexOf(infoToSolve) - 1]?.endIndex ?? -1) +
        1;
      for (let i = startingIndex; i < gridSize; i++) {
        if (currentBlockSize >= infoToSolve.info!) {
          solveCellWithCheck(
            solvedLineMap,
            i,
            false,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
          infoToSolve.isSolved = true;
          infoToSolve.startIndex = i - currentBlockSize;
          infoToSolve.endIndex = i - 1;
          currentBlockSize = 0;
          break;
        }
        if (solvedLineMap[i] === null && currentBlockSize === 0) {
          infoToSolve = undefined;
          break;
        } else if (solvedLineMap[i] === true) {
          currentBlockSize++;
        } else if (solvedLineMap[i] === false) {
          currentBlockSize = 0;
        } else if (
          solvedLineMap[i] === null &&
          currentBlockSize < infoToSolve.info!
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
          currentBlockSize++;
        }
      }
      // From the right edge
      currentBlockSize = 0;
      infoToSolve =
        infoForIndex.map((n) => n.isSolved).lastIndexOf(false) !== -1
          ? infoForIndex[infoForIndex.map((n) => n.isSolved).lastIndexOf(false)]
          : undefined;
      if (infoToSolve === undefined) {
        break;
      }
      const endingIndex =
        (infoForIndex[infoForIndex.indexOf(infoToSolve) + 1]?.startIndex ??
          gridSize) - 1;
      for (let i = endingIndex; i >= 0; i--) {
        if (currentBlockSize >= infoToSolve.info!) {
          solveCellWithCheck(
            solvedLineMap,
            i,
            false,
            setIsSolving,
            selectedIndex,
            selectedDirection,
            gridMap
          );
          infoToSolve.isSolved = true;
          infoToSolve.startIndex = i + 1;
          infoToSolve.endIndex = i + currentBlockSize;
          currentBlockSize = 0;
          break;
        }
        if (solvedLineMap[i] === null && currentBlockSize === 0) {
          infoToSolve = undefined;
          break;
        } else if (solvedLineMap[i] === true) {
          currentBlockSize++;
        } else if (solvedLineMap[i] === false) {
          currentBlockSize = 0;
        } else if (
          solvedLineMap[i] === null &&
          currentBlockSize < infoToSolve.info!
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
          currentBlockSize++;
        }
      }
    }

    // Solves missing blocks in unbroken empty spaces
    emptySpaces = calcEmptySpaces(solvedLineMap, gridSize);
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

    // Updates the grid map with the solved line
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
    setGridMap(newGridMap);
  }, [
    gridMap,
    gridSize,
    rowInfo,
    columnInfo,
    selectedIndex,
    selectedDirection,
  ]);

  useEffect(() => {
    if (!isSolving) {
      return;
    }

    const solveGrid = () => {
      const isGridSolved = !gridMap.flat().includes(null);
      if (isGridSolved) {
        setIsSolving(false);
        return;
      }

      solve();
      if (selectedIndex === gridSize - 1) {
        setSelectedDirection((prevDirection) =>
          prevDirection === "row" ? "column" : "row"
        );
      }
      setSelectedIndex((prevIndex) => {
        return (prevIndex + 1) % gridSize;
      });
    };

    const intervalId = setInterval(solveGrid, delay);

    return () => clearInterval(intervalId);
  }, [
    isSolving,
    gridSize,
    gridMap,
    selectedIndex,
    selectedDirection,
    solve,
    delay,
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      NONOGRAM SOLVER
      <input
        type="number"
        value={gridSize > 0 ? gridSize : ""}
        onChange={(e) => {
          const size = parseInt(e.target.value);
          setGridSize(size);
          setRowInfo(new Array(size).fill([]));
          setColumnInfo(new Array(size).fill([]));
          setGridMap(
            Array.from({ length: size }, () => new Array(size).fill(null))
          );
        }}
        placeholder="Enter row size"
      />
      <input
        type="number"
        value={delay > 0 ? delay : ""}
        onChange={(e) => {
          const delayValue = parseInt(e.target.value);
          setDelay(delayValue);
        }}
        placeholder="Enter delay time (ms)"
      />
      <button
        onClick={() =>
          setSelectedDirection(selectedDirection === "row" ? "column" : "row")
        }
      >
        Flip Direction
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        }}
      >
        <button
          onClick={() => {
            const example = { ...easy1 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Easy 1
        </button>
        <button
          onClick={() => {
            const example = { ...easy2 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Easy 2
        </button>
        <button
          onClick={() => {
            const example = { ...medium1 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Medium 1
        </button>
        <button
          onClick={() => {
            const example = { ...medium2 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Medium 2
        </button>
        <button
          onClick={() => {
            const example = { ...hard1 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Hard 1
        </button>
        <button
          onClick={() => {
            const example = { ...hard2 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Hard 2
        </button>
        <button
          onClick={() => {
            const example = { ...specialist1 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Specialist 1
        </button>
        <button
          onClick={() => {
            const example = { ...specialist2 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Specialist 2
        </button>
        <button
          onClick={() => {
            const example = { ...specialist3 };
            setSelectedDirection("row");
            setSelectedIndex(0);
            setGridSize(example.gridMap.length);
            setRowInfo(example.rowInfo);
            setColumnInfo(example.columnInfo);
            setGridMap(example.gridMap);
          }}
        >
          Specialist 3
        </button>
      </div>
      <button
        onClick={() => {
          console.log({ rowInfo, columnInfo, gridMap });
        }}
      >
        Log Current Grid
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "end",
          marginBottom: "-16px",
        }}
      >
        {gridMap.map((_, columnIndex) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginRight: (columnIndex + 1) % 5 === 0 ? "4px" : "0px",
              width: "26px",
              height: "100%",
              alignItems: "center",
            }}
            key={columnIndex}
          >
            <button
              onClick={() => {
                setSelectedIndex(columnIndex);
                setSelectedDirection("column");
              }}
              style={{
                height: "24px",
                width: "24px",
                marginBottom: "8px",
                transform: "rotate(90deg)",
              }}
            >
              {">"}
            </button>
            {columnInfo[columnIndex].map((val, idx) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  alignItems: "center",
                }}
                key={idx}
              >
                <input
                  type="number"
                  value={val !== null ? val : ""}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value);
                    const newColumnInfo = [...columnInfo];
                    newColumnInfo[columnIndex][idx] = newVal;
                    setColumnInfo(newColumnInfo);
                  }}
                  style={{ width: "16px", height: "18px", fontSize: "12px" }}
                />
                <button
                  onClick={() => {
                    const newColumnInfo = columnInfo[columnIndex].filter(
                      (_, i) => i !== idx
                    );
                    const updatedColumnInfo = [...columnInfo];
                    updatedColumnInfo[columnIndex] = newColumnInfo;
                    setColumnInfo(updatedColumnInfo);
                  }}
                  style={{
                    height: "24px",
                    width: "24px",
                    marginBottom: "8px",
                  }}
                >
                  -
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setColumnInfo((prevState) => {
                  const newColumnInfo = [...prevState];
                  newColumnInfo[columnIndex] = [
                    ...(newColumnInfo[columnIndex] || []),
                    null,
                  ];
                  return newColumnInfo;
                })
              }
              style={{
                height: "24px",
                width: "24px",
                marginBottom: "8px",
              }}
            >
              +
            </button>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {gridMap.map((_, rowIndex) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                marginBottom: (rowIndex + 1) % 5 === 0 ? "4px" : "0px",
                height: "26px",
                alignItems: "center",
              }}
              key={rowIndex}
            >
              <button
                onClick={() => {
                  setSelectedIndex(rowIndex);
                  setSelectedDirection("row");
                }}
                style={{
                  height: "24px",
                  width: "24px",
                  marginRight: "8px",
                }}
              >
                {">"}
              </button>
              {rowInfo[rowIndex].map((val, idx) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    alignItems: "center",
                  }}
                  key={idx}
                >
                  <input
                    type="number"
                    value={val !== null ? val : ""}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      const newRowInfo = [...rowInfo];
                      newRowInfo[rowIndex][idx] = newVal;
                      setRowInfo(newRowInfo);
                    }}
                    style={{ width: "16px", height: "18px", fontSize: "12px" }}
                  />
                  <button
                    onClick={() => {
                      const newRowInfo = rowInfo[rowIndex].filter(
                        (_, i) => i !== idx
                      );
                      const updatedRowInfo = [...rowInfo];
                      updatedRowInfo[rowIndex] = newRowInfo;
                      setRowInfo(updatedRowInfo);
                    }}
                    style={{
                      height: "24px",
                      width: "24px",
                      marginRight: "8px",
                    }}
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setRowInfo((prevState) => {
                    const newRowInfo = [...prevState];
                    newRowInfo[rowIndex] = [
                      ...(newRowInfo[rowIndex] || []),
                      null,
                    ];
                    return newRowInfo;
                  })
                }
                style={{
                  height: "24px",
                  width: "24px",
                  marginRight: "8px",
                }}
              >
                +
              </button>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {gridMap.map((row, rowIndex) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: (rowIndex + 1) % 5 === 0 ? "4px" : "0px",
                height: "26px",
              }}
              key={rowIndex}
            >
              {row.map((val, idx) => (
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: val === true ? "black" : "white",
                    border:
                      (selectedDirection === "row" &&
                        rowIndex === selectedIndex) ||
                      (selectedDirection === "column" && idx === selectedIndex)
                        ? "1px solid blue"
                        : "1px solid grey",
                    marginRight: (idx + 1) % 5 === 0 ? "4px" : "0px",
                    color: "grey",
                    cursor: "pointer",
                  }}
                  key={`idx-${idx}-rowIndex-${rowIndex}`}
                  onClick={() =>
                    setGridMap((prevGrid) => {
                      const newGrid = prevGrid.map((r) => [...r]);
                      newGrid[rowIndex][idx] = selectedBlockState;
                      return newGrid;
                    })
                  }
                >
                  {val === false && "X"}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "black",
            color: "grey",
            border:
              selectedBlockState === true ? "1px solid blue" : "1px solid grey",
            cursor: "pointer",
          }}
          onClick={() => setSelectedBlockState(true)}
        ></div>
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "white",
            color: "grey",
            border:
              selectedBlockState === null ? "1px solid blue" : "1px solid grey",
            cursor: "pointer",
          }}
          onClick={() => setSelectedBlockState(null)}
        ></div>
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "white",
            color: "grey",
            border:
              selectedBlockState === false
                ? "1px solid blue"
                : "1px solid grey",
            cursor: "pointer",
          }}
          onClick={() => setSelectedBlockState(false)}
        >
          X
        </div>
      </div>
      <button
        onClick={() => {
          setIsSolving(!isSolving);
        }}
      >
        {isSolving ? "Stop" : "Solve All"}
      </button>
      <button
        onClick={() => {
          solve();
        }}
      >
        {"Solve"}
      </button>
    </div>
  );
}

export default App;
