<template>
  <div class="flex flex-col m-auto items-center mt-4">
    <div class="w-1/3 flex justify-between items-center px-2 py-1 font-bold">
      <span class="text-white">
        🚩 {{ amountOfCellsMarked }}/{{ amountOfBombs }}
      </span>
      <h1 class="text-lg text-white">{{ gameStateText }}</h1>
      <Time class="text-white" :isRunning="isRunning" :gameOver="gameOver" />
    </div>

    <div
      class="flex space-x-1 bg-gray-300 rounded-sm"
      :class="{ 'bg-red-300': gameOver, 'bg-green-100': gameWon }"
      v-for="row in minefield"
      :key="row.x"
    >
      <Cell
        class="bg-gray-400 border border-gray-500 rounded-md"
        :class="{ 'mt-1': cell.x != 0 }"
        v-for="cell in row"
        :key="cell.y"
        :cellData="cell"
        @onCellLeftClicked="onCellClicked"
        @onCellRightClicked="onCellFlagged"
      ></Cell>
    </div>
    <div class="flex space-x-2 mt-4">
      <!-- <button
        class="
          bg-green-700
          text-white text-sm
          font-bold
          rounded-md
          hover:bg-green-600
          py-4
          px-6
          focus:outline-none
        "
        @click="revealCells"
      >
        Cheat
      </button> -->
      <button
        class="
          bg-green-700
          text-white text-sm
          font-bold
          rounded-md
          hover:bg-green-600
          py-4
          px-6
          focus:outline-none
          new-game-button
        "
        @click="startNewGame"
      >
        New Game
      </button>
    </div>
  </div>
</template>

