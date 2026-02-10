const printerService = require('./src/services/printer.service');

async function testFinal() {
    const mockSale = {
        invoice_number: "TEST-VOICE",
        customer_name: "Uji Coba G-Coffee",
        total: 22000,
        items: [
            { name: "Kopi Susu Uji", qty: 1, price: 20000 }
        ]
    };

    console.log("Starting final test...");
    try {
        const result = await printerService.printReceipt(mockSale);
        console.log("Result:", result);
    } catch (err) {
        console.error("Final Test Error:", err);
    }
}

testFinal();
