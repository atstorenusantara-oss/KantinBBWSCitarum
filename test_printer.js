const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

async function testPrinter() {
    let printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: 'printer:RONGTA 58mm Series Printer',
    });

    try {
        console.log("Checking printer connection...");
        const isConnected = await printer.isPrinterConnected();
        console.log("Is Connected:", isConnected);

        if (isConnected) {
            printer.alignCenter();
            printer.println("TEST PRINT");
            printer.cut();
            await printer.execute();
            console.log("Print executed!");
        } else {
            console.log("Printer not detected through library.");
        }
    } catch (error) {
        console.error("Printer Test Error:", error);
    }
}

testPrinter();
