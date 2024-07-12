import calculator from './calculator.js'

const main = {
payroll: document.querySelector('.payroll-demo'),
employeeNames: document.getElementById('employeeName'),
  init() {
    let employeeNames = this.getEmployeeData(this.jsonData(), 'employeeName')
    let employeeId = this.getEmployeeData(this.jsonData(), 'employeeId')
    employeeNames.forEach(name => {
      let option = document.createElement('option')
      option.text = name

      this.employeeNames.add(option)
    });

    this.actionsHTML()
  }, 
  calculatorHTML() {
    let html = `<form action="" name="calc" class="calculator">
      <input type="text" class="value" readonly name="txt" />
      <span class="num clear" onclick="calc.txt.value=''"><i>C</i></span>
      <span class="num" onclick="calc.txt.value+='/'"><i>/</i></span>
      <span class="num" onclick="calc.txt.value+='*'"><i>*</i></span>
      <span class="num" onclick="calc.txt.value+='7'"><i>7</i></span>
      <span class="num" onclick="calc.txt.value+='8'"><i>8</i></span>
      <span class="num" onclick="calc.txt.value+='9'"><i>9</i></span>
      <span class="num" onclick="calc.txt.value+='-'"><i>-</i></span>
      <span class="num" onclick="calc.txt.value+='4'"><i>4</i></span>
      <span class="num" onclick="calc.txt.value+='5'"><i>5</i></span>
      <span class="num" onclick="calc.txt.value+='6'"><i>6</i></span>
      <span class="num plus" onclick="calc.txt.value+='+'"><i>+</i></span>
      <span class="num" onclick="calc.txt.value+='1'"><i>1</i></span>
      <span class="num" onclick="calc.txt.value+='2'"><i>2</i></span>
      <span class="num" onclick="calc.txt.value+='3'"><i>3</i></span>
      <span class="num" onclick="calc.txt.value+='0'"><i>0</i></span>
      <span class="num" onclick="calc.txt.value+='00'"><i>00</i></span>
      <span class="num" onclick="calc.txt.value+='.'"><i>.</i></span>

      <span class="num equal" onclick="document.calc.txt.value=eval(calc.txt.value)"><i>=</i></span>
    </form>`
    return html;
  }, 
  jsonData() {
    return {
      "employees": [
        {
          "companyName": "Field Operations",
          "employeeName": "John Doe",
          "employeeId": "EMP123",
          "bankDetails": "Bank of XYZ",
          "payPeriod": "June 2024",
          "payCycle": "Monthly",
          "taxNumber": "TAX456",
          "earnings": {
            "basicSalary": 25232,
            "overtime": 0,
            "tips": 5046.40
          },
          "deductions": {
            "taxation": 1889,
            // "uif": 2978.20,
            "otherDeductions": 2860,
            "absences": 2
          },
          "grossEarnings": 5350,
          "totalDeductions": 870,
          "netSalaryTransferred": 4480
        },
        {
          "companyName": "XYZ Ltd.",
          "employeeName": "Just Joe",
          "employeeId": "EMP789",
          "bankDetails": "National Bank",
          "payPeriod": "June 2024",
          "payCycle": "Biweekly",
          "taxNumber": "TAX987",
          "earnings": {
            "basicSalary": 25232,
            "overtime": 0,
            "tips": 5046.40
          },
          "deductions": {
            "taxation": 0,
            "uif": 0,
            "otherDeductions": 0,
            "absences": 0
          },
          "grossEarnings": 0,
          "totalDeductions": 0,
          "netSalaryTransferred": 0
        },
        {
          "companyName": "Tech Innovators",
          "employeeName": "Alex Lee",
          "employeeId": "EMP456",
          "bankDetails": "Tech Bank",
          "payPeriod": "June 2024",
          "payCycle": "Weekly",
          "taxNumber": "TAX321",
          "earnings": {
            "basicSalary": 6000,
            "overtime": 400,
            "tips": 70
          },
          "deductions": {
            "taxation": 950,
            "uif": 60,
            "otherDeductions": 25,
            "absences": 0
          },
          "grossEarnings": 6470,
          "totalDeductions": 1035,
          "netSalaryTransferred": 5435
        }
      ]
    }
    
  }, 
  getAllEmployeeName() {
    let employeeData = this.jsonData()
    // Extract employee names
    const employeeNames = employeeData.employees.map(employee => employee.employeeName);
    console.log(employeeNames)
  }, 
  getEmployeeData(data, heads) {
    let jsonData = data
    return jsonData.employees.map(employee => employee[heads])
  },
  actionsHTML() {
    this.employeeNames.addEventListener('change', (event) => {
      let selected = event.target.value
      this.findEmployeeIndexByName(selected)
    })
  },
  findEmployeeIndexByName(targetName) {
    let { employees } = this.jsonData()
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].employeeName === targetName) {
        this.fillEmployeeFields(employees[i])
        return i; // Found the employee with the matching name
      }
    }
      return -1; // Employee not found
  },
  fillEmployeeFields(data) {
    try {
        const { employeeId, bankDetails, companyName, payPeriod, payCycle, taxNumber, earnings, deductions } = data;
        const { basicSalary, overtime, tips } = earnings;
        const { taxation, otherDeductions, uif, absences } = deductions;

        const totalWorkingDays = 242; // Average range from year 2020 to 2040

        // Helper function to convert values to peso
        const convertToPeso = (value) => this.peso(value);

        // Get DOM elements
        const employeeIdDiv = document.getElementById('employeeId');
        const divisionNameDiv = document.getElementById('divisionName');
        const bankDetailsDiv = document.getElementById('bankDetails');
        const basicSalaryDiv = document.getElementById('basicSalary');
        const overtimeDiv = document.getElementById('overtime');
        const tipsDiv = document.getElementById('tips');
        const taxationDiv = document.getElementById('taxation');
        const uifDiv = document.getElementById('uif');
        const otherDeductionsDiv = document.getElementById('otherDeductions');
        const grossEarningsDiv = document.getElementById('grossEarnings');
        const totalDeductionsDiv = document.getElementById('totalDeductions');
        const netSalaryTransferredDiv = document.getElementById('netSalaryTransferred');
        const perDayDiv = document.getElementById('perDayrate');
        const taxNumberDiv = document.getElementById('taxNumber')
        const payCycleDiv = document.getElementById('payCycle')

        const absencesContainer = document.getElementById('absencesContainer')
        const totalHoursDiv = document.getElementById('totalHours')

        let totalAbsences = 0
      
        // Set values to DOM elements
        employeeIdDiv.value = employeeId;
        divisionNameDiv.value = companyName;
        bankDetailsDiv.value = bankDetails;
        taxNumberDiv.value = taxNumber
        payCycleDiv.value = payCycle
        basicSalaryDiv.value = convertToPeso(basicSalary);
        overtimeDiv.value = convertToPeso(overtime);
        tipsDiv.value = convertToPeso(tips);
        taxationDiv.value = convertToPeso(taxation);
        // uifDiv.value = convertToPeso(uif);
        otherDeductionsDiv.value = convertToPeso(otherDeductions);

        // Calculate earnings and deductions
        const grossEarnings = basicSalary + overtime + tips;

        // console.log(taxation??0)
        // console.log(otherDeductions??0)
        // console.log(uif??0)

        // console.log(totalDeductions)

        
        const perDay = (grossEarnings * 12) / totalWorkingDays;

        let shits = deductions?.absences??0

        totalAbsences = perDay * shits

        const totalDeductions = eval(taxation??0) + eval(otherDeductions??0) + eval(uif??0) + eval(totalAbsences);
        const netSalaryTransferred = grossEarnings - (totalDeductions + totalAbsences );
        
        uifDiv.value = convertToPeso(totalAbsences);
        absencesContainer.querySelector('span').innerHTML = parseInt(deductions?.absences??0)
        // absencesContainer.querySelector('bi')
        // console.log( `${perDay} * ${absences} `)

        // Set calculated values to DOM elements
        grossEarningsDiv.value = convertToPeso(grossEarnings);
        totalDeductionsDiv.value = convertToPeso(totalDeductions);
        netSalaryTransferredDiv.value = convertToPeso(netSalaryTransferred);
        perDayDiv.value = convertToPeso(perDay);
        
        totalHoursDiv.addEventListener('change', event =>{
          let value = event.target.value
          netSalaryTransferredDiv.value = convertToPeso( eval((perDay/8) * value) - eval(totalAbsences) )
        })



    } catch (error) {
        console.error("Error filling employee fields:", error);
        // Handle the error appropriately, e.g., show an error message to the user
    }
},
  peso(huh) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
    }).format(huh); 
  }
}

main.init()