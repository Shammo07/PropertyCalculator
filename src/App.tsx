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
    calculateStampDutyFee
} from './calculations';

Chart.register(...registerables);

const App: React.FC = () => {
   // State for transaction and valuation prices without default values
   const [transactionPrice, setTransactionPrice] = useState<number>();
   const [valuationPrice, setValuationPrice] = useState<number>();

   // Stage 2 variables without default values
   const [initialSavings, setInitialSavings] = useState<number>();
   const [monthlySalary, setMonthlySalary] = useState<number>();
   const [savingPercentage, setSavingPercentage] = useState<number>();
   const [annualReturn, setAnnualReturn] = useState<number>();

   // Stage 3 variables without default value for income
   const [income, setIncome] = useState<number>();

   // Results state
   const [results, setResults] = useState<any>({});
   const [stage, setStage] = useState<number>(0); // To track which stage we are in

   // Function to handle calculations
   const handleCalculateExpenses = () => {
       if (transactionPrice && valuationPrice && initialSavings && monthlySalary && savingPercentage && annualReturn && income) {
           // Calculate expenses
           const downPayment = calculateDownpayment(transactionPrice, valuationPrice);
           const agencyFee = calculateAgencyFee(transactionPrice);
           const legalFee = calculateLegalFee(transactionPrice);
           const mortgageInsurance = calculateMortgageInsurance(transactionPrice, valuationPrice, 10); // Assuming a tenor of 10 years
           const bankLoan = calculateBankLoan(transactionPrice, valuationPrice);
           const stampDutyFee = calculateStampDutyFee(transactionPrice, valuationPrice);

           // Calculate total expense
           const totalExpense = downPayment + agencyFee + legalFee + mortgageInsurance + bankLoan + stampDutyFee;

           // Calculate months needed to save for total expense
           const monthsNeeded = calculateMonthsNeeded(initialSavings, monthlySalary, savingPercentage / 100, annualReturn / 100, totalExpense);

           // Calculate total loan and check stress test and DTI
           const totalLoan = calculateTotalLoan(transactionPrice, valuationPrice, 10); // Assuming a tenor of 10 years
           const dtiResult = checkStressAndDTI(totalLoan, income / 12, 10); // Monthly income

           // Prepare data for chart
           const dataChart = {
               labels: ['Downpayment', 'Agency Fee', 'Legal Fee', 'Mortgage Insurance', 'Stamp Duty Fee', 'Total Expense'],
               datasets: [{
                   label: 'Expenses',
                   data: [
                       downPayment,
                       agencyFee,
                       legalFee,
                       mortgageInsurance,
                       stampDutyFee,
                       totalExpense
                   ],
                   backgroundColor: ['rgba(75,192,192)', 'rgba(255,99,132)', 'rgba(255,206,86)', 'rgba(54,162,235)', 'rgba(153,102,255)', 'rgba(255,159,64)'],
                   borderWidth: 1,
               }],
           };

           setResults({
               downPayment,
               agencyFee,
               legalFee,
               mortgageInsurance,
               bankLoan,
               stampDutyFee,
               totalExpense,
               monthsNeeded,
               dtiResult,
               chartData: dataChart
           });

           setStage(1); // Move to stage 1 results display
       } else {
           alert("Please fill in all fields.");
       }
   };

   return (
       <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
           <h1 style={{ textAlign: 'center' }}>Property Financial Calculator</h1>
           
           {/* Input Section */}
           <div style={{ marginBottom: '20px' }}>
               <h2>Input Values</h2>
               <label>
                   Transaction Price:
                   <input type="number" style={{ marginLeft: '10px' }} value={transactionPrice || ''} onChange={(e) => setTransactionPrice(Number(e.target.value))} />
               </label>
               <br />
               <label>
                   Valuation Price:
                   <input type="number" style={{ marginLeft: '10px' }} value={valuationPrice || ''} onChange={(e) => setValuationPrice(Number(e.target.value))} />
               </label>
               <br />
               
               {/* Stage 2 Inputs */}
               <h2>Stage 2 Inputs</h2>
               <label>
                   Initial Savings:
                   <input type="number" style={{ marginLeft: '10px' }} value={initialSavings || ''} onChange={(e) => setInitialSavings(Number(e.target.value))} />
               </label>
               <br />
               <label>
                   Monthly Salary:
                   <input type="number" style={{ marginLeft: '10px' }} value={monthlySalary || ''} onChange={(e) => setMonthlySalary(Number(e.target.value))} />
               </label>
               <br />
               <label>
                   Saving Percentage:
                   <input type="number" style={{ marginLeft: '10px' }} value={savingPercentage || ''} onChange={(e) => setSavingPercentage(Number(e.target.value))} />
               </label>
               <br />
               <label>
                   Annual Return (%):
                   <input type="number" style={{ marginLeft: '10px' }} value={annualReturn || ''} onChange={(e) => setAnnualReturn(Number(e.target.value))} />
               </label>

               {/* Stage 3 Input */}
               <h2>Stage 3 Input</h2>
               <label>
                   Monthly Income:
                   <input type="number" style={{ marginLeft: '10px' }} value={income || ''} onChange={(e) => setIncome(Number(e.target.value))} />
               </label>

               {/* Calculate Button */}
               <button onClick={handleCalculateExpenses} style={{ marginTop: '20px', padding: '10px', width: '100%' }}>Calculate</button>
           </div>

           {/* Results Section */}
           {stage === 1 && results.totalExpense !== undefined && (
               <>
                   <h2>Stage 1 Results - Expenses Breakdown</h2>
                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                       <thead>
                           <tr>
                               <th style={{ borderBottom: '1px solid #ddd' }}>Description</th>
                               <th style={{ borderBottom: '1px solid #ddd' }}>Amount ($)</th>
                           </tr>
                       </thead>
                       <tbody>
                           <tr><td>Downpayment</td><td>${results.downPayment.toLocaleString()}</td></tr>
                           <tr><td>Agency Fee</td><td>${results.agencyFee.toLocaleString()}</td></tr>
                           <tr><td>Legal Fee</td><td>${results.legalFee.toLocaleString()}</td></tr>
                           <tr><td>Mortgage Insurance</td><td>${results.mortgageInsurance.toLocaleString()}</td></tr>
                           <tr><td>Bank Loan</td><td>${results.bankLoan.toLocaleString()}</td></tr>
                           <tr><td>Stamp Duty Fee</td><td>${results.stampDutyFee.toLocaleString()}</td></tr>
                           <tr style={{ fontWeight: 'bold' }}><td>Total Expense</td><td>${results.totalExpense.toLocaleString()}</td></tr>
                       </tbody>
                   </table>
                   <button onClick={() => setStage(2)} style={{ marginTop: '20px', padding: '10px', width: '100%' }}>Proceed to Stage 2</button>
               </>
           )}

           {stage === 2 && results.monthsNeeded !== undefined && (
               <>
                   <h2>Stage 2 Results - Months Needed to Save for Total Expense</h2>
                   <h3 style={{ fontSize: '24px', marginTop: '20px' }}>Months Needed:</h3>
                   <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{results.monthsNeeded}</p>
                   <button onClick={() => setStage(3)} style={{ marginTop: '20px', padding: '10px', width: '100%' }}>Proceed to Stage 3</button>
               </>
           )}

           {stage === 3 && (
               <>
                   {/* Stage 3 Results - DTI Result */}
                   <h2>Stage 3 Results - Debt-to-Income (DTI) Check</h2>
                   <p>{results.dtiResult}</p>

                   {/* Chart Display */}
                   {results.chartData && (
                       <>
                           <h3>Expenses Chart:</h3>
                           <Bar data={results.chartData} />
                       </>
                   )}
               </>
           )}
       </div>
   );
}

export default App;
