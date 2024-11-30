// Function to calculate downpayment
export function calculateDownpayment(transactionPrice: number, valuationPrice: number): number {
    return 0.1 * Math.min(transactionPrice, valuationPrice) + Math.max(transactionPrice - valuationPrice, 0);
}

// Function to calculate agency fee
export function calculateAgencyFee(transactionPrice: number): number {
    return Math.round(0.01 * transactionPrice);
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
        return Math.round(disbursementLegalFee + (0.001 * transactionPrice));
    }
}

// Calculate Stamp Duty Fee
export function calculateStampDutyFee(transactionPrice: number, valuationPrice: number): number {
    const price = Math.max(transactionPrice, valuationPrice);
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
    const price = Math.min(transactionPrice, valuationPrice);
    const loan = 0.90 * price;
    let spp = 0;
    if (price <= 6000000) {
        if (years === 10) spp = 0.0116 * loan;
        else if (years === 15) spp = 0.0137 * loan;
        else if (years === 20) spp = 0.0170 * loan;
        else if (years === 25) spp = 0.0192 * loan;
        else if (years === 30) spp = 0.0205 * loan;
    } else if (price <= 15000000) {
        if (years === 10) spp = 0.0135 * loan;
        else if (years === 15) spp = 0.0160 * loan;
        else if (years === 20) spp = 0.0198 * loan;
        else if (years === 25) spp = 0.0223 * loan;
        else if (years === 30) spp = 0.0238 * loan;
    }

    return Math.round(spp);
}

export function calculateBankRebate(expense: number): number {
    let rebatePercentage = 0;
    while (true) {
        try {
            rebatePercentage = parseFloat(prompt("Enter the bank rebate percentage(between 0.5 and 2.5): ") || '');

            if (rebatePercentage >= 0.5 && rebatePercentage <= 2.5) {
                break;
            } else {
                console.log("Please enter a bank rebate percentage between 0.5 and 2.5.");
            }
        } catch (error) {
            console.log("Invalid input. Please enter a number between 0.5 and 2.5.");
        }
    }

    return Math.round((rebatePercentage / 100) * expense);
}

// Function to calculate bank loan
export function calculateBankLoan(transactionPrice: number, valuationPrice: number): number {
    return Math.round(0.9 * Math.min(transactionPrice, valuationPrice));
}

// Function to calculate salary saved per month
export function calculateSalarySaved(salary: number, savingPercentage: number): number {
    return Math.round(salary * (savingPercentage / 100));
}

// Function to calculate the return on investment per month
export function calculateROIperMonth(cumulativeSaving: number, annualReturn: number): number {
    const annualReturnPercent = annualReturn/100;
    return Math.round(cumulativeSaving * (annualReturnPercent / 12));
}

// Function to calculate the months needed to acquire the total expense of purchasing property
export function calculateMonthsNeeded(initialSavings: number, monthlySalary: number, savingPercentage: number, annualReturn: number, expenseRequired: number): number {
    let cumulativeSaving = initialSavings;
    let months = 0;
    while (cumulativeSaving < expenseRequired) {
        cumulativeSaving += calculateROIperMonth(cumulativeSaving, annualReturn);
        cumulativeSaving += calculateSalarySaved(monthlySalary, savingPercentage);
        months += 1;
    }

    return months;
}

// Function to calculate monthly payment using amortization formula
export function calculateAmortizationAmount(loan: number, annualInterestRate: number, months: number): number {
    const monthlyInterestRate = annualInterestRate / 100 / 12; // Convert annual rate to monthly and percentage to decimal
    const totalPayments = months; // Use months directly

    // Amortization formula
    const monthlyPayment =
        (loan * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

    return Math.round(monthlyPayment || 0); // Return rounded value or zero
}

// Function to calculate monthly payment using amortization formula
export function calculateMonthlyPayment(loan: number, interestRate: number, tenorInYears: number): number {
    const months = tenorInYears * 12; // Convert years to months
    const amount = calculateAmortizationAmount(loan, interestRate, months);
    return Math.round(amount); // Return already rounded value from the amortization calculation
}

// Function to calculate the total loan
export function calculateTotalLoan(transactionPrice: number, valuationPrice: number, years: number): number {
    const totalLoan =
        calculateBankLoan(transactionPrice, valuationPrice) +
        calculateMortgageInsurance(transactionPrice, valuationPrice, years);

    return Math.round(totalLoan);
}

// Function to check stress test and DTI
export function checkStressAndDTI(totalLoan: number, income: number, years: number): string {
    let interestRateInput = parseFloat(prompt("Please enter the percentage for compound interest for " + years + " years:") || "") / 100;

    const paymentForStress =
        calculateMonthlyPayment(totalLoan, interestRateInput + .02, years); // Use years directly for payments
    const paymentForDTI =
        calculateMonthlyPayment(totalLoan, interestRateInput, years); // Use years directly for payments

    const salaryNeededForStress =
        paymentForStress / .60;
    const salaryNeededForDTI =
        paymentForDTI / .50;

    let stringToReturn = "";


    stringToReturn += `The salary required to fulfill the stress test is: ${Math.round(salaryNeededForStress)}\n`;
    stringToReturn += `The salary required to fulfill the DTI ratio is: ${Math.round(salaryNeededForDTI)}\n`;

    if (income >= salaryNeededForStress && income >= salaryNeededForDTI) {
        stringToReturn += "Both the DTI-ratio and stress test are fulfilled.\n";
        return stringToReturn;
    }
    else if (income >= salaryNeededForStress) {
        stringToReturn += "The Stress test is fulfilled but the DTI-ratio is not fulfilled.\n";
        return stringToReturn;
    }
    else if (income >= salaryNeededForDTI) {
        stringToReturn += "The DTI-ratio is fulfilled but the Stress Test is not fulfilled.\n";
        return stringToReturn;
    } else {
        stringToReturn += "Neither the DTI-ratio nor the stress test are fulfilled.\n";
        return stringToReturn;
    }
}
