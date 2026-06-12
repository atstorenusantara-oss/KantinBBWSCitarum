const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

class PrinterService {
    async printReceipt(salesData) {
        // NOTE: This implementation is for a network printer or local USB printer 
        // using the node-thermal-printer library as requested in file_analisa.md.
        // For production, the interface and address would be configurable in .env

        const os = require('os');
        const path = require('path');
        let printer = new ThermalPrinter({
            type: PrinterTypes.EPSON, // or STAR
            interface: 'file:' + path.join(os.tmpdir(), 'temp_log.txt'), // Dummy interface to avoid "No interface" error
            characterSet: 'PC852_LATIN2',
            removeSpecialCharacters: false,
            lineCharacter: "=",
            width: 32, // Adjusted for 58mm printer
        });

        try {
            printer.alignCenter();
            printer.setTextDoubleHeight();
            printer.setTextDoubleWidth();
            printer.println("Kasir BBWS");
            printer.setTextNormal();
            printer.println("Sistem Kasir Modern");
            printer.println("--------------------------------");

            printer.alignLeft();
            printer.println(`Inv: ${salesData.invoice_number}`);
            printer.println(`Cust: ${salesData.customer_name}`);
            printer.println(`Date: ${new Date().toLocaleString('id-ID')}`);
            printer.println("--------------------------------");

            salesData.items.forEach(item => {
                const itemLine = `${item.name} x${item.qty}`;
                const priceValue = (item.price * item.qty);
                const price = `Rp ${Number(priceValue).toLocaleString()}`;
                const spaces = 32 - itemLine.length - price.length;
                printer.println(`${itemLine}${" ".repeat(spaces > 0 ? spaces : 1)}${price}`);
            });

            printer.println("--------------------------------");
            printer.alignRight();
            printer.println(`Total: Rp ${Number(salesData.total).toLocaleString()}`);
            printer.println(`Pajak (0%): Rp 0`);
            printer.setTextDoubleHeight();
            printer.println(`BAYAR: Rp ${Number(salesData.total).toLocaleString()}`);
            printer.setTextNormal();

            // QRIS Exchange info
            if (salesData.qris_exchange > 0) {
                printer.println("--------------------------------");
                printer.println(`TUKAR TUNAI: Rp ${Number(salesData.qris_exchange).toLocaleString()}`);
                printer.println(`(QRIS PAY: Rp ${Number(Number(salesData.total) + Number(salesData.qris_exchange)).toLocaleString()})`);
            }

            printer.alignCenter();
            printer.newLine();
            printer.println("Terima Kasih Atas Kunjungan Anda");
            printer.println("BBWS");
            printer.alignCenter();
            printer.cut();

            // EXECUTION: Fokus print pada tab, cetak PC dinonaktifkan
            console.log("Cetak fisik PC dinonaktifkan. Membuka preview struk.");
            return {
                success: false,
                message: "Cloud Mode: Cetak fisik dinonaktifkan. Gunakan cetak Bluetooth di Tab.",
                isCloud: true,
                printableData: salesData
            };

        } catch (error) {
            console.error("General Print Error:", error);
            throw error;
        }
    }
}

module.exports = new PrinterService();
