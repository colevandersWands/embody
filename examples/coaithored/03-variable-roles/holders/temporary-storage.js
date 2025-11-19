'use strict';

/* Variable Roles: Temporary Storage Overview

Temporary storage concepts distilled to essence:
- temporary-storage-essence.js - intermediate results for clarity
- (additional focused examples as needed)

Study with: Start with temporary-storage-essence.js */

// Advanced temporary storage patterns
function demonstrateStringProcessing() {
    console.log('=== String Processing with Temporaries ===');
    
    let email = 'user.name@example.com';
    
    // Multi-step string processing using temporaries
    let lowercased = email.toLowerCase();           // TEMPORARY: normalize case
    let withoutDots = lowercased.replace('.', '_'); // TEMPORARY: replace dots
    let parts = withoutDots.split('@');             // TEMPORARY: split on @
    let username = parts[0];                        // TEMPORARY: extract username
    let domain = parts[1];                          // TEMPORARY: extract domain
    let processed = `${username}_at_${domain}`;     // Final result
    
    console.log('Email processing steps:');
    console.log('  Original:', email);
    console.log('  Lowercased:', lowercased);
    console.log('  Dots replaced:', withoutDots);
    console.log('  Username:', username);
    console.log('  Domain:', domain);
    console.log('  Final:', processed);
}

function demonstrateArrayProcessing() {
    console.log('\n=== Array Processing with Temporaries ===');
    
    let numbers = [1, 2, 3, 4, 5];
    
    // Process array using temporary variables for each step
    let doubled = numbers.map(n => n * 2);          // TEMPORARY: all doubled
    let filtered = doubled.filter(n => n > 5);      // TEMPORARY: only > 5
    let sum = filtered.reduce((acc, n) => acc + n, 0); // TEMPORARY: sum total
    let average = sum / filtered.length;            // Final calculation
    
    console.log('Array processing steps:');
    console.log('  Original:', numbers);
    console.log('  Doubled:', doubled);
    console.log('  Filtered (>5):', filtered);
    console.log('  Sum:', sum);
    console.log('  Average:', average);
}

function demonstrateObjectProcessing() {
    console.log('\n=== Object Processing with Temporaries ===');
    
    let product = { name: 'Widget', price: 29.99, category: 'tools' };
    let discount = 0.15; // 15% discount
    
    // Build new object using temporaries
    let originalPrice = product.price;              // TEMPORARY: extract price
    let discountAmount = originalPrice * discount;  // TEMPORARY: calculate discount
    let finalPrice = originalPrice - discountAmount; // TEMPORARY: apply discount
    let roundedPrice = Math.round(finalPrice * 100) / 100; // TEMPORARY: round to cents
    let displayName = product.name.toUpperCase();   // TEMPORARY: format name
    
    let processedProduct = {
        name: displayName,
        originalPrice: originalPrice,
        discount: discountAmount,
        finalPrice: roundedPrice,
        category: product.category
    };
    
    console.log('Object processing:');
    console.log('  Original price:', originalPrice);
    console.log('  Discount amount:', discountAmount);
    console.log('  Final price:', finalPrice);
    console.log('  Rounded price:', roundedPrice);
    console.log('  Display name:', displayName);
    console.log('  Processed:', processedProduct);
}

function demonstrateComplexCalculations() {
    console.log('\n=== Complex Calculations with Temporaries ===');
    
    // Mortgage calculation broken into clear steps
    let principal = 200000;  // Loan amount
    let annualRate = 0.045;  // 4.5% annual rate
    let years = 30;          // 30-year loan
    
    let monthlyRate = annualRate / 12;              // TEMPORARY: monthly rate
    let numPayments = years * 12;                   // TEMPORARY: total payments
    let rateExponent = Math.pow(1 + monthlyRate, numPayments); // TEMPORARY: rate compound
    let numerator = principal * monthlyRate * rateExponent;    // TEMPORARY: top of formula
    let denominator = rateExponent - 1;             // TEMPORARY: bottom of formula
    let monthlyPayment = numerator / denominator;   // Final result
    
    console.log('Mortgage calculation breakdown:');
    console.log('  Principal:', principal);
    console.log('  Monthly rate:', monthlyRate);
    console.log('  Number of payments:', numPayments);
    console.log('  Rate exponent:', rateExponent);
    console.log('  Numerator:', numerator);
    console.log('  Denominator:', denominator);
    console.log('  Monthly payment:', monthlyPayment.toFixed(2));
}

demonstrateStringProcessing();
demonstrateArrayProcessing();
demonstrateObjectProcessing();
demonstrateComplexCalculations();

/* See essence files for focused temporary storage exploration */