const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

class PrinterService {
    async printReceipt(salesData) {
        // NOTE: This implementation is for a network printer or local USB printer 
        // using the node-thermal-printer library as requested in file_analisa.md.
        // For production, the interface and address would be configurable in .env

        let printer = new ThermalPrinter({
            type: PrinterTypes.EPSON, // or STAR
            interface: 'file:temp_log.txt', // Dummy interface to avoid "No interface" error
            characterSet: 'PC852_LATIN2',
            removeSpecialCharacters: false,
            lineCharacter: "=",
            width: 32, // Adjusted for 58mm printer
        });

        try {
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
            printer.println("Follow IG: @gcoffee.id");
            printer.alignCenter();
            printer.cut();

            // EXECUTION: Only on Windows
            const isWindows = process.platform === "win32";

            if (!isWindows) {
                console.log("Not on Windows. Skipping physical print execution.");
                return {
                    success: false,
                    message: "Cloud Mode: Cetak fisik dinonaktifkan. Gunakan cetak dari browser.",
                    isCloud: true,
                    printableData: salesData
                };
            }

            const fs = require('fs');
            const path = require('path');
            const { execSync } = require('child_process');

            const buffer = printer.getBuffer();
            const tempFile = path.normalize(path.join(process.cwd(), `temp_print_${Date.now()}.bin`));
            fs.writeFileSync(tempFile, buffer);

            try {
                const printerName = process.env.PRINTER_NAME || "RONGTA 58mm Series Printer";
                const scriptPath = path.join(process.cwd(), 'legacy_tools', 'print_raw.ps1');

                // Call the PowerShell script
                execSync(`powershell -ExecutionPolicy Bypass -File "${scriptPath}" "${printerName}" "${tempFile}"`, { encoding: 'utf8' });
                return { success: true, message: "Struk dicetak" };
            } catch (printErr) {
                console.error("Spooler Print Failed:", printErr.message);
                return {
                    success: false,
                    message: "Gagal mencetak: Pastikan printer terhubung.",
                    raw: printer.getText()
                };
            } finally {
                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            }

        } catch (error) {
            console.error("General Print Error:", error);
            throw error;
        }
    }
}

module.exports = new PrinterService();