<script>
  import Cell from './Cell.vue'
  import Time from './Time.vue'
  export default {
    props: {
      bombIcon: {
        type: String,
        default: '💣',
      },
      flagIcon: {
        type: String,
        default: '❗',
      },
      startText: {
        type: String,
        default: 'Good luck! 🍀',
      },
      emptyCellText: {
        type: String,
        default: 'Nice! 😁',
      },
      highProxCellText: {
        type: String,
        default: 'Close one! 🥷',
      },
      winText: {
        type: String,
        default: '🎈🎉You won! 🎉🎈',
      },
      loseText: {
        type: String,
        default: '💥 Game over! 💥',
      },
    },
    components: {
      Cell,
      Time,
    },
    data() {
      return {
        size: 12,
        minefield: [
          [
            {
              x: 0,
              y: 0,
              isBomb: false,
              isRevealed: false,
              isMarked: false,
              proximityCount: 0,
            },
          ],
        ],
        firstClickHappened: false,
        bombList: [],
        cellsFlagged: 0,
        amountOfCellsMarked: null,
        amountOfBombs: 0,
        gameOver: false,
        gameStateText: '',
        isRunning: false,
        gameWon: false,
      }
    },

    mounted() {
      this.startNewGame()
    },

    methods: {
      startNewGame() {
        ;(this.gameOver = false),
          (this.firstClickHappened = false),
          (this.minefield = []),
          (this.bombList = []),
          (this.amountOfCellsMarked = 0),
          (this.amountOfBombs = 0),
          // Change the game state text to wish the player good luck
          (this.gameStateText = this.startText)
        ;(this.gameWon = false), (this.isRunning = false)

        const amountOfCells = this.size * this.size
        this.amountOfBombs = Math.round(amountOfCells * 0.15)

        for (let x = 0; x < this.size; x++) {
          this.minefield[x] = []
          for (let y = 0; y < this.size; y++) {
            this.minefield[x][y] = {
              x: x,
              y: y,
              isBomb: false,
              isRevealed: false,
              isMarked: false,
              proximityCount: 0,
            }
          }
        }
      },
      placeMines(excludeCoord) {
        console.log(
          'Creating field (' + this.size + ' x ' + this.size + ') ...'
        )

        //list of all coords
        let coords = []

        for (let x = 0; x < this.size; x++) {
          for (let y = 0; y < this.size; y++) {
            if (excludeCoord.x != x || excludeCoord.y != y) {
              // Save the coords in a linear array
              coords.push({ x: x, y: y })
            }
          }
        }

        //Shuffe to pick random unique bomb locations
        shuffle(coords)
        // Place the set amount of bombs in random unique locations
        let amountOfBombLeftToPlace = this.amountOfBombs
        // Keep track of the placed bombs
        while (amountOfBombLeftToPlace > 0 && coords.length > 0) {
          // Get a unique random coord
          const selectedCoord = coords.pop()
          // Get the tile data
          let bombCell = this.minefield[selectedCoord.x][selectedCoord.y]
          // Set it to a bomb
          bombCell.isBomb = true
          // Keep track of it
          this.bombList.push(bombCell)
          // One bomb less to place
          amountOfBombLeftToPlace--
        }
        // Calculate the proximity for all tiles around a bomb
        for (let b = 0; b < this.bombList.length; b++) {
          const bombCell = this.bombList[b]
          this.doForAdjecentCells(bombCell, function (adjecentCell) {
            // Increase its proximity count by 1
            adjecentCell.proximityCount++
          })
        }
      },
      onCellClicked(coord) {
        if (!this.firstClickHappened) {
          this.isRunning = true
          this.firstClickHappened = true
          this.placeMines(coord)
        }
        let cell = this.minefield[coord.x][coord.y]
        const test = 'tes'
        if (!this.gameOver && cell !== undefined) {
          // if(cell.isMarked){
          //     this.isCellMarked(cell)
          // }
          cell.isRevealed = true

          // If it is a bomb
          if (cell.isBomb) {
            // Game over
            this.setGameOver()
            return
          }

          // If it is an empty cell, clear all adjecent cells
          if (cell.proximityCount == 0) {
            this.gameStateText = this.emptyCellText
            const vm = this
            const closure = function (adjecentCell) {
              if (!adjecentCell.isRevealed) {
                // If marked, remove the mark
                if (adjecentCell.isMarked) {
                  adjecentCell.isMarked = false
                  vm.amountOfCellsMarked--
                }
                // Reveal the tile
                adjecentCell.isRevealed = true
                // Repeat for that cell if it is also a blank
                if (adjecentCell.proximityCount == 0) {
                  vm.doForAdjecentCells(adjecentCell, closure)
                }
              }
            }
            vm.doForAdjecentCells(cell, closure)
          }
          // Compliment on close call
          if (cell.proximityCount > 2) {
            this.gameStateText = this.highProxCellText
          }
        }
      },
      onCellFlagged(coord) {
        this.cellsFlagged++
        let cell = this.minefield[coord.x][coord.y]
        if (!this.gameOver && cell !== undefined) {
          if (cell.isRevealed) {
            return
          }
          if (this.amountOfCellsMarked >= this.amountOfBombs) {
            this.gameStateText = 'To many flags!'
            if (!cell.isMarked) {
              return
            }
          }
          cell.isMarked = !cell.isMarked
          //if marked +1 else -1
          this.amountOfCellsMarked += cell.isMarked ? 1 : -1

          // Check if all bombs are marked
          let allBombsMarked = true
          for (let b = 0; b < this.bombList.length; b++) {
            if (!this.bombList[b].isMarked) {
              allBombsMarked = false
              break
            }
          }
          // All bombs are marked? No more markings than bombs?
          if (
            this.firstClickHappened &&
            this.bombList.length == this.amountOfCellsMarked &&
            allBombsMarked
          ) {
            // Winner!
            this.setGameWon()
          }
        }
      },
      isCellMarked(cell) {
        cell.isMarked = !cell.isMarked
        //if marked +1 else -1
        this.amountOfCellsMarked += cell.isMarked ? 1 : -1
        this.amountOfCellsMarked + 2
      },

      doForAdjecentCells(middleCell, closure) {
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            // Calculate adjecent cell coords
            const adjecentX = middleCell.x + i
            const adjecentY = middleCell.y + j

            // Check if the cell it within the field's borders
            if (
              adjecentX >= 0 &&
              adjecentX < this.size &&
              adjecentY >= 0 &&
              adjecentY < this.size
            ) {
              // Pass adjecentCell
              closure(this.minefield[adjecentX][adjecentY])
            }
          }
        }
      },

      revealCells() {
        for (let x = 0; x < this.size; x++) {
          for (let y = 0; y < this.size; y++) {
            let cell = this.minefield[x][y]
            cell.isRevealed = cell.isBomb ? false : true
          }
        }
      },

      resetCells() {
        ;(this.firstClickHappened = false),
          (this.bombList = []),
          (this.amountOfCellsMarked = 0),
          (this.amountOfBombs = 0),
          (this.gameOver = false),
          (this.gameStateText = ''),
          // Change the game state text to wish the player good luck
          (this.gameStateText = this.startText)
        this.startNewGame()
      },
      // Lose the game when a bomb is clicked
      setGameOver() {
        this.isRunning = false
        this.gameOver = true
        // Reveal all bombs
        for (let b = 0; b < this.bombList.length; b++) {
          this.bombList[b].isRevealed = true
        }

        this.gameStateText = this.loseText
      },
      setGameWon() {
        this.isRunning = false
        this.gameWon = true
        this.gameOver = true
        // Reveal all cells
        this.revealCells()
        this.gameStateText = this.winText
      },
    },
  }
  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }
</script>
