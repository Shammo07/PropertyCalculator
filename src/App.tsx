import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { 
    calculateDownpayment,
    calculateAgencyFee,
    calculateLegalFee,
    calculateMortgageInsurance,
    calculateBankLoan,
    calculateSalarySaved,
    calculateROIperMonth,
    calculateMonthsNeeded,
    calculateTotalLoan,
    checkStressAndDTI,
    calculateStampDutyFee,
} from './calculations';

Chart.register(...registerables);

const App: React.FC = () => {
   // State for transaction and valuation prices
   const [transactionPrice, setTransactionPrice] = useState<number>(8000000); // Example default value for testing
   const [valuationPrice, setValuationPrice] = useState<number>(9000000); // Example default value for testing

   // Stage variables for savings and income calculations
   const [initialSavings, setInitialSavings] = useState<number>(200000); // Example default value for testing
   const [monthlySalary, setMonthlySalary] = useState<number>(30000); // Example default value for testing
   const [savingPercentage, setSavingPercentage] = useState<number>(10); // Example default value for testing
   const [annualReturn, setAnnualReturn] = useState<number>(5); // Example default value for testing

   // Stage variables for income calculations
   const [income, setIncome] = useState<number>(120000); // Example default value for testing

   // Results state
   const [results, setResults] = useState<any>({});

   // Function to handle calculations
   const handleCalculateExpenses = () => {
       // Calculate expenses
       const downPayment = calculateDownpayment(transactionPrice, valuationPrice);
       const agencyFee = calculateAgencyFee(transactionPrice);
       const legalFee = calculateLegalFee(transactionPrice);
       const mortgageInsurance = calculateMortgageInsurance(transactionPrice, valuationPrice, /* tenor */15); 
       const bankLoanAmount = calculateBankLoan(transactionPrice, valuationPrice);
       const stampDutyFee = calculateStampDutyFee(transactionPrice, valuationPrice);

       // Calculate total expense
       const totalExpense =
           downPayment +
           agencyFee +
           legalFee +
           mortgageInsurance -
           bankLoanAmount +
           stampDutyFee; 

       // Calculate months needed to save for total expense
       const monthsNeeded =
           calculateMonthsNeeded(initialSavings, monthlySalary, savingPercentage /100 , annualReturn /100 , totalExpense);

       // Calculate total loan and check stress test and DTI
       const totalLoan =
           calculateTotalLoan(transactionPrice ,valuationPrice ,15); 
       const dtiResult =
           checkStressAndDTI(totalLoan , income ,15 ); 

       // Prepare data for chart display
       const dataChart={
           labels:['Downpayment', 'Agency Fee', 'Legal Fee', 'Mortgage Insurance', 'Stamp Duty Fee', 'Total Expense'],
           datasets:[{
               label:'Expenses',
               data:[
                   downPayment,
                   agencyFee,
                   legalFee,
                   mortgageInsurance,
                   stampDutyFee,
                   totalExpense,
               ],
               backgroundColor:[
                   'rgba(75 ,192 ,192)',
                   'rgba(255 ,99 ,132)',
                   'rgba(255 ,206 ,86)',
                   'rgba(54 ,162 ,235)',
                   'rgba(153 ,102 ,255)',
                   'rgba(255 ,159 ,64)',
               ],
               borderWidth :1 ,
           }],
       };

       setResults({
           totalExpense,
           monthsNeeded,
           dtiResult,
           chartData:dataChart ,
       });
   };

   return (
       <div style={{ padding:'20px' }}>
           <h1>Property Financial Calculator</h1>
           
           {/* Input Section */}
           <div>
               <label>
                   Transaction Price:
                   <input type="number" value={transactionPrice} onChange={(e) => setTransactionPrice(Number(e.target.value))} />
               </label>
               <br />
               <label>
                   Valuation Price:
                   <input type="number" value={valuationPrice} onChange={(e) => setValuationPrice(Number(e.target.value))} />
               </label>
               <br />
               
               {/* Stage Inputs */}
               <h2>Stage Inputs</h2>
               <label>
                   Initial Savings:
                   <input type="number" value={initialSavings} onChange={(e) => setInitialSavings(Number(e.target.value))} />
               </label>
               <br />
               <label>
                   Monthly Salary:
                   <input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(Number(e.target.value))} />
               </label>
               <br />
               <label>
                   Saving Percentage:
                   <input type="number" value={savingPercentage} onChange={(e) => setSavingPercentage(Number(e.target.value))} />
               </label>
               <br />
               <label>
                   Annual Return (%):
                   <input type="number" value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))} />
               </label>

               {/* Income Input */}
               <h2>Income Input</h2>
               <label>
                   Monthly Income:
                   <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
               </label>

               {/* Calculate Button */}
               <button onClick={handleCalculateExpenses}>Calculate</button>
           </div>

           {/* Results Section */}
           {results.totalExpense !== undefined && (
               <>
                   <h2>Results</h2>
                   <p>Total Expense: {results.totalExpense}</p>
                   <p>Months Needed to Save: {results.monthsNeeded}</p>
                   <p>{results.dtiResult}</p>

                   {/* Chart Display */}
                   {results.chartData && (
                       <Bar data={results.chartData} />
                   )}
               </>
           )}
       </div>
   );
}

export default App;
