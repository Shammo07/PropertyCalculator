// src/calculations.ts

// Function to calculate downpayment
export function calculateDownpayment(transactionPrice: number, valuationPrice: number): number {
    return 0.1 * Math.min(transactionPrice, valuationPrice) + Math.max(transactionPrice - valuationPrice, 0);
}

// Function to calculate agency fee
export function calculateAgencyFee(transactionPrice: number): number {
    return 0.01 * transactionPrice;
}

// Function to calculate legal fee
export function calculateLegalFee(transactionPrice: number): number {
    const disbursementLegalFee = 3000;
    if (transactionPrice < 3000000) {
        return 5000 + disbursementLegalFee;
    } else if (transactionPrice <= 6000000) {
        return 6500 + disbursementLegalFee;
    } else if (transactionPrice < 10000000) {
        return 8000 + disbursementLegalFee;
    } else {
        return disbursementLegalFee + (0.001 * transactionPrice);
    }
}

//Calculate StampDuty Fee
export function calculateStampDutyFee(transactionPrice: number, valuationPrice: number): number {
    // Determine the price to use based on transaction and valuation prices
    const price = Math.max(transactionPrice, valuationPrice);

    // Calculate the stamp duty fee based on the given price
    let stampFee: number;

    if (price < 3000000) {
        return 100;
    } else if (price < 3528240) {
        stampFee = 100 + 0.1 * (price - 3000000);
    } else if (price < 4500000) {
        stampFee = 0.015 * price;
    } else if (price < 4935480) {
        stampFee = 67500 + 0.1 * (price - 4500000);
    } else if (price < 6000000) {
        stampFee = 0.0225 * price;
    } else if (price < 6642860) {
        stampFee = 135000 + 0.1 * (price - 6000000);
    } else if (price < 9000000) {
        stampFee = 0.03 * price;
    } else if (price < 10080000) {
        stampFee = 270000 + 0.1 * (price - 9000000);
    } else if (price < 20000000) {
        stampFee = 0.0375 * price;
    } else if (price < 21739120) {
        stampFee = 750000 + 0.1 * (price - 20000000);
    } else {
        stampFee = 0.0425 * price;
    }

    return Math.round(stampFee);
}


// Function to calculate mortgage insurance
export function calculateMortgageInsurance(transactionPrice: number, valuationPrice: number, years: number): number {
    const mortgageInsurance = 0.20 * valuationPrice;
    const price = Math.min(transactionPrice, valuationPrice);
    
    let spp = 0;
    if (price <= 6000000) {
        if (years === 10) spp = 0.0116 * price;
        else if (years === 15) spp = 0.0137 * price;
        else if (years === 20) spp = 0.0170 * price;
        else if (years === 25) spp = 0.0192 * price;
        else if (years === 30) spp = 0.0205 * price;
    } else if (price <= 15000000) {
        if (years === 10) spp = 0.0135 * price;
        else if (years === 15) spp = 0.0160 * price;
        else if (years === 20) spp = 0.0198 * price;
        else if (years === 25) spp = 0.0223 * price;
        else if (years === 30) spp = 0.0238 * price;
    }

    return Math.round(spp + mortgageInsurance);
}

// Function to calculate bank loan
export function calculateBankLoan(transactionPrice: number, valuationPrice: number): number {
    return Math.round(0.9 * Math.min(transactionPrice, valuationPrice));
}

// Function to calculate salary saved per month
export function calculateSalarySaved(salary: number, savingPercentage: number): number {
    return salary * (savingPercentage / 100);
}

// Function to calculate the return on investment per month
export function calculateROIperMonth(cumulativeSaving: number, annualReturn: number): number {
    return cumulativeSaving * (annualReturn / 12);
}

// Function to calculate the months needed to acquire the total expense of purchasing property
export function calculateMonthsNeeded(initialSavings: number, monthlySalary: number, savingPercentage: number, annualReturn: number, expenseRequired: number): number {
    let months = 0;
    let cumulativeSaving = initialSavings;

    while (cumulativeSaving < expenseRequired) {
        cumulativeSaving += calculateROIperMonth(cumulativeSaving, annualReturn);
        cumulativeSaving += calculateSalarySaved(monthlySalary, savingPercentage);
        months += 1;
    }
    
    return months;
}

// Import amortization calculation function
// src/calculations.ts

// Import amortization calculation function if using an external library
// import { calculate_amortization_amount } from 'amortization.amount'; // Comment this out if using internal function

// Function to calculate monthly payment using amortization formula
export function calculate_amortization_amount(loan: number, annualInterestRate: number, years: number): number {
    const monthlyInterestRate = (annualInterestRate / 100) / 12;
    const numberOfPayments = years * 12;

    // Amortization formula
    const monthlyPayment = (loan * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    
    return monthlyPayment || 0; // Return 0 if calculation fails
}

// Function to calculate monthly payment using amortization formula
// Function to calculate the monthly payment amount
export function calculateMonthlyPayment(loan: number, interest: number, tenor: number): number {
    const amount = calculate_amortization_amount(loan, interest, tenor);
    return Math.round(amount);
}

// Function to calculate the total loan
export function calculateTotalLoan(transactionPrice: number, valuationPrice: number, years: number): number {
    const totalLoan = calculateBankLoan(transactionPrice, valuationPrice) + calculateMortgageInsurance(transactionPrice, valuationPrice, years);
    return Math.round(totalLoan);
}

// Function to check stress test and DTI
export function checkStressAndDTI(totalLoan: number, income: number, years: number): string {
    let interest = parseFloat(prompt("Please enter the compound interest:") || "0");
    
    const paymentForStress = calculateMonthlyPayment(totalLoan, interest, years);
    const paymentForDTI = calculateMonthlyPayment(totalLoan, interest + 0.02, years);

    if (paymentForStress <= income * 0.60) {
        return "Both the DTI-ratio and stress test are fulfilled.";
    } else if (paymentForDTI <= income * 0.50) {
        return "The DTI-ratio is fulfilled but the stress test is not fulfilled.";
    } else {
        return "Neither the DTI-ratio nor the stress test are fulfilled.";
    }
}
