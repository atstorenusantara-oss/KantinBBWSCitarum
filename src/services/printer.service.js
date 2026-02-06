const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

class PrinterService {
    async printReceipt(salesData) {
        // NOTE: This implementation is for a network printer or local USB printer 
        // using the node-thermal-printer library as requested in file_analisa.md.
        // For production, the interface and address would be configurable in .env

        let printer = new ThermalPrinter({
            type: PrinterTypes.EPSON, // or STAR
            interface: 'printer:My-Thermal-Printer', // Default name or IP
            characterSet: 'PC852_LATIN2',
            removeSpecialCharacters: false,
            lineCharacter: "=",
            width: 42, // printer width
        });

        try {
            const isConnected = await printer.isPrinterConnected();
            if (!isConnected) {
                console.warn("Printer not connected. Printing to console/log instead.");
                // We'll proceed with log for demo if no physical printer
            }

            printer.alignCenter();
            printer.setTextDoubleHeight();
            printer.setTextDoubleWidth();
            printer.println("G-COFFEE");
            printer.setTextNormal();
            printer.println("Sistem Kasir Modern");
            printer.println("--------------------------------");

            printer.alignLeft();
            printer.println(`Inv: ${salesData.invoice_number}`);
            printer.println(`Cust: ${salesData.customer_name}`);
            printer.println(`Date: ${new Date().toLocaleString('id-ID')}`);
            printer.println("--------------------------------");

            salesData.items.forEach(item => {
                // Formatting item line: "Product Name xQty   Price"
                const itemLine = `${item.name} x${item.qty}`;
                const price = `Rp ${Number(item.price * item.qty).toLocaleString()}`;

                // Simple padding logic
                const spaces = 32 - itemLine.length - price.length;
                printer.println(`${itemLine}${" ".repeat(spaces > 0 ? spaces : 1)}${price}`);
            });

            printer.println("--------------------------------");
            printer.alignRight();
            printer.println(`Subtotal: Rp ${Number(salesData.total / 1.1).toLocaleString()}`);
            printer.println(`Pajak (10%): Rp ${Number(salesData.total - (salesData.total / 1.1)).toLocaleString()}`);
            printer.setTextDoubleHeight();
            printer.println(`TOTAL: Rp ${Number(salesData.total).toLocaleString()}`);
            printer.setTextNormal();

            printer.alignCenter();
            printer.newLine();
            printer.println("Terima Kasih Atas Kunjungan Anda");
            printer.println("Follow IG: @gcoffee.id");
            printer.alignCenter();
            printer.cut();

            // Only execute if not in dry run mode or if connected
            if (isConnected) {
                await printer.execute();
                return { success: true, message: "Struk dicetak" };
            } else {
                console.log("MOCK PRINT OUTPUT:\n", printer.getText());
                return { success: true, message: "Printer tidak terdeteksi, cetak disimulasi di server", raw: printer.getText() };
            }

        } catch (error) {
            console.error("Print Error:", error);
            throw error;
        }
    }
}

module.exports = new PrinterService();
