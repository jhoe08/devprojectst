const _calculator = {
    buttons: document.querySelectorAll('button'), 
    init() {
			let denaminator, numerator = []
        this.buttons.forEach(button => {
        button.addEventListener('click', event => {
          console.log(button.innerText)
					// if(typeof button.innerText === integer){
						denaminator.push(button.innerText)
					// } else if (button.innerText in ['+', '-', '*', '/']) {

					// }

					console.log(denaminator)
					
        })
      })
    }
  }
  
  export default {..._calculator}
  
  