sessionStorage.clear();

const mainContainer = document.querySelector("#container");
let floor_input=document.querySelector(".floor-input");
let lifts_input=document.querySelector(".lifts-input");
let input=document.querySelector(".input")

let start_btn=document.getElementById("start-btn");

let buttonQueue=[]

function getUserInput(e) {
  let floors=parseInt(floor_input.value)
  let lifts=parseInt(lifts_input.value)
  // console.log(floors,lifts);
  if (floors<2 || lifts<1 || isNaN(floors) || isNaN(lifts)){
    alert("Floors minimum value should be 2 and lifts minimum value should be 1");
    return false;
  }

  sessionStorage.setItem("floors",floors)
  sessionStorage.setItem("lifts",lifts)
  return true;

}


start_btn.addEventListener('click',()=>{
  if(!getUserInput()){
    return;
  }
  let floors = sessionStorage.getItem("floors");
  let lifts = sessionStorage.getItem("lifts");
  input.classList.add("hidden");

  const insertFloors = () => {
    for (let i = floors; i > 0; i--) {
      let floorRow=document.createElement("div");
      floorRow.setAttribute('class',`floor floor-${i}`)
      var htmlString = 
      `
        <div class="floor__name">Floor ${i}</div>
        <div class="floor__buttons floor__buttons-${i}">
            <button class=" btn button__up button__up-${i} ">Up</button>
            <button class="btn button__down button__down-${i} ">Down</button>
        </div>    
        
      `;
      
      floorRow.innerHTML = htmlString;
      mainContainer.appendChild(floorRow);
      // console.log(i);
    }
  };
  
  insertFloors();

  const floorsContainer = document.querySelectorAll(".floor__buttons");

  const removeButtons = () => {
    const firstFloor = floorsContainer[floors - 1];
    const lastFloor = floorsContainer[0];
    firstFloor.lastElementChild.remove();
    lastFloor.firstElementChild.remove();
  };

  removeButtons();

  // creating lifts

  const createLifts=()=>{
    const liftRow=document.createElement("div");
    liftRow.setAttribute("class","lift__row");
    let firstFloor=document.querySelector(".floor-1");
    // console.log(firstFloor);
    for (let i = 1; i <= lifts; i++) {
      const lift = `
      <div class="lift lift-${i} not-moving " data-current-floor=1 >
      <div class="left-door " data-left-door=${i}></div>
      <div class="right-door" data-right-door=${i}></div>
      </div> `;

      liftRow.innerHTML += lift;
      //   Entering Lift in first floor only
      firstFloor.append(liftRow);
    }
  }

  createLifts();

  const liftButtons=document.querySelectorAll(".btn");


  liftButtons.forEach((curFloorButton)=>{
    curFloorButton.addEventListener("click",(e)=>{
      const curLiftButton=e.target;
      
      // console.log("Button Pressed")
      curFloorButton.disabled=true;
      buttonQueue.push(curFloorButton);
      // console.log(buttonQueue);
      const getNearestLift=(button)=>{
        const getAllNonMovingLifts=document.querySelectorAll(".not-moving");
        const floorNumber=Number(button.classList[2].split("-")[1])
        //console.log(getAllNonMovingLifts); 1 2 3 4 5
        let minDistance=floors;
        let minIndex=-1;
        for(let i=0;i<getAllNonMovingLifts.length;i++){
          let curLift=getAllNonMovingLifts[i];
          let liftFloor=Number(curLift.dataset.currentFloor);
          let distance=Math.abs(floorNumber-liftFloor);
          //console.log("distance: "+distance+" "+floorNumber+" "+liftFloor);
          // 2 2 1

          if (distance<minDistance){
            minDistance=distance;
            minIndex=i;
          }
        }
        
        if(minIndex==-1){
          console.log("no lifts Available",getAllNonMovingLifts)
          return ;
        }
        else{
          // console.log("Distance lift will be traveling"+minDistance);
          buttonQueue.shift();
          // console.log(buttonQueue);
          let curLift=getAllNonMovingLifts[minIndex];
          // console.log(curLift);
          curLift.classList.remove("not-moving");

          curLift.style.transform=
          floorNumber!=1?`translateY(-${15.2*(floorNumber-1)}rem)`
          :`translateY(0px)`;

          let liftFloor=Number(curLift.dataset.currentFloor);
          let timeToReachOnFloor=Math.abs(liftFloor-floorNumber)*2;

          curLift.style.transition=`all linear ${timeToReachOnFloor}s`;

          // console.log(minIndex,floorNumber,timeToReachOnFloor);

          
          setTimeout(()=>{
            console.log("Doors Opening")
            console.log("Left Door ", curLift.children[0])
            console.log("Right Door ",curLift.children[1])
            // console.log("Animation running for lift at floor: "+floorNumber);
            // console.log(curLift.children[0].classList);
            // console.log(curLift.children[1].classList);
            curLift.children[0].classList.add("left-door--animation");
            curLift.children[1].classList.add("right-door--animation");
          },(timeToReachOnFloor+0.2)*1000);

          setTimeout(()=>{
            console.log("Doors Closing")
            // console.log("Animation removing for lift at floor: "+floorNumber);
            // console.log(curLift.children[0].classList);
            // console.log(curLift.children[1].classList);
            curLift.children[0].classList.remove("left-door--animation");
            curLift.children[1].classList.remove("right-door--animation");
          },(timeToReachOnFloor+5)*1000);

          setTimeout(()=>{
            button.disabled=false;
            curLift.classList.add("not-moving");
            
            checkQueueIsEmpty(buttonQueue);
          },(timeToReachOnFloor+5)*1000);

          
          curLift.dataset.currentFloor=floorNumber;
          

          

        }
      }

      const checkQueueIsEmpty=(buttonQueue)=>{
        
        if (buttonQueue.length!=0){
          getNearestLift(buttonQueue[0]);
        }

      }

      checkQueueIsEmpty(buttonQueue);

      

      
      

    })
  })


});







