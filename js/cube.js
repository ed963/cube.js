"use strict";

(function(global, document) {
    // [white, yellow, blue, green, red, orange]
    const COLOURS = ["#FFFFFF", "#FFD500", "#0045AD", "#009B48", "#B90000", "#FF5900"]

    /** ===== Private helper functions ===== */
    function rotateFaceCW(face) {
        const temp = face[0].slice()
    
        face[0][0] = face[2][0]
        face[0][1] = face[1][0]
    
        face[1][0] = face[2][1]
        face[2][0] = face[2][2]
        face[2][1] = face[1][2]
    
        face[0][2] = temp[0]
        face[1][2] = temp[1]
        face[2][2] = temp[2]
    }
    
    function rotateFaceCCW(face) {
        const temp = face[0].slice()
    
        face[0][1] = face[1][2]
        face[0][2] = face[2][2]
    
        face[1][2] = face[2][1]
        face[2][2] = face[2][0]
        face[2][1] = face[1][0]
    
        face[2][0] = temp[0]
        face[1][0] = temp[1]
        face[0][0] = temp[2]
    }
    
    function strFunctionToFunctionName(strFunction) {
        if (strFunction.length === 1) {
            return strFunction
        }
        else {
            return strFunction[0] + "Prime"
        }
    }
    
    function strFunctionToInverseFunctionName(strFunction) {
        if (strFunction.length === 1) {
            return strFunction + "Prime"
        }
        else {
            return strFunction[0]
        }
    }
    
    function normalizeAngle(angle) {
        return angle - 360 * Math.floor(angle / 360)
    }
    
    function handleDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const x = e.clientX;
        const y = e.clientY;
        
        const moveHandler = move.bind(this)
    
        this.cubeContainer.addEventListener('mousemove', moveHandler);
        this.cubeContainer.addEventListener('mouseup', up.bind(this));
        this.cubeContainer.addEventListener('mouseleave', up.bind(this));
        
        function move(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const x1 = e.clientX;
            const y1 = e.clientY;
            
            this.yAngle += (x1 - x) * 0.04
            
            const angleChange = (y1 - y) * 0.04
            if (45 <= normalizeAngle(this.yAngle) && normalizeAngle(this.yAngle) < 135) {
                this.zAngle -= angleChange
            }
            else if (135 <= normalizeAngle(this.yAngle) && normalizeAngle(this.yAngle)< 225) {
                this.xAngle += angleChange
            }
            else if (225 <= normalizeAngle(this.yAngle) && normalizeAngle(this.yAngle)< 315) {
                this.zAngle += angleChange
            }
            else {
                this.xAngle -= angleChange
            }
            
            this.cube.style.transform = `translateZ(-77px) rotateY(${this.yAngle}deg) rotateZ(${this.zAngle}deg) rotateX(${this.xAngle}deg)`;
        }
    
        function up() {
            this.cubeContainer.removeEventListener('mousemove', moveHandler);
        }
    }

    // Functions for initializing DOM elements
    function initCubeContainer() {
        const cubeContainer = document.createElement('div')
        this.mainContainer.appendChild(cubeContainer)
        cubeContainer.className = "cubeContainer"

        const cube = document.createElement('div')
        cubeContainer.appendChild(cube)
        cube.className = "cube"

        const faces = ["front", "back", "left", "right", "top", "bottom"]
        faces.forEach(face => {
            const faceElement = document.createElement('div')
            cube.appendChild(faceElement)
            faceElement.className = "face " + face

            for (let i=0; i < 3; i++) {
                for (let j=0; j < 3; j++) {
                    const square = document.createElement('div')
                    faceElement.appendChild(square)
                    square.className = "bigSquare big" + i + j
                    this.squareElements[face][i][j] = square

                    if (i === 1 && j === 1) {
                        square.appendChild(document.createTextNode(face))
                    }
                }
            }
        })

        this.cube = cube
        this.cubeContainer = cubeContainer
        this.cubeContainer.addEventListener('mousedown', handleDrag.bind(this))
    }

    function initInteractiveInterface() {
        const interactiveInterface = document.createElement('div')
        interactiveInterface.id = "interactiveInterface"
        this.mainContainer.appendChild(interactiveInterface)

        const rowOne = document.createElement('div')
        rowOne.className = "buttonRow"
        interactiveInterface.appendChild(rowOne)

        const rowOneLabels = ["R", "L", "U", "D", "F", "B"]
        rowOneLabels.forEach(label => {
            const button = document.createElement('button')
            button.type = button
            button.className = "moveButton"
            button.addEventListener("click", () => {
                (window.Cube.prototype[strFunctionToFunctionName(label)].bind(this))()
                if (this.onClick) {
                    this.onClick()
                }
            })
            button.appendChild(document.createTextNode(label))
            rowOne.appendChild(button)
        })

        const rowTwo = document.createElement('div')
        rowTwo.className = "buttonRow"
        interactiveInterface.appendChild(rowTwo)

        const rowTwoLabels = ["R'", "L'", "U'", "D'", "F'", "B'"]
        rowTwoLabels.forEach(label => {
            const button = document.createElement('button')
            button.type = button
            button.className = "moveButton"
            button.addEventListener("click", () => {
                (window.Cube.prototype[strFunctionToFunctionName(label)].bind(this))() 
                if (this.onClick) {
                    this.onClick()
                }
            })
            button.appendChild(document.createTextNode(label))
            rowTwo.appendChild(button)
        })

        const rowThree = document.createElement('div')
        rowThree.className = "buttonRow"
        interactiveInterface.appendChild(rowThree)

        const rowThreeLabels = ["X", "X'", "Y", "Y'", "Z", "Z'"]
        rowThreeLabels.forEach(label => {
            const button = document.createElement('button')
            button.type = button
            button.className = "moveButton"
            button.addEventListener("click", () => {
                (window.Cube.prototype[strFunctionToFunctionName(label)].bind(this))()
                if (this.onClick) {
                    this.onClick()
                }
            })
            button.appendChild(document.createTextNode(label))
            rowThree.appendChild(button)
        })
    }

    function initPresetInterface() {
        const presetInterface = document.createElement('div')
        presetInterface.id = "presetInterface"
        this.mainContainer.appendChild(presetInterface)

        this.sequence.forEach(move => {
            const presetMoveLabel = document.createElement('div')
            presetMoveLabel.className = "presetMoveLabel"
            presetMoveLabel.appendChild(document.createTextNode(move))
            presetInterface.appendChild(presetMoveLabel)

            this.sequenceLabels.push(presetMoveLabel)
        })

        const backButton = document.createElement('button')
        backButton.type = "button"
        backButton.id = "backButton"
        backButton.addEventListener("click", () => {
            if (this.current !== 0) {
                (window.Cube.prototype[strFunctionToInverseFunctionName(this.sequence[this.current - 1])].bind(this))()
                this.current--
                if (this.onClick) {
                    this.onClick()
                }
                (updatePresetInterfaceRender.bind(this))()
            }
        })
        backButton.appendChild(document.createTextNode("<"))
        presetInterface.appendChild(backButton)

        const forwardButton = document.createElement('button')
        forwardButton.type = "button"
        forwardButton.id = "forwardButton"
        forwardButton.addEventListener("click", () => {
            if (this.current !== this.sequence.length) {
                (window.Cube.prototype[strFunctionToFunctionName(this.sequence[this.current])].bind(this))()
                this.current++
                if (this.onClick) {
                    this.onClick()
                }
                (updatePresetInterfaceRender.bind(this))()
            }
        })
        forwardButton.appendChild(document.createTextNode(">"))
        presetInterface.appendChild(forwardButton);
        (updatePresetInterfaceRender.bind(this))()
    }

    function updatePresetInterfaceRender() {
        for (let i = 0; i < this.sequenceLabels.length; i++) {
            if (i === this.current) {
                this.sequenceLabels[i].className = "presetMoveLabel current"
            }
            else {
                this.sequenceLabels[i].className = "presetMoveLabel"
            }
        }

        if (this.current === 0) {
            document.querySelector("#" + this.mainContainer.id + " #backButton").disabled = true
        }
        else {
            document.querySelector("#" + this.mainContainer.id + " #backButton").disabled = false
        }
        
        if (this.current === this.sequenceLabels.length) {
            document.querySelector("#" + this.mainContainer.id + " #forwardButton").disabled = true
        }
        else {
            document.querySelector("#" + this.mainContainer.id + " #forwardButton").disabled = false
        }
    }

    // Function for updating DOM elements based on this.faces data structure
    function updateRender() {
        const faces = ["front", "back", "left", "right", "top", "bottom"]
        faces.forEach(face => {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    this.squareElements[face][i][j].style.backgroundColor = COLOURS[this.faces[face][i][j]]
                }
            }
        })
    }

    /* Constructor to create a new Cube object in the div element with id frameID.
    *
    * This function can also take an object to specify additional options.
    * 
    * Options:
    *  - mode: 
    *      Defines the appearence of the user interface section. One of 'interactive' 
    *      or 'preset'. Defaults to 'interactive' if unspecified.
    *  - start:
    *      The default starting orientation of the cube is blue in front and yellow
    *      on top. A different starting orientation can be specified by setting start
    *      to be an array of moves. These moves will be applied
    *      to the default starting orientation to obtain a new starting orientation.
    *  - sequence:
    *      If the mode is 'preset', this option can be used to define the pre-set sequence of 
    *      moves that the user can cycle through.
    *  - hideInterface:
    *      By default, a user interface is shown that allows users to interact with the cube.
    *      This interface can be hidden by setting hideInterface to true.
    *  - onClick:
    *      A callback function to be invoked whenever the user clicks a button in the user interface.
    *      
    */
    function Cube(frameID, options) {
        if (!options) {
            options = {}
        }

        this.onClick = options.onClick

        // Stores the current colours on each face as a 3x3 2-dimensional 
        // array of indices into the COLOURS array
        this.faces = {
            front: [[2, 2, 2], [2, 2, 2], [2, 2, 2]],
            back: [[3, 3, 3], [3, 3, 3], [3, 3, 3]],
            left: [[5, 5, 5,], [5, 5, 5], [5, 5, 5]],
            right: [[4, 4, 4], [4, 4, 4], [4, 4, 4]],
            top: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
            bottom: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        }

        // Stores the preset sequence of moves, and current move
        // (for pre-set mode)
        if (options.mode === "preset") {
            this.sequence = options.sequence || []
            this.current = 0
            this.sequenceLabels = []
        }

        // The stored DOM elements associated with this Cube
        this.mainContainer = document.querySelector('#' + frameID)
        this.mainContainer.className = this.mainContainer.className + " mainContainer"
        this.squareElements = {
            front: [[null, null, null], [null, null, null], [null, null, null]],
            back: [[null, null, null], [null, null, null], [null, null, null]],
            left: [[null, null, null,], [null, null, null], [null, null, null]],
            right: [[null, null, null], [null, null, null], [null, null, null]],
            top: [[null, null, null], [null, null, null], [null, null, null]],
            bottom: [[null, null, null], [null, null, null], [null, null, null]]
        }
        this.cubeContainer = null
        this.cube = null

        // Stores values used to rotate the cube
        this.xAngle = 0
        this.yAngle = 0
        this.zAngle = 0;

        // Initialize DOM elements
        (initCubeContainer.bind(this))()

        if (!options.hideInterface) {
            if (options.mode === "preset") {
                (initPresetInterface.bind(this))()
            }
            else {
                (initInteractiveInterface.bind(this))()
            }
        }
        
        if (options.start) {
            // Set cube to specified starting state
            options.start.forEach(move => {
                (window.Cube.prototype[strFunctionToFunctionName(move)].bind(this))()
            })
        }

        (updateRender.bind(this))()

        this.xAngle = -30;
        this.yAngle = 37;
        this.zAngle = -25;
        this.cube.style.transform = `translateZ(-77px) rotateY(${this.yAngle}deg) rotateZ(${this.zAngle}deg) rotateX(${this.xAngle}deg)`;
    }

    Cube.prototype = {

        // Functions for manipulating this.faces data structure based on a given move
        R: function() {
            const temp = [this.faces.top[0][2], this.faces.top[1][2], this.faces.top[2][2]]
            
            this.faces.top[0][2] = this.faces.front[0][2]
            this.faces.top[1][2] = this.faces.front[1][2]
            this.faces.top[2][2] = this.faces.front[2][2]

            this.faces.front[0][2] = this.faces.bottom[0][2]
            this.faces.front[1][2] = this.faces.bottom[1][2]
            this.faces.front[2][2] = this.faces.bottom[2][2]

            this.faces.bottom[0][2] = this.faces.back[2][0]
            this.faces.bottom[1][2] = this.faces.back[1][0]
            this.faces.bottom[2][2] = this.faces.back[0][0]

            this.faces.back[2][0] = temp[0]
            this.faces.back[1][0] = temp[1]
            this.faces.back[0][0] = temp[2]

            rotateFaceCW(this.faces.right);
            (updateRender.bind(this))()
        },

        RPrime: function() {
            const temp = [this.faces.top[0][2], this.faces.top[1][2], this.faces.top[2][2]]
            
            this.faces.top[0][2] = this.faces.back[2][0]
            this.faces.top[1][2] = this.faces.back[1][0]
            this.faces.top[2][2] = this.faces.back[0][0]

            this.faces.back[0][0] = this.faces.bottom[2][2]
            this.faces.back[1][0] = this.faces.bottom[1][2]
            this.faces.back[2][0] = this.faces.bottom[0][2]

            this.faces.bottom[0][2] = this.faces.front[0][2]
            this.faces.bottom[1][2] = this.faces.front[1][2]
            this.faces.bottom[2][2] = this.faces.front[2][2]

            this.faces.front[0][2] = temp[0]
            this.faces.front[1][2] = temp[1]
            this.faces.front[2][2] = temp[2]

            rotateFaceCCW(this.faces.right);
            (updateRender.bind(this))()
        },

        L: function() {
            const temp = [this.faces.top[0][0], this.faces.top[1][0], this.faces.top[2][0]]
            
            this.faces.top[0][0] = this.faces.back[2][2]
            this.faces.top[1][0] = this.faces.back[1][2]
            this.faces.top[2][0] = this.faces.back[0][2]

            this.faces.back[0][2] = this.faces.bottom[2][0]
            this.faces.back[1][2] = this.faces.bottom[1][0]
            this.faces.back[2][2] = this.faces.bottom[0][0]

            this.faces.bottom[0][0] = this.faces.front[0][0]
            this.faces.bottom[1][0] = this.faces.front[1][0]
            this.faces.bottom[2][0] = this.faces.front[2][0]

            this.faces.front[0][0] = temp[0]
            this.faces.front[1][0] = temp[1]
            this.faces.front[2][0] = temp[2]

            rotateFaceCW(this.faces.left);
            (updateRender.bind(this))()
        },

        LPrime: function() {
            const temp = [this.faces.top[0][0], this.faces.top[1][0], this.faces.top[2][0]]
            
            this.faces.top[0][0] = this.faces.front[0][0]
            this.faces.top[1][0] = this.faces.front[1][0]
            this.faces.top[2][0] = this.faces.front[2][0]

            this.faces.front[0][0] = this.faces.bottom[0][0]
            this.faces.front[1][0] = this.faces.bottom[1][0]
            this.faces.front[2][0] = this.faces.bottom[2][0]

            this.faces.bottom[0][0] = this.faces.back[2][2]
            this.faces.bottom[1][0] = this.faces.back[1][2]
            this.faces.bottom[2][0] = this.faces.back[0][2]

            this.faces.back[0][2] = temp[2]
            this.faces.back[1][2] = temp[1]
            this.faces.back[2][2] = temp[0]

            rotateFaceCCW(this.faces.left);
            (updateRender.bind(this))()
        },

        U: function() {
            const temp = this.faces.front[0].slice()

            this.faces.front[0] = this.faces.right[0]
            this.faces.right[0] = this.faces.back[0]
            this.faces.back[0] = this.faces.left[0]
            this.faces.left[0] = temp

            rotateFaceCW(this.faces.top);
            (updateRender.bind(this))()
        },

        UPrime: function() {
            const temp = this.faces.front[0].slice()

            this.faces.front[0] = this.faces.left[0]
            this.faces.left[0] = this.faces.back[0]
            this.faces.back[0] = this.faces.right[0]
            this.faces.right[0] = temp

            rotateFaceCCW(this.faces.top);
            (updateRender.bind(this))()
        },

        D: function() {
            const temp = this.faces.front[2].slice()

            this.faces.front[2] = this.faces.left[2]
            this.faces.left[2] = this.faces.back[2]
            this.faces.back[2] = this.faces.right[2]
            this.faces.right[2] = temp

            rotateFaceCW(this.faces.bottom);
            (updateRender.bind(this))()
        },

        DPrime: function() {
            const temp = this.faces.front[2].slice()

            this.faces.front[2] = this.faces.right[2]
            this.faces.right[2] = this.faces.back[2]
            this.faces.back[2] = this.faces.left[2]
            this.faces.left[2] = temp

            rotateFaceCCW(this.faces.bottom);
            (updateRender.bind(this))()
        },

        F: function() {
            const temp = this.faces.top[2].slice()

            this.faces.top[2][0] = this.faces.left[2][2]
            this.faces.top[2][1] = this.faces.left[1][2]
            this.faces.top[2][2] = this.faces.left[0][2]

            this.faces.left[0][2] = this.faces.bottom[0][0]
            this.faces.left[1][2] = this.faces.bottom[0][1]
            this.faces.left[2][2] = this.faces.bottom[0][2]
            
            this.faces.bottom[0][0] = this.faces.right[2][0]
            this.faces.bottom[0][1] = this.faces.right[1][0]
            this.faces.bottom[0][2] = this.faces.right[0][0]

            this.faces.right[0][0] = temp[0]
            this.faces.right[1][0] = temp[1]
            this.faces.right[2][0] = temp[2]

            rotateFaceCW(this.faces.front);
            (updateRender.bind(this))()
        },

        FPrime: function() {
            const temp = this.faces.top[2].slice()

            this.faces.top[2][0] = this.faces.right[0][0]
            this.faces.top[2][1] = this.faces.right[1][0]
            this.faces.top[2][2] = this.faces.right[2][0]

            this.faces.right[0][0] = this.faces.bottom[0][2]
            this.faces.right[1][0] = this.faces.bottom[0][1]
            this.faces.right[2][0] = this.faces.bottom[0][0]
            
            this.faces.bottom[0][0] = this.faces.left[0][2]
            this.faces.bottom[0][1] = this.faces.left[1][2]
            this.faces.bottom[0][2] = this.faces.left[2][2]

            this.faces.left[0][2] = temp[2]
            this.faces.left[1][2] = temp[1]
            this.faces.left[2][2] = temp[0]

            rotateFaceCCW(this.faces.front);
            (updateRender.bind(this))()
        },

        B: function() {
            const temp = this.faces.top[0].slice()

            this.faces.top[0][0] = this.faces.right[0][2]
            this.faces.top[0][1] = this.faces.right[1][2]
            this.faces.top[0][2] = this.faces.right[2][2]

            this.faces.right[0][2] = this.faces.bottom[2][2]
            this.faces.right[1][2] = this.faces.bottom[2][1]
            this.faces.right[2][2] = this.faces.bottom[2][0]

            this.faces.bottom[2][0] = this.faces.left[0][0]
            this.faces.bottom[2][1] = this.faces.left[1][0]
            this.faces.bottom[2][2] = this.faces.left[2][0]

            this.faces.left[0][0] = temp[2]
            this.faces.left[1][0] = temp[1]
            this.faces.left[2][0] = temp[0]

            rotateFaceCW(this.faces.back);
            (updateRender.bind(this))()
        },

        BPrime: function() {
            const temp = this.faces.top[0].slice()

            this.faces.top[0][0] = this.faces.left[2][0]
            this.faces.top[0][1] = this.faces.left[1][0]
            this.faces.top[0][2] = this.faces.left[0][0]

            this.faces.left[0][0] = this.faces.bottom[2][0]
            this.faces.left[1][0] = this.faces.bottom[2][1]
            this.faces.left[2][0] = this.faces.bottom[2][2]

            this.faces.bottom[2][0] = this.faces.right[2][2]
            this.faces.bottom[2][1] = this.faces.right[1][2]
            this.faces.bottom[2][2] = this.faces.right[0][2]

            this.faces.right[0][2] = temp[0]
            this.faces.right[1][2] = temp[1]
            this.faces.right[2][2] = temp[2]

            rotateFaceCCW(this.faces.back);
            (updateRender.bind(this))()
        },

        X: function() {
            const temp = [this.faces.top[0].slice(), this.faces.top[1].slice(), this.faces.top[2].slice()]

            this.faces.top = [this.faces.front[0].slice(), this.faces.front[1].slice(), this.faces.front[2].slice()]
            this.faces.front = [this.faces.bottom[0].slice(), this.faces.bottom[1].slice(), this.faces.bottom[2].slice()]

            this.faces.bottom[0] = this.faces.back[2].slice().reverse()
            this.faces.bottom[1] = this.faces.back[1].slice().reverse()
            this.faces.bottom[2] = this.faces.back[0].slice().reverse()

            this.faces.back[0] = temp[2].slice().reverse()
            this.faces.back[1] = temp[1].slice().reverse()
            this.faces.back[2] = temp[0].slice().reverse()

            rotateFaceCW(this.faces.right)
            rotateFaceCCW(this.faces.left);
            (updateRender.bind(this))()
        },

        XPrime: function() {
            const temp = [this.faces.top[0].slice(), this.faces.top[1].slice(), this.faces.top[2].slice()]

            this.faces.top[0] = this.faces.back[2].slice().reverse()
            this.faces.top[1] = this.faces.back[1].slice().reverse()
            this.faces.top[2] = this.faces.back[0].slice().reverse()

            this.faces.back[0] = this.faces.bottom[2].slice().reverse()
            this.faces.back[1] = this.faces.bottom[1].slice().reverse()
            this.faces.back[2] = this.faces.bottom[0].slice().reverse()

            this.faces.bottom = [this.faces.front[0].slice(), this.faces.front[1].slice(), this.faces.front[2].slice()]
            this.faces.front = temp

            rotateFaceCCW(this.faces.right)
            rotateFaceCW(this.faces.left);
            (updateRender.bind(this))()
        },

        Y: function() {
            const temp = [this.faces.front[0].slice(), this.faces.front[1].slice(), this.faces.front[2].slice()]

            this.faces.front = [this.faces.right[0].slice(), this.faces.right[1].slice(), this.faces.right[2].slice()]
            this.faces.right = [this.faces.back[0].slice(), this.faces.back[1].slice(), this.faces.back[2].slice()]
            this.faces.back = [this.faces.left[0].slice(), this.faces.left[1].slice(), this.faces.left[2].slice()]
            this.faces.left = temp

            rotateFaceCW(this.faces.top)
            rotateFaceCCW(this.faces.bottom);
            (updateRender.bind(this))()
        },

        YPrime: function() {
            const temp = [this.faces.front[0].slice(), this.faces.front[1].slice(), this.faces.front[2].slice()]

            this.faces.front = [this.faces.left[0].slice(), this.faces.left[1].slice(), this.faces.left[2].slice()]
            this.faces.left = [this.faces.back[0].slice(), this.faces.back[1].slice(), this.faces.back[2].slice()]
            this.faces.back = [this.faces.right[0].slice(), this.faces.right[1].slice(), this.faces.right[2].slice()]
            this.faces.right = temp

            rotateFaceCCW(this.faces.top)
            rotateFaceCW(this.faces.bottom);
            (updateRender.bind(this))()
        },

        Z: function() {
            const temp = [this.faces.top[0].slice(), this.faces.top[1].slice(), this.faces.top[2].slice()]

            this.faces.top[0][0] = this.faces.left[2][0]
            this.faces.top[0][1] = this.faces.left[1][0]
            this.faces.top[0][2] = this.faces.left[0][0]
            this.faces.top[1][0] = this.faces.left[2][1]
            this.faces.top[1][1] = this.faces.left[1][1]
            this.faces.top[1][2] = this.faces.left[0][1]
            this.faces.top[2][0] = this.faces.left[2][2]
            this.faces.top[2][1] = this.faces.left[1][2]
            this.faces.top[2][2] = this.faces.left[0][2]

            this.faces.left[0][0] = this.faces.bottom[2][0]
            this.faces.left[0][1] = this.faces.bottom[1][0]
            this.faces.left[0][2] = this.faces.bottom[0][0]
            this.faces.left[1][0] = this.faces.bottom[2][1]
            this.faces.left[1][1] = this.faces.bottom[1][1]
            this.faces.left[1][2] = this.faces.bottom[0][1]
            this.faces.left[2][0] = this.faces.bottom[2][2]
            this.faces.left[2][1] = this.faces.bottom[1][2]
            this.faces.left[2][2] = this.faces.bottom[0][2]
        
            this.faces.bottom[0][0] = this.faces.right[2][0]
            this.faces.bottom[0][1] = this.faces.right[1][0]
            this.faces.bottom[0][2] = this.faces.right[0][0]
            this.faces.bottom[1][0] = this.faces.right[2][1]
            this.faces.bottom[1][1] = this.faces.right[1][1]
            this.faces.bottom[1][2] = this.faces.right[0][1]
            this.faces.bottom[2][0] = this.faces.right[2][2]
            this.faces.bottom[2][1] = this.faces.right[1][2]
            this.faces.bottom[2][2] = this.faces.right[0][2]

            this.faces.right[0][0] = temp[2][0]
            this.faces.right[0][1] = temp[1][0]
            this.faces.right[0][2] = temp[0][0]
            this.faces.right[1][0] = temp[2][1]
            this.faces.right[1][1] = temp[1][1]
            this.faces.right[1][2] = temp[0][1]
            this.faces.right[2][0] = temp[2][2]
            this.faces.right[2][1] = temp[1][2]
            this.faces.right[2][2] = temp[0][2]

            rotateFaceCW(this.faces.front)
            rotateFaceCCW(this.faces.back);
            (updateRender.bind(this))()
        },

        ZPrime: function() {
            const temp = [this.faces.top[0].slice(), this.faces.top[1].slice(), this.faces.top[2].slice()]

            this.faces.top[0][0] = this.faces.right[0][2]
            this.faces.top[0][1] = this.faces.right[1][2]
            this.faces.top[0][2] = this.faces.right[2][2]
            this.faces.top[1][0] = this.faces.right[0][1]
            this.faces.top[1][1] = this.faces.right[1][1]
            this.faces.top[1][2] = this.faces.right[2][1]
            this.faces.top[2][0] = this.faces.right[0][0]
            this.faces.top[2][1] = this.faces.right[1][0]
            this.faces.top[2][2] = this.faces.right[2][0]

            this.faces.right[0][0] = this.faces.bottom[0][2]
            this.faces.right[0][1] = this.faces.bottom[1][2]
            this.faces.right[0][2] = this.faces.bottom[2][2]
            this.faces.right[1][0] = this.faces.bottom[0][1]
            this.faces.right[1][1] = this.faces.bottom[1][1]
            this.faces.right[1][2] = this.faces.bottom[2][1]
            this.faces.right[2][0] = this.faces.bottom[0][0]
            this.faces.right[2][1] = this.faces.bottom[1][0]
            this.faces.right[2][2] = this.faces.bottom[2][0]
        
            this.faces.bottom[0][0] = this.faces.left[0][2]
            this.faces.bottom[0][1] = this.faces.left[1][2]
            this.faces.bottom[0][2] = this.faces.left[2][2]
            this.faces.bottom[1][0] = this.faces.left[0][1]
            this.faces.bottom[1][1] = this.faces.left[1][1]
            this.faces.bottom[1][2] = this.faces.left[2][1]
            this.faces.bottom[2][0] = this.faces.left[0][0]
            this.faces.bottom[2][1] = this.faces.left[1][0]
            this.faces.bottom[2][2] = this.faces.left[2][0]

            this.faces.left[0][0] = temp[0][2]
            this.faces.left[0][1] = temp[1][2]
            this.faces.left[0][2] = temp[2][2]
            this.faces.left[1][0] = temp[0][1]
            this.faces.left[1][1] = temp[1][1]
            this.faces.left[1][2] = temp[2][1]
            this.faces.left[2][0] = temp[0][0]
            this.faces.left[2][1] = temp[1][0]
            this.faces.left[2][2] = temp[2][0]

            rotateFaceCCW(this.faces.front)
            rotateFaceCW(this.faces.back);
            (updateRender.bind(this))()
        },

        isSolved: function() {
            const faces = ["front", "back", "left", "right", "top", "bottom"]
            let result =  true;
            
            faces.forEach(face => {
                const flattenedArray = this.faces[face].flat()
                if (!flattenedArray.every((val, i, arr) => val === arr[0])) {
                    result = false
                }
            })

            return result;
        },

        scramble: function() {
            const moves = ["R", "L", "U", "D", "F", "B", "R'", "L'", "U'", "D'", "F'", "B'", "X", "X'", "Y", "Y'", "Z", "Z'"]
            for (let i = 0; i < 50; i++) {
                (window.Cube.prototype[strFunctionToFunctionName(moves[Math.floor(Math.random() * moves.length)])].bind(this))()
            }
        },

        next: function() {
            if (this.current !== undefined && this.sequence !== undefined && this.current !== this.sequence.length) {
                (window.Cube.prototype[strFunctionToFunctionName(this.sequence[this.current])].bind(this))()
                this.current++
            }
        },

        previous: function() {
            if (this.current !== undefined && this.current !== 0) {
                (window.Cube.prototype[strFunctionToInverseFunctionName(this.sequence[this.current - 1])].bind(this))()
                this.current--
            }
        }
    }

    global.Cube = global.Cube || Cube
})(window, window.document);